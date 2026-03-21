import { describe, it, expect } from 'vitest';
import { THEME_LABELS, type FilterParams, type Theme } from '@/lib/types';

describe('MarketFilters types', () => {
  it('should have 8 theme labels', () => {
    expect(Object.keys(THEME_LABELS)).toHaveLength(8);
  });

  it('should include all expected themes', () => {
    const expectedThemes: Theme[] = [
      'politics', 'crypto', 'ai', 'geopolitics',
      'macro', 'sports', 'entertainment', 'other',
    ];
    expectedThemes.forEach((theme) => {
      expect(THEME_LABELS[theme]).toBeDefined();
    });
  });

  it('should have Japanese labels for all themes', () => {
    Object.values(THEME_LABELS).forEach((label) => {
      expect(label).toBeTruthy();
      expect(typeof label).toBe('string');
    });
  });

  it('should support FilterParams with venue filter', () => {
    const params: FilterParams = {
      venue: 'polymarket',
      sortBy: 'volume',
    };
    expect(params.venue).toBe('polymarket');
  });

  it('should support sortBy options: volume, change, liquidity', () => {
    const sorts: FilterParams['sortBy'][] = ['volume', 'change', 'liquidity'];
    sorts.forEach((s) => {
      const p: FilterParams = { sortBy: s };
      expect(p.sortBy).toBe(s);
    });
  });
});
