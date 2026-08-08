import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ success: false }, { status: 401 });
    
    const currentUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (currentUser?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const disputes = await prisma.job.findMany({
      where: { status: 'DISPUTED' },
      include: {
        customer: true,
        merchant: true
      },
      orderBy: { updatedAt: 'desc' }
    });
    
    return NextResponse.json({ success: true, data: disputes });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// Admins can resolve the dispute by changing status to COMPLETED (to pay merchant) or REJECTED (to refund customer/cancel)
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false }, { status: 401 });
    
    const currentUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (currentUser?.role !== 'SUPER_ADMIN') return NextResponse.json({ success: false }, { status: 403 });

    const { jobId, resolution } = await req.json(); // resolution = 'FAVOR_MERCHANT' | 'FAVOR_CUSTOMER'

    if (resolution === 'FAVOR_MERCHANT') {
      const updated = await prisma.job.update({
        where: { id: jobId },
        data: { status: 'COMPLETED' } // merchant can now claim escrow or we auto-confirm
      });
      return NextResponse.json({ success: true, data: updated });
    } else if (resolution === 'FAVOR_CUSTOMER') {
      const updated = await prisma.job.update({
        where: { id: jobId },
        data: { status: 'REJECTED', escrowStatus: 'LOCKED' } // refund logic can be added here
      });
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, message: 'Invalid resolution' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
