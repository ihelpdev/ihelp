import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const listing = await prisma.merchantListing.findUnique({ where: { id } });
    
    if (!listing) {
      return NextResponse.json({ success: false, message: 'Listing not found' }, { status: 404 });
    }

    if (listing.merchantId !== user.id) {
       return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const updateData: any = {};
    
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.coverImageUrl !== undefined) updateData.coverImageUrl = body.coverImageUrl;
    if (body.baseRateNgn !== undefined) updateData.baseRateNgn = parseFloat(body.baseRateNgn);
    if (body.unit !== undefined) updateData.unit = body.unit;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.details !== undefined) updateData.details = body.details as Prisma.JsonObject;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const updatedListing = await prisma.merchantListing.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        ...updatedListing,
        details: updatedListing.details as any,
        createdAt: updatedListing.createdAt.toISOString(),
        updatedAt: updatedListing.updatedAt.toISOString(),
      }
    });

  } catch (err: any) {
    console.error('Error updating listing:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const listing = await prisma.merchantListing.findUnique({ where: { id } });
    if (!listing) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    if (listing.merchantId !== user.id) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });

    await prisma.merchantListing.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting listing:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
