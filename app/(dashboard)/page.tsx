export const dynamic = 'force-dynamic';

import { getFilteredMarkets } from '@/lib/queries';
import { MarketTable } from '@/components/market-table';
import { MarketFilters } from '@/components/market-filters';
import type { Theme } from '@/lib/types';

interface SearchParams {
  theme?: Theme;
  minVolume?: string;
  sortBy?: 'volume' | 'change' | 'time';
  showSpikeOnly?: string;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = {
    theme: searchParams.theme,
    minVolume: searchParams.minVolume
      ? parseFloat(searchParams.minVolume)
      : undefined,
    sortBy: searchParams.sortBy || 'volume',
    showSpikeOnly: searchParams.showSpikeOnly === 'true',
  };

  const markets = await getFilteredMarkets(params);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-[28px] font-semibold leading-tight mb-8">
        予測市場一覧
      </h1>
      <MarketFilters />
      <div className="mt-8">
        <MarketTable markets={markets} />
      </div>
    </div>
  );
}
