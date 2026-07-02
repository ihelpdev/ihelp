import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ success: true, data: notifications });
  } catch (err: any) {
    console.error('Error fetching notifications:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { id } = await req.json();

    if (id) {
      await prisma.notification.update({
        where: { id, userId: user.id },
        data: { isRead: true }
      });
    } else {
      await prisma.notification.updateMany({
        where: { userId: user.id, isRead: false },
        data: { isRead: true }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error updating notification:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
