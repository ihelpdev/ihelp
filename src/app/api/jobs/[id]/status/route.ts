import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import { JobStatus, EscrowStatus } from '@prisma/client';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !Object.values(JobStatus).includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    // Verify the user is the merchant for this job or has rights
    const job = await prisma.job.findUnique({ where: { id } });
    
    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    if (job.merchantId && job.merchantId !== user.id && job.customerId !== user.id) {
       return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    // Determine escrow status updates based on job status
    let newEscrowStatus = job.escrowStatus;
    if (status === JobStatus.COMPLETED) {
      newEscrowStatus = EscrowStatus.RELEASED;
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        status: status as JobStatus,
        escrowStatus: newEscrowStatus,
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        id: updatedJob.id,
        status: updatedJob.status.toLowerCase(),
        escrowStatus: updatedJob.escrowStatus.toLowerCase()
      } 
    });

  } catch (err: any) {
    console.error('Error updating job status:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
