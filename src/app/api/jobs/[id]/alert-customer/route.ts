import { NextResponse } from 'next/server';
import { getAuthUser } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user, error } = await getAuthUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        customer: { include: { profile: true } },
        merchant: { include: { profile: true } },
      }
    });

    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    if (job.merchantId !== user.id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    // 1. In-App Notification (Database)
    await prisma.notification.create({
      data: {
        userId: job.customerId,
        title: "Merchant Navigating",
        message: `Your merchant (${job.merchant?.name || 'Pro'}) has started navigation to your location!`,
      }
    });

    // 2. Simulated SMS/Email notification (Since we don't have a real SMS provider)
    const customerPhone = job.customer?.profile?.phone;
    if (customerPhone) {
      console.log(`\n\n[SIMULATED SMS to ${customerPhone}]: iHelp Alert: Your merchant is now navigating to your location!\n\n`);
    }

    return NextResponse.json({ success: true, message: 'Customer alerted successfully' });
  } catch (err: any) {
    console.error('Error alerting customer:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
