import { describe, it, expect } from 'vitest';
import { mapTheme } from '@/lib/theme-mapping';

describe('theme-mapping', () => {
  it('should map politics keywords to politics theme', () => {
    expect(mapTheme('politics', 'Will Trump win Pennsylvania?')).toBe('politics');
    expect(mapTheme('', 'Trump election results')).toBe('politics');
    expect(mapTheme('', 'Biden impeachment hearing')).toBe('politics');
  });

  it('should map crypto keywords to crypto theme', () => {
    expect(mapTheme('crypto', 'Bitcoin to reach $100k?')).toBe('crypto');
    expect(mapTheme('', 'Ethereum ETF approval')).toBe('crypto');
    expect(mapTheme('', 'BTC halving in 2024')).toBe('crypto');
  });

  it('should map AI keywords to ai theme', () => {
    expect(mapTheme('technology', 'Will GPT-5 be released?')).toBe('ai');
    expect(mapTheme('', 'OpenAI launches new model')).toBe('ai');
    expect(mapTheme('', 'AGI by 2030')).toBe('ai');
  });

  it('should map geopolitics keywords to geopolitics theme', () => {
    expect(mapTheme('', 'Ukraine ceasefire by June?')).toBe('geopolitics');
    expect(mapTheme('', 'China invades Taiwan')).toBe('geopolitics');
    expect(mapTheme('', 'Russia sanctions extended')).toBe('geopolitics');
  });

  it('should map macro keywords to macro theme', () => {
    expect(mapTheme('', 'Fed rate cut in March?')).toBe('macro');
    expect(mapTheme('', 'Recession in 2024?')).toBe('macro');
    expect(mapTheme('', 'CPI exceeds 5%')).toBe('macro');
  });

  it('should return other for unmatched keywords', () => {
    expect(mapTheme('misc', 'Some random market')).toBe('other');
    expect(mapTheme('', 'Random unrelated question')).toBe('other');
  });

  it('should prioritize first matching theme', () => {
    // If multiple keywords match, first match wins
    expect(mapTheme('', 'Trump discusses Bitcoin regulation')).toBe('politics');
  });
});
