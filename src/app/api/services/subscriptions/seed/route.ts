import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import servicesRaw from '@/mockup/services.json';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (dbUser?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const subs = servicesRaw.subscription_base_services;
    let count = 0;

    for (const sub of subs) {
      const exists = await prisma.subscriptionPlan.findFirst({ where: { name: sub.name } });
      if (!exists) {
        // Just extract some mock features from the description to make it look good
        const mockFeatures = sub.description.split(',').map(s => s.trim().replace(/^and /, '')).filter(Boolean);
        
        await prisma.subscriptionPlan.create({
          data: {
            name: sub.name,
            description: sub.description,
            basePriceNgn: sub.base_price_per_session_ngn,
            features: mockFeatures.length > 0 ? mockFeatures : [sub.description],
          }
        });
        count++;
      }
    }

    return NextResponse.json({ success: true, message: `Seeded ${count} plans.` });
  } catch (err: any) {
    console.error('Error seeding subscriptions:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
