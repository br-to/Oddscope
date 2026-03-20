import type { Theme } from './types';

const THEME_KEYWORDS: Record<Theme, string[]> = {
  politics: ['election', 'trump', 'biden', 'harris', 'senate', 'congress', 'electoral', 'governor', 'president', 'democrat', 'republican', 'gop', 'dnc', 'rnc', 'vote', 'poll', 'ballot', 'impeach'],
  crypto: ['bitcoin', 'ethereum', 'btc', 'eth', 'crypto', 'blockchain', 'defi', 'nft', 'solana', 'stablecoin', 'binance', 'coinbase', 'etf'],
  ai: ['ai ', 'artificial intelligence', 'chatgpt', 'openai', 'llm', 'gpt', 'claude', 'gemini', 'agi', 'machine learning', 'deepmind', 'anthropic'],
  geopolitics: ['ukraine', 'russia', 'china', 'taiwan', 'iran', 'israel', 'gaza', 'nato', 'war', 'invasion', 'sanctions', 'ceasefire', 'north korea'],
  macro: ['fed', 'interest rate', 'gdp', 'inflation', 'recession', 'cpi', 'unemployment', 'treasury', 'bond', 'stock market', 's&p', 'nasdaq', 'dow'],
  sports: ['nba', 'nfl', 'mlb', 'nhl', 'world cup', 'olympics', 'premier league', 'super bowl', 'championship', 'mvp', 'ufc'],
  entertainment: ['movie', 'oscar', 'emmy', 'grammy', 'box office', 'netflix', 'spotify', 'album', 'award'],
  other: [],
};

export function mapTheme(category: string, question: string): Theme {
  const text = `${category} ${question}`.toLowerCase();

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (theme === 'other') continue;
    if (keywords.some((kw) => text.includes(kw.toLowerCase()))) {
      return theme as Theme;
    }
  }

  return 'other';
}
