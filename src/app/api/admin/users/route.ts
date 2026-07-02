import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (dbUser?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        profile: {
          select: {
            phone: true,
            location: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
