import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import { SubFrequency } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, serviceId, serviceName, amount, frequency, customerNote, customerNoteImages } = body;

    if (!type || !serviceName || amount === undefined) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    if (type === 'on_demand') {
      let assignedMerchantId = null;
      if (serviceId) {
        const svc = await prisma.merchantListing.findUnique({
          where: { id: serviceId },
          select: { merchantId: true }
        });
        assignedMerchantId = svc?.merchantId || null;
      }

      const job = await prisma.job.create({
        data: {
          customerId:         user.id,
          merchantId:         assignedMerchantId,
          serviceId:          serviceId ?? null,
          serviceType:        'on_demand',
          amount:             parseFloat(amount),
          status:             'PENDING',
          escrowStatus:       'LOCKED',
          description:        serviceName,
          customerNote:       customerNote?.trim() || null,
          customerNoteImages: Array.isArray(customerNoteImages) ? customerNoteImages : [],
          frequency:          null,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id:                 job.id,
          customerId:         job.customerId,
          merchantId:         job.merchantId ?? null,
          serviceId:          job.serviceId  ?? '',
          serviceName:        job.description ?? serviceName,
          type:               'on_demand',
          status:             'pending',
          escrowStatus:       'locked',
          amount:             job.amount,
          customerNote:       job.customerNote ?? null,
          customerNoteImages: job.customerNoteImages ?? [],
          date:               job.createdAt.toISOString().slice(0, 10),
        },
      }, { status: 201 });

    } else if (type === 'subscription') {
      let subFreq: SubFrequency = 'WEEKLY';
      if (frequency === 'BIWEEKLY' || frequency === 'biweekly') subFreq = 'BIWEEKLY';

      const sub = await prisma.subscription.create({
        data: {
          userId:      user.id,
          baseService: serviceName,
          frequency:   subFreq,
          isActive:    true,
        },
      });

      // Also create a Job record to track the subscription request in the jobs flow
      const job = await prisma.job.create({
        data: {
          customerId:  user.id,
          serviceId:   serviceId ?? null,
          serviceType: 'subscription',
          amount:      parseFloat(amount),
          status:      'PENDING',
          escrowStatus:'LOCKED',
          description: serviceName,
          frequency:   subFreq,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id:           job.id,
          customerId:   job.customerId,
          merchantId:   job.merchantId ?? null,
          serviceId:    job.serviceId  ?? '',
          serviceName:  job.description ?? serviceName,
          type:         'subscription',
          status:       'pending',
          escrowStatus: 'locked',
          amount:       job.amount,
          frequency:    subFreq,
          date:         job.createdAt.toISOString().slice(0, 10),
        },
      }, { status: 201 });

    } else {
      return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
    }

  } catch (err: any) {
    console.error('Error creating job:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
