import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return NextResponse.json({ success: false }, { status: 401 });

    const profile = await prisma.merchantProfile.findUnique({ where: { userId: user.id } });
    
    return NextResponse.json({ success: true, data: { isAvailable: profile?.isAvailable ?? false } });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return NextResponse.json({ success: false }, { status: 401 });

    const { isAvailable } = await req.json();

    await prisma.merchantProfile.update({
      where: { userId: user.id },
      data: { isAvailable }
    });
    
    return NextResponse.json({ success: true, data: { isAvailable } });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
