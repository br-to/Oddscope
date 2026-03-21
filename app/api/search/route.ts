import { NextRequest } from 'next/server';
import { getMarkets } from '@/lib/markets';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 2) {
    return Response.json([]);
  }

  const markets = await getMarkets({ q, limit: 8 });

  // サジェスト用に軽量なレスポンスを返す
  const results = markets.map((m) => ({
    id: m.id,
    venue: m.venue,
    title: m.title,
    theme: m.theme,
    yesPrice: m.yesPrice,
    change24h: m.change24h,
    volume24h: m.volume24h,
    url: m.url,
  }));

  return Response.json(results);
}
