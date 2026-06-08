import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.merchantListing.findMany({
      where: { isActive: true },
      // Optional: order by category, then name
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    // Map DB model to match what ExploreTab currently expects from mockup JSON
    const mapped = services.map(s => ({
      id: s.id,
      name: s.name,
      slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), // Generate a slug if needed
      category: s.category,
      description: s.description,
      suggested_base_rate_ngn: s.baseRateNgn,
      unit: s.unit
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (err: any) {
    console.error('Error fetching on-demand services:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
