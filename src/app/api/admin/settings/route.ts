import { NextResponse } from 'next/server';
import { getAuthUser } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const setting = await prisma.appSetting.findUnique({
      where: { key: 'routing_mode' }
    });
    return NextResponse.json({ success: true, data: { routingMode: setting?.value || 'external' } });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user } = await getAuthUser();

    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (dbUser?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { routingMode } = await req.json();

    const updated = await prisma.appSetting.upsert({
      where: { key: 'routing_mode' },
      update: { value: routingMode },
      create: { key: 'routing_mode', value: routingMode }
    });

    return NextResponse.json({ success: true, data: { routingMode: updated.value } });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
