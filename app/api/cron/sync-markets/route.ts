import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { fetchActiveMarkets } from '@/lib/polymarket';
import { translateMarket } from '@/lib/translation';
import { mapTheme } from '@/lib/theme-mapping';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // CRON_SECRET検証
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const syncLog = await prisma.syncLog.create({
    data: { status: 'running' },
  });

  try {
    const rawMarkets = await fetchActiveMarkets();
    let newCount = 0;

    for (const raw of rawMarkets) {
      const existing = await prisma.market.findUnique({
        where: { polymarketId: raw.id },
      });

      let titleJa = existing?.titleJa ?? null;
      let contextNote = existing?.contextNote ?? null;
      let theme = existing?.theme ?? null;

      // 新規市場: 翻訳 + テーマ分類
      if (!existing) {
        newCount++;
        theme = mapTheme(raw.category, raw.question);

        try {
          const translation = await translateMarket({
            question: raw.question,
            category: raw.category,
          });
          titleJa = translation.titleJa;
          contextNote = translation.contextNote;
        } catch (err) {
          console.error(`Translation failed for market ${raw.id}:`, err);
          // 翻訳失敗時はnullのまま保存（後でバッチ回収）
        }
      }

      // 24h変動率の計算（既存データがある場合）
      const change24h = existing
        ? raw.price - existing.currentPrice
        : 0;

      await prisma.market.upsert({
        where: { polymarketId: raw.id },
        update: {
          currentPrice: raw.price,
          volume24h: raw.volume24hr,
          change24h,
          lastSyncedAt: new Date(),
        },
        create: {
          polymarketId: raw.id,
          question: raw.question,
          category: raw.category,
          titleJa,
          contextNote,
          theme,
          currentPrice: raw.price,
          volume24h: raw.volume24hr,
          change24h: 0,
          lastSyncedAt: new Date(),
        },
      });
    }

    // 同期ログ更新
    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        completedAt: new Date(),
        marketsCount: rawMarkets.length,
        newMarkets: newCount,
        status: 'success',
      },
    });

    return NextResponse.json({
      success: true,
      synced: rawMarkets.length,
      newMarkets: newCount,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Market sync error:', error);

    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        completedAt: new Date(),
        error: errorMessage,
        status: 'error',
      },
    });

    return NextResponse.json(
      { error: 'Sync failed', details: errorMessage },
      { status: 500 }
    );
  }
}
