import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

// POST /api/ratings — submit a rating for a completed job
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { jobId, merchantListingId, rating, comment } = body;

    if (!jobId || !rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, message: 'jobId and rating (1-5) are required' }, { status: 400 });
    }

    // Verify the job belongs to this customer and is completed
    const job = await prisma.job.findFirst({
      where: { id: jobId, customerId: user.id, status: 'COMPLETED' },
    });
    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found or not completed' }, { status: 404 });
    }

    // Upsert — in case of double-submit, update existing
    const existing = await prisma.serviceRating.findUnique({ where: { jobId } });
    let saved;
    if (existing) {
      saved = await prisma.serviceRating.update({
        where: { jobId },
        data: { rating: Math.round(rating), comment: comment?.trim() || null },
      });
    } else {
      saved = await prisma.serviceRating.create({
        data: {
          jobId,
          customerId:        user.id,
          merchantListingId: merchantListingId ?? job.serviceId ?? null,
          rating:            Math.round(rating),
          comment:           comment?.trim() || null,
        },
      });
    }

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (err: any) {
    console.error('Error saving rating:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/ratings?serviceId=xxx — aggregate ratings for a listing
export async function GET(req: NextRequest) {
  try {
    const serviceId = req.nextUrl.searchParams.get('serviceId');
    if (!serviceId) {
      return NextResponse.json({ success: false, message: 'serviceId required' }, { status: 400 });
    }

    const ratings = await prisma.serviceRating.findMany({
      where: { merchantListingId: serviceId },
      select: { rating: true, comment: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    const avg = ratings.length
      ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length
      : null;

    return NextResponse.json({
      success: true,
      data: { avg: avg ? Math.round(avg * 10) / 10 : null, count: ratings.length, ratings },
    });
  } catch (err: any) {
    console.error('Error fetching ratings:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
