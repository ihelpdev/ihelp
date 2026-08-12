import { NextResponse } from 'next/server';
import { getAuthUser } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const jobId = url.searchParams.get('jobId');
    if (!jobId) return NextResponse.json({ success: false }, { status: 400 });

    const { user } = await getAuthUser();
    if (!user) return NextResponse.json({ success: false }, { status: 401 });

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
    const { user } = await getAuthUser();
    if (!user) return NextResponse.json({ success: false }, { status: 401 });

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
