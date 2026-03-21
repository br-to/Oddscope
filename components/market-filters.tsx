'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { THEME_LABELS } from '@/lib/types';

export function MarketFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTheme = searchParams.get('theme') || 'all';
  const currentVenue = searchParams.get('venue') || 'all';
  const currentSort = searchParams.get('sortBy') || 'volume';

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Select value={currentTheme} onValueChange={(v) => updateParam('theme', v)}>
        <SelectTrigger className="w-[130px] bg-white text-sm h-9">
          <SelectValue placeholder="テーマ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全テーマ</SelectItem>
          {Object.entries(THEME_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentVenue} onValueChange={(v) => updateParam('venue', v)}>
        <SelectTrigger className="w-[140px] bg-white text-sm h-9">
          <SelectValue placeholder="ソース" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全ソース</SelectItem>
          <SelectItem value="polymarket">Polymarket</SelectItem>
          <SelectItem value="kalshi">Kalshi</SelectItem>
        </SelectContent>
      </Select>

      <Select value={currentSort} onValueChange={(v) => updateParam('sortBy', v)}>
        <SelectTrigger className="w-[130px] bg-white text-sm h-9">
          <SelectValue placeholder="ソート" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="volume">出来高順</SelectItem>
          <SelectItem value="change">変動率順</SelectItem>
          <SelectItem value="liquidity">流動性順</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
