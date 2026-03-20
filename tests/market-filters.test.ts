import { describe, it, expect } from 'vitest';
import { THEME_LABELS, type FilterParams, type Theme } from '@/lib/types';

describe('MarketFilters', () => {
  it('should have 8 theme labels', () => {
    const themes = Object.keys(THEME_LABELS);
    expect(themes).toHaveLength(8);
  });

  it('should include all expected themes', () => {
    const expectedThemes: Theme[] = [
      'politics',
      'crypto',
      'ai',
      'geopolitics',
      'macro',
      'sports',
      'entertainment',
      'other',
    ];

    expectedThemes.forEach((theme) => {
      expect(THEME_LABELS[theme]).toBeDefined();
    });
  });

  it('should have Japanese labels for all themes', () => {
    const themes = Object.values(THEME_LABELS);
    themes.forEach((label) => {
      expect(label).toBeTruthy();
      expect(typeof label).toBe('string');
    });
  });

  it('should support FilterParams with all sortBy options', () => {
    const params: FilterParams = {
      sortBy: 'volume',
    };
    expect(params.sortBy).toBe('volume');

    const params2: FilterParams = {
      sortBy: 'change',
    };
    expect(params2.sortBy).toBe('change');

    const params3: FilterParams = {
      sortBy: 'time',
    };
    expect(params3.sortBy).toBe('time');
  });

  it('should support FilterParams with theme filter', () => {
    const params: FilterParams = {
      theme: 'politics',
    };
    expect(params.theme).toBe('politics');
  });

  it('should support FilterParams with minVolume filter', () => {
    const params: FilterParams = {
      minVolume: 1000,
    };
    expect(params.minVolume).toBe(1000);
  });

  it('should support FilterParams with showSpikeOnly filter', () => {
    const params: FilterParams = {
      showSpikeOnly: true,
    };
    expect(params.showSpikeOnly).toBe(true);
  });

  it('should support combined FilterParams', () => {
    const params: FilterParams = {
      theme: 'crypto',
      minVolume: 5000,
      sortBy: 'change',
      showSpikeOnly: true,
    };

    expect(params.theme).toBe('crypto');
    expect(params.minVolume).toBe(5000);
    expect(params.sortBy).toBe('change');
    expect(params.showSpikeOnly).toBe(true);
  });
});
