import type { Market } from './types';
import { mapTheme } from './theme-mapping';
import { cached } from './cache';

const GAMMA_API = 'https://gamma-api.polymarket.com';
const MIN_VOLUME_24H = 500;
const MAX_EVENTS = 200;

async function fetchPolymarketRaw(): Promise<Market[]> {
  // events APIでlocale=jaを指定すると日本語タイトルが返る
  const url = `${GAMMA_API}/events?active=true&closed=false&order=volume24hr&ascending=false&limit=${MAX_EVENTS}&locale=ja`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Gamma API error: ${res.status}`);

  const events: any[] = await res.json();
  const markets: Market[] = [];

  for (const event of events) {
    const eventVolume24h = event.volume24hr ?? 0;
    if (eventVolume24h < MIN_VOLUME_24H) continue;

    const category = event.tags?.[0]?.label ?? '';
    const titleJa = event.title ?? '';
    const image = event.image || event.icon || undefined;
    const description = event.description ?? undefined;

    // マルチマーケットイベントの場合、各マーケットをフラット化
    const eventMarkets = event.markets ?? [];

    if (eventMarkets.length <= 1) {
      // 単一マーケット: eventレベルで表示
      const m = eventMarkets[0];
      let yesPrice = 0;
      if (m) {
        try {
          const prices = JSON.parse(m.outcomePrices || '[]');
          yesPrice = parseFloat(prices[0]) || 0;
        } catch {
          yesPrice = m.lastTradePrice ?? 0;
        }
      }

      markets.push({
        id: event.id,
        venue: 'polymarket',
        title: titleJa,
        titleOriginal: event.slug ? eventMarkets[0]?.question ?? '' : '',
        description,
        image,
        category,
        theme: mapTheme(category, titleJa),
        yesPrice,
        prevYesPrice: yesPrice,
        change24h: 0,
        volume24h: eventVolume24h,
        volumeTotal: event.volume ?? 0,
        liquidity: event.liquidity ?? 0,
        endDate: m?.endDateIso ?? event.endDate ?? null,
        url: `https://polymarket.com/event/${event.slug}`,
      });
    } else {
      // マルチマーケット: 各アウトカムを個別表示
      for (const m of eventMarkets) {
        const mVol = m.volume24hr ?? 0;
        if (mVol < 100) continue;

        let yesPrice = 0;
        try {
          const prices = JSON.parse(m.outcomePrices || '[]');
          yesPrice = parseFloat(prices[0]) || 0;
        } catch {
          yesPrice = m.lastTradePrice ?? 0;
        }

        // マーケットのgroupItemTitleまたはquestionでサブタイトルを作る
        const subtitle = m.groupItemTitle || m.question || '';
        const displayTitle = subtitle
          ? `${titleJa}: ${subtitle}`
          : titleJa;

        markets.push({
          id: m.conditionId ?? m.id,
          venue: 'polymarket',
          title: displayTitle,
          titleOriginal: m.question ?? '',
          description: m.description ?? description,
          image: m.image || image,
          category,
          theme: mapTheme(category, titleJa),
          yesPrice,
          prevYesPrice: yesPrice,
          change24h: 0,
          volume24h: mVol,
          volumeTotal: m.volumeNum ?? 0,
          liquidity: m.liquidityNum ?? 0,
          endDate: m.endDateIso ?? null,
          url: `https://polymarket.com/event/${event.slug}`,
        });
      }
    }
  }

  markets.sort((a, b) => b.volume24h - a.volume24h);
  return markets;
}

export const getPolymarketData = cached('polymarket', 3 * 60 * 1000, fetchPolymarketRaw);
