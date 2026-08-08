import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  console.log('[sync-user API] Received sync request...');
  try {
    const data = await request.json();
    const { id, email, name, role, referredBy } = data;
    console.log(`[sync-user API] Payload received for ID: ${id}, Email: ${email}, Role: ${role}, ReferredBy: ${referredBy}`);

    if (!id || !email) {
      console.warn('[sync-user API] Missing user details, returning 400.');
      return NextResponse.json({ success: false, message: 'Missing user details' }, { status: 400 });
    }

    console.log(`[sync-user API] Checking if user ${id} already exists in database...`);
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (existingUser) {
      console.log(`[sync-user API] User ${id} already exists in Prisma database. Skipping creation.`);
      return NextResponse.json({ success: true, user: existingUser }, { status: 200 });
    }

    console.log(`[sync-user API] User ${id} not found. Attempting to create new user in Prisma database...`);
    
    // Check if the referredBy code actually exists
    let validReferrer = null;
    if (referredBy) {
      const referrer = await prisma.user.findUnique({ where: { referralCode: referredBy } });
      if (referrer) validReferrer = referrer.referralCode;
    }

    // Generate unique referral code
    const referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const newUser = await prisma.user.create({
      data: {
        id: id,
        email: email,
        name: name || 'User',
        role: role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : (role === 'MERCHANT' ? 'MERCHANT' : 'CUSTOMER'),
        referralCode,
        referredBy: validReferrer
      },
    });

    console.log(`[sync-user API] ✅ Successfully created user ${id} in Prisma database.`);
    return NextResponse.json({ success: true, user: newUser }, { status: 200 });
  } catch (error: any) {
    console.error('[sync-user API] ❌ Error syncing user:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
