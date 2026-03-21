// Simple in-memory cache with TTL
const cache = new Map<string, { data: unknown; expires: number }>();

export function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): () => Promise<T> {
  return async () => {
    const entry = cache.get(key);
    if (entry && Date.now() < entry.expires) {
      return entry.data as T;
    }
    const data = await fn();
    cache.set(key, { data, expires: Date.now() + ttlMs });
    return data;
  };
}
