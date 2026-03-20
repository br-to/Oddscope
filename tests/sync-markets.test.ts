import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/cron/sync-markets/route';
import { prisma } from '@/lib/db';
import { fetchActiveMarkets } from '@/lib/polymarket';
import { translateMarket } from '@/lib/translation';
import { mapTheme } from '@/lib/theme-mapping';

// Mock dependencies
vi.mock('@/lib/db', () => ({
  prisma: {
    syncLog: {
      create: vi.fn(),
      update: vi.fn(),
    },
    market: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

vi.mock('@/lib/polymarket', () => ({
  fetchActiveMarkets: vi.fn(),
}));

vi.mock('@/lib/translation', () => ({
  translateMarket: vi.fn(),
}));

vi.mock('@/lib/theme-mapping', () => ({
  mapTheme: vi.fn(),
}));

describe('sync-markets API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = 'test-secret';
  });

  it('should return 401 when CRON_SECRET is missing', async () => {
    const request = new Request('http://localhost:3000/api/cron/sync-markets', {
      headers: { authorization: 'Bearer wrong-secret' },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should sync markets successfully and log as success', async () => {
    const mockSyncLogId = 'sync-log-1';
    const mockMarkets = [
      {
        id: 'market-1',
        question: 'Test market?',
        category: 'politics',
        price: 0.5,
        volume24hr: 10000,
        volume: 50000,
        active: true,
      },
    ];

    vi.mocked(prisma.syncLog.create).mockResolvedValueOnce({
      id: mockSyncLogId,
      status: 'running',
    } as any);

    vi.mocked(fetchActiveMarkets).mockResolvedValueOnce(mockMarkets);
    vi.mocked(prisma.market.findUnique).mockResolvedValueOnce(null);
    vi.mocked(mapTheme).mockReturnValueOnce('politics');
    vi.mocked(translateMarket).mockResolvedValueOnce({
      titleJa: 'テスト市場',
      contextNote: 'テスト用の市場',
    });
    vi.mocked(prisma.market.upsert).mockResolvedValueOnce({} as any);
    vi.mocked(prisma.syncLog.update).mockResolvedValueOnce({} as any);

    const request = new Request('http://localhost:3000/api/cron/sync-markets', {
      headers: { authorization: 'Bearer test-secret' },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.synced).toBe(1);
    expect(data.newMarkets).toBe(1);

    expect(prisma.syncLog.update).toHaveBeenCalledWith({
      where: { id: mockSyncLogId },
      data: expect.objectContaining({
        status: 'success',
        marketsCount: 1,
        newMarkets: 1,
      }),
    });
  });

  it('should call translateMarket and mapTheme for new markets', async () => {
    const mockSyncLogId = 'sync-log-2';
    const mockMarkets = [
      {
        id: 'market-2',
        question: 'Bitcoin to $100k?',
        category: 'crypto',
        price: 0.3,
        volume24hr: 20000,
        volume: 100000,
        active: true,
      },
    ];

    vi.mocked(prisma.syncLog.create).mockResolvedValueOnce({
      id: mockSyncLogId,
      status: 'running',
    } as any);

    vi.mocked(fetchActiveMarkets).mockResolvedValueOnce(mockMarkets);
    vi.mocked(prisma.market.findUnique).mockResolvedValueOnce(null);
    vi.mocked(mapTheme).mockReturnValueOnce('crypto');
    vi.mocked(translateMarket).mockResolvedValueOnce({
      titleJa: 'ビットコインが$100kに到達するか？',
      contextNote: '暗号資産の価格予測',
    });
    vi.mocked(prisma.market.upsert).mockResolvedValueOnce({} as any);
    vi.mocked(prisma.syncLog.update).mockResolvedValueOnce({} as any);

    const request = new Request('http://localhost:3000/api/cron/sync-markets', {
      headers: { authorization: 'Bearer test-secret' },
    });

    await GET(request);

    expect(mapTheme).toHaveBeenCalledWith('crypto', 'Bitcoin to $100k?');
    expect(translateMarket).toHaveBeenCalledWith({
      question: 'Bitcoin to $100k?',
      category: 'crypto',
    });
  });

  it('should save data even when translation fails', async () => {
    const mockSyncLogId = 'sync-log-3';
    const mockMarkets = [
      {
        id: 'market-3',
        question: 'Test?',
        category: 'test',
        price: 0.5,
        volume24hr: 5000,
        volume: 30000,
        active: true,
      },
    ];

    vi.mocked(prisma.syncLog.create).mockResolvedValueOnce({
      id: mockSyncLogId,
      status: 'running',
    } as any);

    vi.mocked(fetchActiveMarkets).mockResolvedValueOnce(mockMarkets);
    vi.mocked(prisma.market.findUnique).mockResolvedValueOnce(null);
    vi.mocked(mapTheme).mockReturnValueOnce('other');
    vi.mocked(translateMarket).mockRejectedValueOnce(new Error('LLM API error'));
    vi.mocked(prisma.market.upsert).mockResolvedValueOnce({} as any);
    vi.mocked(prisma.syncLog.update).mockResolvedValueOnce({} as any);

    const request = new Request('http://localhost:3000/api/cron/sync-markets', {
      headers: { authorization: 'Bearer test-secret' },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    // upsert should still be called with null titleJa and contextNote
    expect(prisma.market.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          titleJa: null,
          contextNote: null,
        }),
      })
    );
  });

  it('should log error when sync fails', async () => {
    const mockSyncLogId = 'sync-log-4';

    vi.mocked(prisma.syncLog.create).mockResolvedValueOnce({
      id: mockSyncLogId,
      status: 'running',
    } as any);

    vi.mocked(fetchActiveMarkets).mockRejectedValueOnce(
      new Error('API connection failed')
    );
    vi.mocked(prisma.syncLog.update).mockResolvedValueOnce({} as any);

    const request = new Request('http://localhost:3000/api/cron/sync-markets', {
      headers: { authorization: 'Bearer test-secret' },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Sync failed');

    expect(prisma.syncLog.update).toHaveBeenCalledWith({
      where: { id: mockSyncLogId },
      data: expect.objectContaining({
        status: 'error',
        error: 'API connection failed',
      }),
    });
  });
});
