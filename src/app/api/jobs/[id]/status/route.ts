import { NextResponse } from 'next/server';
import { getAuthUser } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import { JobStatus, EscrowStatus } from '@prisma/client';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, error } = await getAuthUser();

    if (error) {
      return NextResponse.json({ success: false, message: `Auth error: ${error.message}` }, { status: 401 });
    }
    if (!user) {
      return NextResponse.json({ success: false, message: 'No active session' }, { status: 401 });
    }

    const body = await req.json();
    const { status, customerDisputeEvidenceText, customerDisputeEvidenceImages } = body;

    if (!status || !Object.values(JobStatus).includes(status)) {
      return NextResponse.json({ success: false, message: `Invalid status: ${status}` }, { status: 400 });
    }

    // Verify the user is the merchant for this job or has rights
    const job = await prisma.job.findUnique({ where: { id } });
    
    if (!job) {
      return NextResponse.json({ success: false, message: `Job not found: ${id}` }, { status: 404 });
    }

    if (job.merchantId && job.merchantId !== user.id && job.customerId !== user.id) {
       return NextResponse.json({ success: false, message: `Forbidden: Job belongs to merchant ${job.merchantId}, you are ${user.id}` }, { status: 403 });
    }

    // Determine escrow status updates based on job status
    let newEscrowStatus = job.escrowStatus;
    // Escrow is released by customer confirmation API, not here

    const updateData: any = {
      status: status as JobStatus,
      escrowStatus: newEscrowStatus,
    };

    if (customerDisputeEvidenceText !== undefined) updateData.customerDisputeEvidenceText = customerDisputeEvidenceText;
    if (customerDisputeEvidenceImages !== undefined) updateData.customerDisputeEvidenceImages = customerDisputeEvidenceImages;

    if (status === JobStatus.ACCEPTED && !job.merchantId) {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (dbUser?.role === 'MERCHANT') {
        updateData.merchantId = user.id;
      }
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: updateData,
    });

    // Create Notification
    let notifTitle = "";
    let notifMsg = "";
    let notifUserId = job.customerId; // default to customer

    if (status === JobStatus.ACCEPTED) {
       notifTitle = "Request Accepted";
       notifMsg = `A merchant has accepted your request.`;
    } else if (status === JobStatus.EN_ROUTE) {
       notifTitle = "Merchant En Route";
       notifMsg = `Your merchant is on their way!`;
    } else if (status === JobStatus.COMPLETED) {
       notifTitle = "Job Completed";
       notifMsg = `The merchant has marked the job as completed. Please confirm to release payment.`;
    } else if (status === JobStatus.REJECTED) {
       notifTitle = "Request Cancelled";
       notifMsg = `Your request was cancelled.`;
    } else if (status === JobStatus.DISPUTED) {
       if (job.merchantId) {
         notifTitle = "Job Disputed";
         notifMsg = `The customer has raised a dispute against your job. Please submit your evidence.`;
         notifUserId = job.merchantId;
       }
    }

    if (notifTitle) {
      await prisma.notification.create({
        data: {
          userId: notifUserId,
          title: notifTitle,
          message: notifMsg,
        }
      }).catch(err => console.error("Error creating notification:", err));
    }

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
    return NextResponse.json({ success: false, message: err.message || 'Internal server error' }, { status: 500 });
  }
}
