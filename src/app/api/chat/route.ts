import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const jobId = url.searchParams.get('jobId');
    if (!jobId) return NextResponse.json({ success: false }, { status: 400 });

    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return NextResponse.json({ success: false }, { status: 401 });

    const messages = await prisma.message.findMany({
      where: { jobId },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (err) {
    console.error('Chat GET Error:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return NextResponse.json({ success: false }, { status: 401 });

    const { jobId, content, receiverId } = await req.json();

    const msg = await prisma.message.create({
      data: {
        jobId,
        senderId: user.id,
        receiverId,
        content
      }
    });

    // Notify the receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: "New Message",
        message: `You have a new message: ${content}`,
      }
    });

    return NextResponse.json({ success: true, data: msg });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
