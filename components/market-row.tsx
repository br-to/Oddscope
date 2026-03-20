import { Badge } from '@/components/ui/badge';
import type { MarketDisplay } from '@/lib/types';
import { THEME_LABELS, type Theme } from '@/lib/types';

interface MarketRowProps {
  market: MarketDisplay;
}

export function MarketRow({ market }: MarketRowProps) {
  const themeLabel = market.theme
    ? THEME_LABELS[market.theme as Theme] || 'その他'
    : 'その他';

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="border-b border-gray-200 px-4 py-3">
        <div className="text-sm font-normal text-gray-900">
          {market.titleJa || (
            <span className="text-gray-400">（翻訳中）</span>
          )}
        </div>
        {market.contextNote && (
          <div className="text-sm text-gray-500 mt-1">{market.contextNote}</div>
        )}
      </td>
      <td className="border-b border-gray-200 px-4 py-3">
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          {themeLabel}
        </Badge>
      </td>
      <td className="border-b border-gray-200 px-4 py-3 text-right text-sm">
        {(market.currentPrice * 100).toFixed(1)}%
      </td>
      <td
        className={`border-b border-gray-200 px-4 py-3 text-right text-sm ${
          market.change24h > 0
            ? 'text-green-600'
            : market.change24h < 0
              ? 'text-red-600'
              : 'text-gray-600'
        }`}
      >
        {market.change24h > 0 ? '+' : ''}
        {(market.change24h * 100).toFixed(1)}%
      </td>
      <td className="border-b border-gray-200 px-4 py-3 text-right text-sm">
        ${market.volume24h.toLocaleString()}
      </td>
      <td className="border-b border-gray-200 px-4 py-3">
        {market.isSpike && (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            急変
          </Badge>
        )}
      </td>
    </tr>
  );
}
