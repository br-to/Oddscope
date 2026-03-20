import { ClobClient } from '@polymarket/clob-client';
import type { PolymarketRawMarket } from './types';

const POLYMARKET_HOST = 'https://clob.polymarket.com';
const MIN_VOLUME_USD = 1000; // $1K minimum

function createClient(): ClobClient {
  return new ClobClient({
    host: POLYMARKET_HOST,
    key: process.env.POLYMARKET_API_KEY,
  });
}

export async function fetchActiveMarkets(): Promise<PolymarketRawMarket[]> {
  const client = createClient();

  const markets = await client.getMarkets({ active: true });

  // 出来高$1K以上のアクティブ市場をフィルタ
  return markets
    .filter((m: any) => (m.volumeNum ?? m.volume ?? 0) >= MIN_VOLUME_USD)
    .map((m: any) => ({
      id: m.condition_id ?? m.id,
      question: m.question ?? '',
      category: m.category ?? '',
      volume: m.volumeNum ?? m.volume ?? 0,
      volume24hr: m.volume24hr ?? 0,
      price: m.price ?? m.bestAsk ?? 0,
      active: m.active ?? true,
      end_date_iso: m.end_date_iso,
    }));
}

export { MIN_VOLUME_USD, POLYMARKET_HOST };
