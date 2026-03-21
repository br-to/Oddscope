'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import type { Market, Theme } from '@/lib/types';
import { THEME_LABELS } from '@/lib/types';

const THEME_FALLBACK: Record<Theme, { emoji: string; gradient: string }> = {
  politics: { emoji: '🏛️', gradient: 'from-blue-600 to-indigo-700' },
  crypto: { emoji: '₿', gradient: 'from-orange-500 to-amber-600' },
  ai: { emoji: '🤖', gradient: 'from-violet-600 to-purple-700' },
  geopolitics: { emoji: '🌍', gradient: 'from-emerald-600 to-teal-700' },
  macro: { emoji: '📊', gradient: 'from-cyan-600 to-blue-700' },
  sports: { emoji: '⚽', gradient: 'from-green-500 to-emerald-600' },
  entertainment: { emoji: '🎬', gradient: 'from-pink-500 to-rose-600' },
  other: { emoji: '📈', gradient: 'from-gray-500 to-gray-600' },
};

function formatVolume(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

function formatChange(change: number): string {
  const pct = change * 100;
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

const VENUE_COLORS = {
  polymarket: 'bg-purple-100 text-purple-700',
  kalshi: 'bg-sky-100 text-sky-700',
} as const;

const VENUE_NAMES = {
  polymarket: 'Polymarket',
  kalshi: 'Kalshi',
} as const;

export function MarketCard({ market }: { market: Market }) {
  const changeColor =
    market.change24h > 0.001
      ? 'text-green-600'
      : market.change24h < -0.001
        ? 'text-red-600'
        : 'text-gray-500';

  const isSpike = Math.abs(market.change24h) >= 0.05;

  return (
    <Link
      href={`/market/${market.venue}/${encodeURIComponent(market.id)}`}
      className="block border border-gray-200 rounded-lg bg-white hover:border-gray-400 hover:shadow-sm transition-all duration-150 overflow-hidden"
    >
      {/* 画像 or テーマ別フォールバック */}
      {market.image ? (
        <div className="relative w-full h-32 bg-gray-100">
          <Image
            src={market.image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-md px-2 py-0.5">
            <span className="text-lg font-bold tabular-nums text-gray-900">
              {(market.yesPrice * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      ) : (
        <div className={`relative w-full h-32 bg-gradient-to-br ${THEME_FALLBACK[market.theme].gradient} flex items-center justify-center`}>
          <span className="text-5xl opacity-30 select-none">
            {THEME_FALLBACK[market.theme].emoji}
          </span>
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-md px-2 py-0.5">
            <span className="text-lg font-bold tabular-nums text-gray-900">
              {(market.yesPrice * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      )}

      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 mb-2">
          {market.title}
        </h3>

        <div className="flex flex-wrap gap-1.5 mb-2">
          <Badge variant="secondary" className={VENUE_COLORS[market.venue]}>
            {VENUE_NAMES[market.venue]}
          </Badge>
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            {THEME_LABELS[market.theme]}
          </Badge>
          {isSpike && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              急変
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className={`font-medium ${changeColor}`}>
            {formatChange(market.change24h)}
          </span>
          <span>{formatVolume(market.volume24h)}</span>
          <span className="text-gray-300">|</span>
          <span>総 {formatVolume(market.volumeTotal)}</span>
        </div>
      </div>
    </Link>
  );
}
