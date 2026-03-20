import { prisma } from '@/lib/db';
import type { FilterParams, MarketDisplay } from '@/lib/types';
import type { Prisma } from '@prisma/client';

export async function getFilteredMarkets(
  params: FilterParams
): Promise<MarketDisplay[]> {
  const where: Prisma.MarketWhereInput = {
    isActive: true,
  };

  if (params.theme) {
    where.theme = params.theme;
  }

  if (params.minVolume) {
    where.volume24h = { gte: params.minVolume };
  }

  if (params.showSpikeOnly) {
    // 5%以上の変動のみ表示
    where.OR = [
      { change24h: { gte: 0.05 } },
      { change24h: { lte: -0.05 } },
    ];
  }

  const orderBy: Prisma.MarketOrderByWithRelationInput =
    params.sortBy === 'change'
      ? { change24h: 'desc' }
      : params.sortBy === 'time'
        ? { updatedAt: 'desc' }
        : { volume24h: 'desc' }; // デフォルト: 出来高順

  const markets = await prisma.market.findMany({
    where,
    orderBy,
    take: 100,
    select: {
      id: true,
      titleJa: true,
      question: true,
      contextNote: true,
      theme: true,
      currentPrice: true,
      change24h: true,
      volume24h: true,
      updatedAt: true,
    },
  });

  return markets.map((m) => ({
    ...m,
    isSpike: Math.abs(m.change24h) >= 0.05, // 5%以上を急変表示
  }));
}
