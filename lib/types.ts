// データソース
export type Venue = 'polymarket' | 'kalshi';

// テーマ型定義
export type Theme =
  | 'politics'
  | 'crypto'
  | 'ai'
  | 'geopolitics'
  | 'macro'
  | 'sports'
  | 'entertainment'
  | 'other';

export const THEME_LABELS: Record<Theme, string> = {
  politics: '政治',
  crypto: '暗号資産',
  ai: 'AI',
  geopolitics: '地政学',
  macro: '経済',
  sports: 'スポーツ',
  entertainment: 'エンタメ',
  other: 'その他',
};

// 統合マーケット型
export interface Market {
  id: string;
  venue: Venue;
  title: string;          // 表示用（日本語 or 英語）
  titleOriginal?: string; // 原文（英語）- 検索用
  description?: string;
  image?: string;         // サムネイル画像URL
  category: string;
  theme: Theme;
  yesPrice: number;       // 0-1
  prevYesPrice: number;   // 前日比較用
  change24h: number;      // yesPrice - prevYesPrice
  volume24h: number;      // USD
  volumeTotal: number;    // USD
  liquidity: number;      // USD
  endDate: string | null;
  url: string;
}

// フィルタパラメータ
export interface FilterParams {
  q?: string;
  theme?: Theme;
  venue?: Venue;
  sortBy?: 'volume' | 'change' | 'liquidity';
  limit?: number;
}
