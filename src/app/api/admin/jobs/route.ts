import { NextResponse } from 'next/server';
import { getAuthUser } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { user } = await getAuthUser();

    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (dbUser?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { id: true, email: true } },
        merchant: { select: { id: true, email: true } },
      }
    });

    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
