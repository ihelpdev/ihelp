import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ success: false }, { status: 401 });
    
    // In a real app, verify user.role === 'SUPER_ADMIN'
    const currentUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (currentUser?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      include: { profile: true, merchantProfile: true },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ success: true, data: users });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // Create user
  return NextResponse.json({ success: false, message: 'Use Supabase Auth to register users' }, { status: 400 });
}

export async function PUT(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false }, { status: 401 });
    const currentUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (currentUser?.role !== 'SUPER_ADMIN') return NextResponse.json({ success: false }, { status: 403 });

    const { id, name, role, kycStatus, noteToUser } = await req.json();

    const existingTargetUser = await prisma.user.findUnique({ where: { id } });

    const updated = await prisma.user.update({
      where: { id },
      data: { name, role, kycStatus }
    });

    // Handle Notifications
    if (existingTargetUser) {
      // 1. If KYC Status changed
      if (existingTargetUser.kycStatus !== kycStatus) {
        await prisma.notification.create({
          data: {
            userId: id,
            title: 'Account Status Updated',
            message: `Your account KYC status has been updated to ${kycStatus}.`,
          }
        });
      }

      // 2. If a custom note was provided
      if (noteToUser && noteToUser.trim() !== '') {
        await prisma.notification.create({
          data: {
            userId: id,
            title: 'Message from Admin',
            message: noteToUser.trim(),
          }
        });
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false }, { status: 401 });
    const currentUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (currentUser?.role !== 'SUPER_ADMIN') return NextResponse.json({ success: false }, { status: 403 });

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ success: false }, { status: 400 });

    await prisma.user.delete({ where: { id } });

    // Ideally, also delete from Supabase Auth via admin API

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
