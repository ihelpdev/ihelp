import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, email, name, role } = data;

    if (!id || !email) {
      return NextResponse.json({ success: false, message: 'Missing user details' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (existingUser) {
      return NextResponse.json({ success: true, user: existingUser }, { status: 200 });
    }

    const newUser = await prisma.user.create({
      data: {
        id: id, // Syncing the UUID from Supabase to Prisma
        email: email,
        name: name || 'User',
        role: role === 'MERCHANT' ? 'MERCHANT' : 'CUSTOMER',
      },
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 200 });
  } catch (error: any) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
