import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getMarketById } from '@/lib/markets';
import { Badge } from '@/components/ui/badge';
import { THEME_LABELS } from '@/lib/types';
import type { Venue, Theme } from '@/lib/types';

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
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

const VENUE_COLORS = {
  polymarket: 'bg-purple-100 text-purple-700',
  kalshi: 'bg-sky-100 text-sky-700',
} as const;

const VENUE_NAMES = {
  polymarket: 'Polymarket',
  kalshi: 'Kalshi',
} as const;

export default async function MarketDetailPage({
  params,
}: {
  params: Promise<{ venue: string; id: string }>;
}) {
  const { venue, id } = await params;
  if (venue !== 'polymarket' && venue !== 'kalshi') notFound();

  const market = await getMarketById(venue as Venue, decodeURIComponent(id));
  if (!market) notFound();

  const changeColor =
    market.change24h > 0.001
      ? 'text-green-600'
      : market.change24h < -0.001
        ? 'text-red-600'
        : 'text-gray-500';
  const changePct = (market.change24h * 100).toFixed(1);
  const changeStr = market.change24h > 0 ? `+${changePct}%` : `${changePct}%`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* 戻るリンク */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        一覧に戻る
      </Link>

      {/* ヒーロー画像 or テーマ別フォールバック */}
      {market.image ? (
        <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden mb-6 bg-gray-100">
          <Image
            src={market.image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            unoptimized
            priority
          />
        </div>
      ) : (
        <div className={`relative w-full h-48 sm:h-64 rounded-lg overflow-hidden mb-6 bg-gradient-to-br ${THEME_FALLBACK[market.theme].gradient} flex items-center justify-center`}>
          <span className="text-8xl opacity-20 select-none">
            {THEME_FALLBACK[market.theme].emoji}
          </span>
        </div>
      )}

      {/* タイトル + バッジ */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
          {market.title}
        </h1>
        {market.titleOriginal && market.titleOriginal !== market.title && (
          <p className="text-sm text-gray-400 mb-3">{market.titleOriginal}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className={VENUE_COLORS[market.venue]}>
            {VENUE_NAMES[market.venue]}
          </Badge>
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            {THEME_LABELS[market.theme]}
          </Badge>
        </div>
      </div>

      {/* 確率 + 統計 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">Yes確率</div>
          <div className="text-3xl font-bold tabular-nums">
            {(market.yesPrice * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">24h変動</div>
          <div className={`text-2xl font-bold tabular-nums ${changeColor}`}>
            {changeStr}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">24h出来高</div>
          <div className="text-2xl font-bold tabular-nums">
            {formatVolume(market.volume24h)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">総出来高</div>
          <div className="text-2xl font-bold tabular-nums">
            {formatVolume(market.volumeTotal)}
          </div>
        </div>
      </div>

      {/* 追加情報 */}
      <div className="space-y-4 mb-6">
        {market.liquidity > 0 && (
          <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
            <span className="text-gray-500">流動性</span>
            <span className="font-medium">{formatVolume(market.liquidity)}</span>
          </div>
        )}
        {market.endDate && (
          <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
            <span className="text-gray-500">終了日</span>
            <span className="font-medium">
              {new Date(market.endDate).toLocaleDateString('ja-JP')}
            </span>
          </div>
        )}
        {market.category && (
          <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
            <span className="text-gray-500">カテゴリ</span>
            <span className="font-medium">{market.category}</span>
          </div>
        )}
      </div>

      {/* 説明 */}
      {market.description && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">説明</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {market.description}
          </p>
        </div>
      )}

      {/* 外部リンク */}
      <a
        href={market.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800"
      >
        {VENUE_NAMES[market.venue]}で見る
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
