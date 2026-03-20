'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { MarketDisplay } from '@/lib/types';
import { THEME_LABELS, type Theme } from '@/lib/types';
import { EmptyState } from './empty-state';

interface MarketTableProps {
  markets: MarketDisplay[];
}

export function MarketTable({ markets }: MarketTableProps) {
  if (markets.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {/* デスクトップ・タブレット: テーブル表示 (hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-xs font-semibold text-gray-700">
                市場タイトル
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">
                テーマ
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 text-right">
                現在確率
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 text-right">
                24h変動
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 text-right">
                出来高
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">
                状態
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {markets.map((market) => {
              const themeLabel = market.theme
                ? THEME_LABELS[market.theme as Theme] || 'その他'
                : 'その他';

              return (
                <TableRow
                  key={market.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <TableCell>
                    <div className="text-sm font-normal text-gray-900">
                      {market.titleJa || (
                        <span className="text-gray-400">（翻訳中）</span>
                      )}
                    </div>
                    {market.contextNote && (
                      <div className="text-sm text-gray-500 mt-1">
                        {market.contextNote}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      {themeLabel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {(market.currentPrice * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell
                    className={`text-right text-sm ${
                      market.change24h > 0
                        ? 'text-green-600'
                        : market.change24h < 0
                          ? 'text-red-600'
                          : 'text-gray-600'
                    }`}
                  >
                    {market.change24h > 0 ? '+' : ''}
                    {(market.change24h * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    ${market.volume24h.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {market.isSpike && (
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                        急変
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* モバイル: カード形式表示 (visible only on mobile) */}
      <div className="md:hidden space-y-2">
        {markets.map((market) => {
          const themeLabel = market.theme
            ? THEME_LABELS[market.theme as Theme] || 'その他'
            : 'その他';

          return (
            <div
              key={market.id}
              className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-sm font-normal text-gray-900 mb-1">
                    {market.titleJa || (
                      <span className="text-gray-400">（翻訳中）</span>
                    )}
                  </div>
                  {market.contextNote && (
                    <div className="text-sm text-gray-500 mb-2">
                      {market.contextNote}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center mb-2">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  {themeLabel}
                </Badge>
                {market.isSpike && (
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                    急変
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="text-xs text-gray-500">確率</div>
                  <div className="font-medium">
                    {(market.currentPrice * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">24h変動</div>
                  <div
                    className={`font-medium ${
                      market.change24h > 0
                        ? 'text-green-600'
                        : market.change24h < 0
                          ? 'text-red-600'
                          : 'text-gray-600'
                    }`}
                  >
                    {market.change24h > 0 ? '+' : ''}
                    {(market.change24h * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">出来高</div>
                  <div className="font-medium">
                    ${(market.volume24h / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
