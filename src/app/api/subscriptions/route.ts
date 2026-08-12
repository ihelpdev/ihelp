import { NextResponse } from 'next/server';
import { getAuthUser } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { user } = await getAuthUser();
    if (!user) return NextResponse.json({ success: false }, { status: 401 });

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ success: true, data: subscriptions });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { user } = await getAuthUser();
    if (!user) return NextResponse.json({ success: false }, { status: 401 });

    const { id, isActive } = await req.json();

    const updated = await prisma.subscription.update({
      where: { id, userId: user.id },
      data: { isActive }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
