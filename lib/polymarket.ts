import { ClobClient } from '@polymarket/clob-client';
import type { PolymarketRawMarket } from './types';

const POLYMARKET_HOST = 'https://clob.polymarket.com';
const MIN_VOLUME_USD = 1000; // $1K minimum

function createClient(): ClobClient {
  // ClobClient(host, chainId, signer?, creds?, ...)
  // 読み取り専用の場合、signerとcredsは不要
  return new ClobClient(
    POLYMARKET_HOST,
    137 // Polygon mainnet
  );
}

export async function fetchActiveMarkets(): Promise<PolymarketRawMarket[]> {
  const client = createClient();

  // getMarketsはPaginationPayloadを返す（marketsプロパティに配列が入る）
  const response = await client.getMarkets();
  const markets = (response as any).data ?? [];

  // アクティブかつ出来高$1K以上の市場をフィルタ
  return markets
    .filter((m: any) => {
      const isActive = m.active ?? true;
      const volume = m.volumeNum ?? m.volume ?? 0;
      return isActive && volume >= MIN_VOLUME_USD;
    })
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
