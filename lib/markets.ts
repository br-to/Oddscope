import type { Market, FilterParams, Venue } from './types';
import { getPolymarketData } from './polymarket';
import { getKalshiData } from './kalshi';

export async function getMarkets(params: FilterParams = {}): Promise<Market[]> {
  const { q, theme, venue, sortBy = 'volume', limit = 100 } = params;

  // 両ソースを並列取得
  const [polymarkets, kalshiMarkets] = await Promise.all([
    venue === 'kalshi' ? Promise.resolve([]) : getPolymarketData(),
    venue === 'polymarket' ? Promise.resolve([]) : getKalshiData(),
  ]);

  let combined = [...polymarkets, ...kalshiMarkets];

  // テキスト検索（日本語タイトル + 原文 + カテゴリ）
  if (q) {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    combined = combined.filter((m) => {
      const text = `${m.title} ${m.titleOriginal ?? ''} ${m.category}`.toLowerCase();
      return terms.every((t) => text.includes(t));
    });
  }

  // テーマフィルタ
  if (theme) {
    combined = combined.filter((m) => m.theme === theme);
  }

  // ソート
  switch (sortBy) {
    case 'change':
      combined.sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h));
      break;
    case 'liquidity':
      combined.sort((a, b) => b.liquidity - a.liquidity);
      break;
    case 'volume':
    default:
      combined.sort((a, b) => b.volume24h - a.volume24h);
      break;
  }

  return combined.slice(0, limit);
}

export async function getMarketById(venue: Venue, id: string): Promise<Market | null> {
  const data = venue === 'polymarket'
    ? await getPolymarketData()
    : await getKalshiData();
  return data.find((m) => m.id === id) ?? null;
}
