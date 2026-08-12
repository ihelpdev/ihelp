import { NextResponse } from 'next/server';
import { getAuthUser } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, error } = await getAuthUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const job = await prisma.job.findUnique({ where: { id } });
    
    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    if (job.merchantId !== user.id) {
       return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    if (job.status !== 'DISPUTED') {
      return NextResponse.json({ success: false, message: 'Job is not disputed' }, { status: 400 });
    }

    const { merchantDisputeEvidenceText, merchantDisputeEvidenceImages } = await req.json();

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        merchantDisputeEvidenceText,
        merchantDisputeEvidenceImages: merchantDisputeEvidenceImages || [],
      },
    });

    return NextResponse.json({ success: true, data: updatedJob });

  } catch (err: any) {
    console.error('Error submitting merchant evidence:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
