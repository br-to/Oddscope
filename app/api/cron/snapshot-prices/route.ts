import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const activeMarkets = await prisma.market.findMany({
      where: { isActive: true },
      select: { id: true, currentPrice: true, volume24h: true },
    });

    await prisma.priceSnapshot.createMany({
      data: activeMarkets.map((m) => ({
        marketId: m.id,
        price: m.currentPrice,
        volume: m.volume24h,
      })),
    });

    // 30日以上前のスナップショットを削除
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deleted = await prisma.priceSnapshot.deleteMany({
      where: { timestamp: { lt: thirtyDaysAgo } },
    });

    return NextResponse.json({
      success: true,
      snapshots: activeMarkets.length,
      deletedOld: deleted.count,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Snapshot error:', error);
    return NextResponse.json(
      { error: 'Snapshot failed', details: errorMessage },
      { status: 500 }
    );
  }
}
