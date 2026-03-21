import { describe, it, expect } from 'vitest';

describe('Polymarket adapter', () => {
  it('Gamma API returns market data', async () => {
    const res = await fetch('https://gamma-api.polymarket.com/markets?limit=1&active=true&closed=false');
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty('question');
    expect(data[0]).toHaveProperty('volume24hr');
  });
});
