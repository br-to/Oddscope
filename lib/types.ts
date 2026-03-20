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
  politics: '米政治',
  crypto: '暗号資産',
  ai: 'AI',
  geopolitics: '地政学',
  macro: 'マクロ経済',
  sports: 'スポーツ',
  entertainment: 'エンタメ',
  other: 'その他',
};

// フィルタパラメータ
export interface FilterParams {
  theme?: Theme;
  minVolume?: number;
  sortBy?: 'volume' | 'change' | 'time';
  showSpikeOnly?: boolean;
}

// 市場表示用の型（UIコンポーネントのprops）
export interface MarketDisplay {
  id: string;
  titleJa: string | null;
  question: string;
  contextNote: string | null;
  theme: string | null;
  currentPrice: number;
  change24h: number;
  volume24h: number;
  isSpike: boolean;
  updatedAt: Date;
}

// Polymarket APIレスポンスの型
export interface PolymarketRawMarket {
  id: string;
  question: string;
  category: string;
  volume: number;
  volume24hr: number;
  price: number;
  active: boolean;
  end_date_iso?: string;
}
