import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const TARGET_MERCHANT_ID = "4ac8c48e-8a3a-4299-8f8e-98712c26165e";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    let items = [];
    if (Array.isArray(body)) {
      items = body;
    } else if (body && Array.isArray(body.on_demand_services)) {
      items = body.on_demand_services;
    } else {
      return NextResponse.json({ success: false, message: 'Invalid JSON format. Expected an array or an object with on_demand_services array.' }, { status: 400 });
    }

    let count = 0;
    for (const item of items) {
      if (!item.name || item.suggested_base_rate_ngn === undefined) continue;

      const data = {
        name: item.name,
        description: item.description || '',
        category: item.category || 'General',
        baseRateNgn: parseFloat(item.suggested_base_rate_ngn),
        unit: item.unit || 'hour',
        merchantId: TARGET_MERCHANT_ID,
      };

      if (item.id) {
        // Upsert if ID is provided
        await prisma.merchantListing.upsert({
          where: { id: item.id },
          update: data,
          create: {
            ...data,
            id: item.id,
            details: {},
            isActive: true
          }
        });
      } else {
        // Create new if no ID
        await prisma.merchantListing.create({
          data: {
            ...data,
            details: {},
            isActive: true
          }
        });
      }
      count++;
    }

    return NextResponse.json({ success: true, message: `Successfully saved ${count} services to the database.` });

  } catch (err: any) {
    console.error('Error uploading services to DB:', err);
    return NextResponse.json({ success: false, message: 'Internal server error: ' + err.message }, { status: 500 });
  }
}
