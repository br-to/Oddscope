import type { Market } from './types';
import { mapTheme } from './theme-mapping';
import { cached } from './cache';

const KALSHI_API = 'https://api.elections.kalshi.com/trade-api/v2';
const MIN_VOLUME_24H = 100;

async function fetchKalshiRaw(): Promise<Market[]> {
  const markets: Market[] = [];
  let cursor: string | undefined;
  const seen = new Set<string>();

  // events APIで取得（nested marketsにvolume情報が入る）
  for (let page = 0; page < 3; page++) {
    const params = new URLSearchParams({
      limit: '200',
      status: 'open',
      with_nested_markets: 'true',
    });
    if (cursor) params.set('cursor', cursor);

    const url = `${KALSHI_API}/events?${params}`;
    const res = await fetch(url);

    if (res.status === 429) {
      console.warn('[Kalshi] Rate limited, returning partial data');
      break;
    }
    if (!res.ok) throw new Error(`Kalshi API error: ${res.status}`);

    const data = await res.json();
    const events: any[] = data.events ?? [];
    if (events.length === 0) break;

    for (const event of events) {
      const category = event.category ?? '';
      const eventTitle = event.title ?? '';

      for (const m of event.markets ?? []) {
        if (seen.has(m.ticker)) continue;
        seen.add(m.ticker);

        const volume24h = parseFloat(m.volume_24h_fp) || 0;
        if (volume24h < MIN_VOLUME_24H) continue;

        const yesPrice = parseFloat(m.last_price_dollars) || 0;
        const prevPrice = parseFloat(m.previous_price_dollars) || yesPrice;

        // マルチアウトカムの場合、サブタイトルを組み合わせてタイトルにする
        const title = m.yes_sub_title
          ? `${eventTitle}: ${m.yes_sub_title}`
          : m.title ?? eventTitle;

        markets.push({
          id: m.ticker,
          venue: 'kalshi',
          title,
          category,
          theme: mapTheme(category, `${eventTitle} ${title}`),
          yesPrice,
          prevYesPrice: prevPrice,
          change24h: yesPrice - prevPrice,
          volume24h,
          volumeTotal: parseFloat(m.volume_fp) || 0,
          liquidity: parseFloat(m.liquidity_dollars) || 0,
          endDate: m.expiration_time ?? null,
          url: `https://kalshi.com/markets/${m.ticker}`,
        });
      }
    }

    cursor = data.cursor;
    if (!cursor) break;
  }

  markets.sort((a, b) => b.volume24h - a.volume24h);
  return markets;
}

export const getKalshiData = cached('kalshi', 3 * 60 * 1000, fetchKalshiRaw);
