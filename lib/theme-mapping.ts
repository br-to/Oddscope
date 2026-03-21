import type { Theme } from './types';

const THEME_KEYWORDS: Record<Theme, string[]> = {
  politics: ['election', 'trump', 'biden', 'harris', 'senate', 'congress', 'electoral', 'governor', 'president', 'democrat', 'republican', 'gop', 'dnc', 'rnc', 'vote', 'poll', 'ballot', 'impeach', 'vance', 'desantis', 'newsom'],
  crypto: ['bitcoin', 'ethereum', 'btc', 'eth', 'crypto', 'blockchain', 'defi', 'nft', 'solana', 'stablecoin', 'binance', 'coinbase', 'etf', 'xrp', 'dogecoin'],
  ai: ['ai ', 'artificial intelligence', 'chatgpt', 'openai', 'llm', 'gpt', 'claude', 'gemini', 'agi', 'machine learning', 'deepmind', 'anthropic'],
  geopolitics: ['ukraine', 'russia', 'china', 'taiwan', 'iran', 'israel', 'gaza', 'nato', 'war', 'invasion', 'sanctions', 'ceasefire', 'north korea', 'houthi'],
  macro: ['fed', 'interest rate', 'gdp', 'inflation', 'recession', 'cpi', 'unemployment', 'treasury', 'bond', 'stock market', 's&p', 'nasdaq', 'dow', 'tariff', 'oil price'],
  sports: ['nba', 'nfl', 'mlb', 'nhl', 'world cup', 'olympics', 'premier league', 'super bowl', 'championship', 'mvp', 'ufc', 'ncaa', 'march madness', 'formula 1', 'f1'],
  entertainment: ['movie', 'oscar', 'emmy', 'grammy', 'box office', 'netflix', 'spotify', 'album', 'award', 'twitter', 'tiktok'],
  other: [],
};

// Kalshiカテゴリの直接マッピング
const CATEGORY_MAP: Record<string, Theme> = {
  'Politics': 'politics',
  'Economics': 'macro',
  'Finance': 'macro',
  'Crypto': 'crypto',
  'AI': 'ai',
  'Tech': 'ai',
  'Sports': 'sports',
  'Entertainment': 'entertainment',
  'World': 'geopolitics',
  'Climate': 'other',
  'Science': 'other',
};

export function mapTheme(category: string, title: string): Theme {
  // まずカテゴリの直接マッピングを試す
  if (category && CATEGORY_MAP[category]) {
    return CATEGORY_MAP[category];
  }

  // キーワードマッチ
  const text = `${category} ${title}`.toLowerCase();
  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (theme === 'other') continue;
    if (keywords.some((kw) => text.includes(kw.toLowerCase()))) {
      return theme as Theme;
    }
  }

  return 'other';
}
