import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const whereClause: any = { isActive: true };
    if (user?.id) {
      whereClause.merchantId = { not: user.id };
    }

    const services = await prisma.merchantListing.findMany({
      where: whereClause,
      // order by latest modified
      orderBy: { updatedAt: 'desc' }
    });

    const mapped = services.map(s => {
      const details = typeof s.details === 'object' && s.details !== null ? s.details : {};
      return {
        id: s.id,
        name: s.name,
        slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), // Generate a slug if needed
        category: s.category,
        tags: s.tags,
        coverImageUrl: s.coverImageUrl,
        description: s.description,
        suggested_base_rate_ngn: s.baseRateNgn,
        unit: s.unit,
        images: (details as any).portfolioImageUrls || []
      };
    });

    return NextResponse.json({ success: true, data: mapped });
  } catch (err: any) {
    console.error('Error fetching on-demand services:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
