import { describe, it, expect, vi } from 'vitest';
import { MIN_VOLUME_USD, POLYMARKET_HOST } from '@/lib/polymarket';

describe('Polymarket client', () => {
  it('defines correct API host', () => {
    expect(POLYMARKET_HOST).toBe('https://clob.polymarket.com');
  });

  it('defines minimum volume threshold at $1000', () => {
    expect(MIN_VOLUME_USD).toBe(1000);
  });
});
