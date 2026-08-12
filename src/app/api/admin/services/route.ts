import { NextResponse } from 'next/server';
import { getAuthUser } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

const PAGE_SIZE = 20;

/** Admin-only guard — returns the verified DB user or null */
async function getAdminUser() {
  const { user } = await getAuthUser();
  if (!user) return null;
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.role !== 'SUPER_ADMIN') return null;
  return dbUser;
}

// ---------------------------------------------------------------------------
// GET /api/admin/services?page=1
// Returns paginated MerchantListing records with merchant info
// ---------------------------------------------------------------------------
export async function GET(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const skip = (page - 1) * PAGE_SIZE;

    const [total, listings] = await Promise.all([
      prisma.merchantListing.count(),
      prisma.merchantListing.findMany({
        skip,
        take: PAGE_SIZE,
        orderBy: { createdAt: 'desc' },
        include: {
          merchant: {
            select: { id: true, name: true, email: true },
          },
          ratings: { select: { rating: true } },
        },
      }),
    ]);

    const data = listings.map((l) => {
      const ratingCount = l.ratings.length;
      const ratingAvg = ratingCount
        ? Math.round((l.ratings.reduce((s, r) => s + r.rating, 0) / ratingCount) * 10) / 10
        : null;
      return {
        id: l.id,
        name: l.name,
        description: l.description,
        category: l.category,
        baseRateNgn: l.baseRateNgn,
        unit: l.unit,
        isActive: l.isActive,
        createdAt: l.createdAt,
        merchant: l.merchant,
        ratingAvg,
        ratingCount,
      };
    });

    return NextResponse.json({
      success: true,
      data,
      meta: {
        total,
        page,
        pageSize: PAGE_SIZE,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
    });
  } catch (err) {
    console.error('Admin services GET error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/admin/services
// Body: { listingId: string, isActive: boolean, adminMessage?: string }
// Toggles isActive and optionally notifies the merchant
// ---------------------------------------------------------------------------
export async function PATCH(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { listingId, isActive, adminMessage } = await req.json();

    if (!listingId || typeof isActive !== 'boolean') {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    // Update the listing
    const updated = await prisma.merchantListing.update({
      where: { id: listingId },
      data: { isActive },
      include: { merchant: { select: { id: true, name: true } } },
    });

    // Send notification to merchant if a message was provided
    if (adminMessage?.trim()) {
      const action = isActive ? 'enabled' : 'disabled';
      await prisma.notification.create({
        data: {
          userId: updated.merchantId,
          title: `Your service "${updated.name}" has been ${action}`,
          message: adminMessage.trim(),
        },
      });
    }

    return NextResponse.json({ success: true, data: { id: updated.id, isActive: updated.isActive } });
  } catch (err) {
    console.error('Admin services PATCH error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
