import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json({ success: false, message: 'Job ID is required' }, { status: 400 });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job || job.customerId !== user.id) {
      return NextResponse.json({ success: false, message: 'Job not found or unauthorized' }, { status: 404 });
    }

    if (job.status !== 'COMPLETED') {
      return NextResponse.json({ success: false, message: 'Job is not completed yet' }, { status: 400 });
    }

    const confirmedCount = await prisma.job.count({
      where: { customerId: user.id, status: 'CONFIRMED' }
    });

    // Update job status to CONFIRMED and escrow status to RELEASED
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'CONFIRMED',
        escrowStatus: 'RELEASED',
      }
    });
    
    // (Optional) We could update merchant wallet here to transfer the escrow balance to available balance

    // Referral Logic
    if (confirmedCount === 0) {
      const customer = await prisma.user.findUnique({ where: { id: user.id } });
      if (customer?.referredBy) {
         const referrer = await prisma.user.findUnique({ where: { referralCode: customer.referredBy }});
         if (referrer) {
           let referrerWallet = await prisma.wallet.findFirst({ where: { userId: referrer.id, type: 'EARNED' } });
           if (!referrerWallet) {
              referrerWallet = await prisma.wallet.create({ data: { userId: referrer.id, type: 'EARNED', availableBalance: 0 }});
           }
           await prisma.wallet.update({
             where: { id: referrerWallet.id },
             data: { availableBalance: { increment: 100 } }
           });
           await prisma.walletTransaction.create({
             data: {
               walletId: referrerWallet.id,
               type: 'CREDIT',
               status: 'COMPLETED',
               amount: 100,
               description: 'Referral Bonus for ' + customer.name
             }
           });
           await prisma.notification.create({
             data: {
               userId: referrer.id,
               title: 'Referral Bonus!',
               message: `You earned 100 credits because ${customer.name} completed their first booking.`,
               type: 'SYSTEM'
             }
           });
         }
      }
    }

    return NextResponse.json({ success: true, data: updatedJob });
  } catch (error) {
    console.error('Error confirming job:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
