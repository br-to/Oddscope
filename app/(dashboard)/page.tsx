import { getMarkets } from '@/lib/markets';
import { MarketGrid } from '@/components/market-grid';
import { MarketFilters } from '@/components/market-filters';
import { SearchCommand } from '@/components/search-command';
import type { Theme, Venue } from '@/lib/types';
import { Suspense } from 'react';

interface SearchParams {
  q?: string;
  theme?: Theme;
  venue?: Venue;
  sortBy?: 'volume' | 'change' | 'liquidity';
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const markets = await getMarkets({
    q: sp.q,
    theme: sp.theme,
    venue: sp.venue,
    sortBy: sp.sortBy || 'volume',
  });

  const polyCount = markets.filter((m) => m.venue === 'polymarket').length;
  const kalshiCount = markets.filter((m) => m.venue === 'kalshi').length;

  return (
    <>
      {/* ヘッダー: タイトル + 検索 */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Oddscope</h1>
            <p className="text-sm text-gray-500 mt-1">
              {markets.length} markets
              <span className="mx-1.5 text-gray-300">|</span>
              Polymarket {polyCount}
              <span className="mx-1.5 text-gray-300">|</span>
              Kalshi {kalshiCount}
            </p>
          </div>
          <Suspense>
            <SearchCommand />
          </Suspense>
        </div>

        {/* フィルタ */}
        <Suspense>
          <MarketFilters />
        </Suspense>
      </div>

      <MarketGrid markets={markets} />
    </>
  );
}
