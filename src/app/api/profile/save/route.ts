import { NextResponse } from 'next/server';
import { getAuthUser } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  console.log("I AM HERE OOOOOOOOOOO");
  try {
    const { user, error } = await getAuthUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const isPartial = payload.isPartial === true;

    // Verify user exists in database first
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return NextResponse.json({ success: false, message: 'User not found in DB' }, { status: 404 });
    }

    // Wrap in a transaction to update both Profile and User
    await prisma.$transaction(async (tx: any) => {
      // Upsert profile data
      await tx.profile.upsert({
        where: { userId: user.id },
        update: {
          gender: payload.gender,
          phone: payload.phone || null,
          dob: payload.dob ? new Date(payload.dob) : null,
          location: payload.location || null,
          lat: payload.lat || null,
          lng: payload.lng || null,
          avatarUrl: payload.avatarUrl || null,
          nin: payload.nin || null,
          bvn: payload.bvn || null,
          passportImageUrl: payload.passportImageUrl || null,
        },
        create: {
          userId: user.id,
          gender: payload.gender || "OTHER",
          phone: payload.phone || null,
          dob: payload.dob ? new Date(payload.dob) : null,
          location: payload.location || null,
          lat: payload.lat || null,
          lng: payload.lng || null,
          avatarUrl: payload.avatarUrl || null,
          nin: payload.nin || null,
          bvn: payload.bvn || null,
          passportImageUrl: payload.passportImageUrl || null,
        }
      });

      // Update the user's profileCompleted flag only if this is a complete submission
      if (!isPartial) {
        await tx.user.update({
          where: { id: user.id },
          data: { profileCompleted: true }
        });
      }
    });

    // Fetch the freshly updated user + profile to return to the client
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { profile: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Profile saved successfully',
      user: {
        id: updatedUser!.id,
        name: updatedUser!.name,
        email: updatedUser!.email,
        role: updatedUser!.role,
        profileCompleted: updatedUser!.profileCompleted,
        profile: updatedUser!.profile,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
