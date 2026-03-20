import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Prisma mock
vi.mock('@/lib/db', () => ({
  prisma: {
    market: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
      count: vi.fn(),
    },
    priceSnapshot: {
      create: vi.fn(),
      createMany: vi.fn(),
    },
    syncLog: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));
