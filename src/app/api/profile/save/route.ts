import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  console.log("I AM HERE OOOOOOOOOOO");
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    console.log(request, error, user)

    const payload = await request.json();

    // Verify user exists in database first
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    console.log({ dbUser });
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
          phone: payload.phone,
          dob: new Date(payload.dob),
          location: payload.location,
          avatarUrl: payload.avatarUrl,
          nin: payload.nin || null,
          bvn: payload.bvn || null,
          passportImageUrl: payload.passportImageUrl || null,
        },
        create: {
          userId: user.id,
          gender: payload.gender,
          phone: payload.phone,
          dob: new Date(payload.dob),
          location: payload.location,
          avatarUrl: payload.avatarUrl,
          nin: payload.nin || null,
          bvn: payload.bvn || null,
          passportImageUrl: payload.passportImageUrl || null,
        }
      });

      // Update the user's profileCompleted flag
      await tx.user.update({
        where: { id: user.id },
        data: { profileCompleted: true }
      });
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
