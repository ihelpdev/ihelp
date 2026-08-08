import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Calculate rating
    const ratings = await prisma.serviceRating.findMany({
      where: {
        job: {
          merchantId: user.id
        }
      },
      select: { rating: true }
    });

    const totalRatings = ratings.length;
    const avgRating = totalRatings > 0 
      ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings 
      : 5.0; // Default if no ratings

    // Calculate jobs completed
    const completedJobs = await prisma.job.count({
      where: {
        merchantId: user.id,
        status: {
          in: ['COMPLETED', 'CONFIRMED']
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        avgRating: avgRating.toFixed(1),
        totalRatings,
        completedJobs
      }
    });
  } catch (err: any) {
    console.error('Error fetching merchant stats:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
