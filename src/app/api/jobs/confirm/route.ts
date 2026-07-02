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

    // Update job status to CONFIRMED and escrow status to RELEASED
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'CONFIRMED',
        escrowStatus: 'RELEASED',
      }
    });
    
    // (Optional) We could update merchant wallet here to transfer the escrow balance to available balance

    return NextResponse.json({ success: true, data: updatedJob });
  } catch (error) {
    console.error('Error confirming job:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
