'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { THEME_LABELS, type Theme } from '@/lib/types';

export function MarketFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [theme, setTheme] = useState<string>(
    searchParams.get('theme') || 'all'
  );
  const [minVolume, setMinVolume] = useState<string>(
    searchParams.get('minVolume') || ''
  );
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get('sortBy') || 'volume'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (theme && theme !== 'all') params.set('theme', theme);
    if (minVolume) params.set('minVolume', minVolume);
    if (sortBy) params.set('sortBy', sortBy);

    router.push(`/?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 rounded-lg p-6 flex flex-col md:flex-row gap-4 items-end"
    >
      <div className="flex-1">
        <label
          htmlFor="theme"
          className="block text-xs font-semibold text-gray-700 mb-2"
        >
          テーマ
        </label>
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger id="theme" className="bg-white">
            <SelectValue placeholder="全テーマ" />
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
      </div>

      <div className="flex-1">
        <label
          htmlFor="minVolume"
          className="block text-xs font-semibold text-gray-700 mb-2"
        >
          最小出来高 (USD)
        </label>
        <Input
          id="minVolume"
          type="number"
          placeholder="例: 1000"
          value={minVolume}
          onChange={(e) => setMinVolume(e.target.value)}
          className="bg-white"
        />
      </div>

      <div className="flex-1">
        <label
          htmlFor="sortBy"
          className="block text-xs font-semibold text-gray-700 mb-2"
        >
          ソート
        </label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger id="sortBy" className="bg-white">
            <SelectValue placeholder="出来高順" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="volume">出来高順</SelectItem>
            <SelectItem value="change">変動率順</SelectItem>
            <SelectItem value="time">更新順</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
      >
        絞り込み
      </Button>
    </form>
  );
}
