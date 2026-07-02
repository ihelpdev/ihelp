import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const subscriptions = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    const mapped = subscriptions.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      base_price_per_session_ngn: s.basePriceNgn,
      features: s.features,
      imageUrl: s.imageUrl,
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (err: any) {
    console.error('Error fetching subscriptions:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, description, basePriceNgn, features, imageUrl } = await req.json();

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name,
        description,
        basePriceNgn,
        features: features || [],
        imageUrl: imageUrl || null,
      }
    });

    return NextResponse.json({ success: true, data: plan });
  } catch (err: any) {
    console.error('Error creating subscription:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, name, description, basePriceNgn, features, imageUrl, isActive } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing subscription ID' }, { status: 400 });
    }

    const updatedPlan = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        name,
        description,
        basePriceNgn,
        features: features || [],
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      }
    });

    return NextResponse.json({ success: true, data: updatedPlan });
  } catch (err: any) {
    console.error('Error updating subscription:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
