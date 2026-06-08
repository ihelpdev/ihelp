import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import { JobStatus } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Get user role to determine if we fetch customer or merchant jobs
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const whereClause = dbUser.role === 'MERCHANT' 
      ? { merchantId: user.id } 
      : { customerId: user.id };

    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    const formattedJobs = jobs.map(job => ({
      id:           job.id,
      customerId:   job.customerId,
      merchantId:   job.merchantId,
      serviceId:    job.serviceId ?? '',
      serviceName:  job.description ?? '',
      type:         job.serviceType as 'on_demand' | 'subscription',
      status:       job.status.toLowerCase(),
      escrowStatus: job.escrowStatus.toLowerCase(),
      amount:       job.amount,
      frequency:    job.frequency,
      date:         job.createdAt.toISOString().slice(0, 10),
    }));

    return NextResponse.json({ success: true, data: formattedJobs });
  } catch (err: any) {
    console.error('Error fetching jobs:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
