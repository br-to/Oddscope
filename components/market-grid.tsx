import type { Market } from '@/lib/types';
import { MarketCard } from './market-card';

interface MarketGridProps {
  markets: Market[];
}

export function MarketGrid({ markets }: MarketGridProps) {
  if (markets.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-500 mb-1">
          該当する市場がありません
        </h3>
        <p className="text-sm text-gray-400">
          フィルタ条件を変更してみてください
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {markets.map((market) => (
        <MarketCard key={`${market.venue}-${market.id}`} market={market} />
      ))}
    </div>
  );
}
