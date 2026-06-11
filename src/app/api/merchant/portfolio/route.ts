import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const listings = await prisma.merchantListing.findMany({
      where: { merchantId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    const formattedListings = listings.map(l => ({
      ...l,
      details: l.details as any, 
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data: formattedListings });
  } catch (err: any) {
    console.error('Error fetching portfolio:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, category, tags, coverImageUrl, baseRateNgn, unit, notes, details, isActive } = body;

    if (!name || baseRateNgn === undefined) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const listing = await prisma.merchantListing.create({
      data: {
        merchantId: user.id,
        name,
        description: description ?? '',
        category: category ?? 'General',
        tags: tags ?? [],
        coverImageUrl: coverImageUrl ?? null,
        baseRateNgn: parseFloat(baseRateNgn),
        unit: unit ?? 'hour',
        notes: notes ?? '',
        details: (details ?? {}) as Prisma.JsonObject,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...listing,
        details: listing.details as any,
        createdAt: listing.createdAt.toISOString(),
        updatedAt: listing.updatedAt.toISOString(),
      }
    }, { status: 201 });

  } catch (err: any) {
    console.error('Error creating portfolio listing:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
