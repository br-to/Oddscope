# Phase 1: データ基盤・基本表示 - Research

**Researched:** 2026-03-20
**Domain:** Polymarket市場データの取得・日本語化・一覧表示
**Confidence:** HIGH

## Summary

Phase 1は、Polymarket市場データを日本語で表示し、ユーザーが「何の市場か」を瞬時に理解できる基盤を構築するフェーズです。技術スタックは確立済み（Next.js 16.2 + Prisma 7.5 + Neon PostgreSQL + @polymarket/clob-client 5.8.0）で、実装の焦点は以下の4点です。

1. **データ取得の安定性**: Polymarket APIを5分間隔でポーリング、エラー時のリトライ・フォールバック
2. **日本語化の品質**: LLM翻訳＋ドメイン辞書で予測市場特有の表現を正確に訳す
3. **情報密度の最適化**: 1行1市場のテーブル表示で、必要情報を見渡せる
4. **フィルタリング体験**: テーマ・出来高・変動率で素早く絞り込める

**Primary recommendation:** データ取得とストレージを先に完成させ、その上にUI層を構築する。日本語翻訳は初期はシンプルなLLM呼び出しでも可（ドメイン辞書は運用しながら拡充）。テーマ分類は手動マッピングから始め、Phase 2で自動化を検討する。

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**データ取得・更新**
- Polymarket APIを5分間隔でポーリング
- アクティブ市場＋一定出来高以上の市場を取得（終了済み・低流動性は除外）
- 価格履歴も保存するが粒度は絞る（5分snapではなく粗い粒度でOK）
- Phase 1では全ユーザー同じデータ（遅延差はPhase 6で実装）

**日本語化**
- 市場タイトル: LLM下書き＋手動編集（重要市場は人が品質調整）
- 文脈補足（「それ何？」防止の1行解説）: LLM＋ドメイン辞書で自動生成
- タイミング: 新市場検出時に即生成＋未処理回収のバッチも持つ
- 品質基準: 正確さ優先（自然さより意味の正しさ）
- ドメイン辞書: 予測市場用語・米政治用語・暗号資産用語を整備

**一覧表示**
- 1行1市場のテーブル寄りリスト（情報密度高め）
- 各行に表示: 日本語タイトル、文脈補足1行、テーマタグ、現在確率、24h変動、出来高、急変バッジ、関連ニュースありバッジ
- レスポンシブ対応（PCベースでスマホでも崩れない）

**テーマ分類**
- Phase 1から日本語テーマを独自定義してマッピング（Polymarketカテゴリをそのまま使わない）
- テーマ例: 米政治、AI、暗号資産、地政学、マクロ、スポーツ等
- 新市場の日本語化時にテーマも同時にマッピング

**フィルタ・ソート**
- フィルタ軸: テーマ、変動率、出来高、急変フラグ
- デフォルトソート: Claude's Discretion（リサーチで最適値を提案）
- 複数フィルタの組み合わせ可能

### Claude's Discretion

以下の領域はリサーチ結果に基づき推奨を提示します。

- デフォルトソートの最適な軸（出来高、変動率、重要度スコアの組み合わせ等）
- 履歴保存の具体的な粒度（1時間、6時間等）
- 出来高閾値の初期値
- ローディング・エラー・空状態のUI設計
- テーママッピングの自動化手法（LLMベースかルールベースか）

### Deferred Ideas (OUT OF SCOPE)

- 重要度スコアによるノイズ抑制 -- Phase 2
- テーマ別グルーピング表示（セクション分け）-- Phase 2
- 相関自動検出 -- v2
- 市場詳細ページ -- v2
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MKTD-01 | Polymarket市場を日本語で一覧表示（タイトル翻訳＋短い説明文で「何の市場か」を一瞬で理解可能に） | 標準スタック: Next.js Server Components、データソース: @polymarket/clob-client、翻訳: OpenAI/Claude API、UI: shadcn/ui Table |
| MKTD-02 | 曖昧な市場・米政治/規制ネタに文脈補足を付与（日本人が「それ何？」とならないように） | ドメイン辞書パターン（予測市場用語、米政治固有名詞）、LLMプロンプトで文脈注入、データベーススキーマに`context_note`カラム |
| MKTD-04 | カテゴリ・出来高・変動率でのフィルタリング・ソート | フロントエンド: React Hook FormでフィルタUI、バックエンド: PrismaでWHERE句動的生成、キャッシュ: SWRで高速化 |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.0 | フルスタックフレームワーク | App Router、Server Components、Vercel統合。予測市場ダッシュボードのSSRに最適。 |
| TypeScript | 5.7+ | 型安全な開発 | Prisma・tRPC・Zodと完全統合。エンドツーエンド型安全性。 |
| Neon PostgreSQL | PostgreSQL 18.3互換 | サーバーレスDB | Vercel統合、自動スケーリング、ブランチング機能。市場データの永続化。 |
| Prisma ORM | 7.5.0 | データベースORM | 型安全クエリ、マイグレーション管理、Next.jsとの相性抜群。 |
| Tailwind CSS | 4.2 | スタイリング | Next.jsとの標準統合。レスポンシブ対応、ダークモード対応。 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @polymarket/clob-client | 5.8.0 | Polymarket API統合 | 市場データ取得、オーダーブック、取引履歴。TypeScript対応。 |
| SWR | 2.3+ | データフェッチング・キャッシュ | リアルタイムデータ更新、自動再検証、Vercel製でNext.jsと相性良好。 |
| React Hook Form | 7.54+ | フォーム管理 | フィルタUI構築。軽量、Zodとの統合でバリデーション。 |
| Zod | 3.24+ | スキーマバリデーション | APIレスポンス検証、フォーム入力検証。TypeScript-first。 |
| date-fns | 4.1.0 | 日付操作 | 市場終了日、価格履歴タイムスタンプ処理。日本語ロケール対応。 |
| shadcn/ui | latest | UIコンポーネント | Table、Filter、Badge等。Tailwind + Radix UI、カスタマイズ性高。 |
| OpenAI Node.js SDK | latest | LLM翻訳・文脈補足 | GPT-4o-miniでコスト最適化。ストリーミング対応。 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Next.js 16.2 | Remix v2 | RemixはSPA志向。予測市場ダッシュボードにはNext.jsのSSRが適合。 |
| Neon PostgreSQL | Supabase Postgres | Supabaseはリアルタイムサブスクリプションが特徴。Phase 1では不要でNeonの方がシンプル。 |
| Prisma ORM | Drizzle ORM | Drizzleは軽量だがPrismaの方が成熟。T3 Stackでも推奨。 |
| OpenAI GPT-4o-mini | Claude Sonnet 4.6 | Claudeは日本語精度高いがコスト高。初期はGPT-4o-miniで十分。 |
| shadcn/ui | Chakra UI, Mantine | 完全なコンポーネントライブラリ。shadcn/uiはカスタマイズ性重視。 |

**Installation:**
```bash
# Core framework
npm install next@16.2.0 react@latest react-dom@latest

# Database & ORM
npm install @neondatabase/serverless @prisma/client@7.5.0
npm install -D prisma@7.5.0

# Polymarket integration
npm install @polymarket/clob-client@5.8.0

# LLM integration
npm install openai

# UI & Forms
npm install react-hook-form @hookform/resolvers zod
npm install swr date-fns

# Dev dependencies
npm install -D typescript @types/node @types/react @types/react-dom
npm install -D eslint eslint-config-next prettier
npm install -D @tailwindcss/typography @tailwindcss/forms
```

**Version verification:** 上記バージョンは2026-03-20時点のnpm registryで検証済み。

## Architecture Patterns

### Recommended Project Structure
```
oddscope/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # ダッシュボード (レイアウト共有)
│   │   ├── page.tsx      # トップページ (市場一覧)
│   │   └── layout.tsx    # ダッシュボード共通レイアウト
│   ├── api/              # API Routes
│   │   └── cron/         # Vercel Cron Jobs
│   │       └── sync-markets/route.ts  # 市場データ定期取得
│   └── layout.tsx        # ルートレイアウト
├── lib/                   # ユーティリティ
│   ├── polymarket.ts     # Polymarket APIクライアント
│   ├── translation.ts    # 日本語翻訳ロジック
│   ├── theme-mapping.ts  # テーマ分類ロジック
│   └── db.ts             # Prisma client singleton
├── components/            # Reactコンポーネント
│   ├── market-table.tsx  # 市場一覧テーブル
│   ├── market-filters.tsx # フィルタUI
│   └── ui/               # shadcn/ui components
├── prisma/               # Prismaスキーマ
│   ├── schema.prisma     # DBスキーマ定義
│   └── migrations/       # マイグレーション履歴
└── public/               # 静的ファイル
```

### Pattern 1: Server Components + Client Components の分離

**What:** データフェッチはServer Componentsで実行し、インタラクティブUIはClient Componentsに分離。

**When to use:** 市場一覧のような、サーバーサイドでデータ取得しつつフィルタ操作が必要な画面。

**Example:**
```typescript
// app/(dashboard)/page.tsx (Server Component)
import { prisma } from '@/lib/db';
import { MarketTable } from '@/components/market-table';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { theme?: string; minVolume?: string };
}) {
  // サーバーサイドでデータ取得
  const markets = await prisma.market.findMany({
    where: {
      theme: searchParams.theme || undefined,
      volume24h: searchParams.minVolume
        ? { gte: parseFloat(searchParams.minVolume) }
        : undefined,
    },
    orderBy: { volume24h: 'desc' },
    take: 100,
  });

  return (
    <div>
      <h1>市場一覧</h1>
      {/* Client Componentで表示・フィルタ操作 */}
      <MarketTable markets={markets} />
    </div>
  );
}
```

```typescript
// components/market-table.tsx (Client Component)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export function MarketTable({ markets }: { markets: Market[] }) {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onFilter = (data: FilterForm) => {
    const params = new URLSearchParams();
    if (data.theme) params.set('theme', data.theme);
    if (data.minVolume) params.set('minVolume', data.minVolume.toString());
    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      {/* フィルタUI */}
      <form onSubmit={handleSubmit(onFilter)}>
        <select {...register('theme')}>
          <option value="">全テーマ</option>
          <option value="politics">米政治</option>
          <option value="crypto">暗号資産</option>
          {/* ... */}
        </select>
        <input type="number" {...register('minVolume')} placeholder="最小出来高" />
        <button type="submit">絞り込み</button>
      </form>

      {/* テーブル表示 */}
      <table>
        <thead>
          <tr>
            <th>市場タイトル</th>
            <th>文脈補足</th>
            <th>テーマ</th>
            <th>現在確率</th>
            <th>24h変動</th>
            <th>出来高</th>
          </tr>
        </thead>
        <tbody>
          {markets.map((market) => (
            <tr key={market.id}>
              <td>{market.titleJa}</td>
              <td>{market.contextNote}</td>
              <td>{market.theme}</td>
              <td>{(market.currentPrice * 100).toFixed(1)}%</td>
              <td>{market.change24h > 0 ? '+' : ''}{(market.change24h * 100).toFixed(1)}%</td>
              <td>${market.volume24h.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
```

### Pattern 2: Cron Job でのデータ同期

**What:** Vercel Cron Jobsを使い、5分間隔でPolymarket APIから市場データを取得してDBに保存。

**When to use:** 定期的なデータ更新が必要な場合。Phase 1ではすべてのユーザーが同じデータを見る。

**Example:**
```typescript
// app/api/cron/sync-markets/route.ts
import { NextResponse } from 'next/server';
import { ClobClient } from '@polymarket/clob-client';
import { prisma } from '@/lib/db';
import { translateMarket } from '@/lib/translation';
import { mapTheme } from '@/lib/theme-mapping';

export async function GET(request: Request) {
  // Cron Job secret検証（外部からの不正実行を防ぐ）
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = new ClobClient({ apiKey: process.env.POLYMARKET_API_KEY });

  try {
    // アクティブ市場を取得（終了済み・低流動性は除外）
    const markets = await client.getMarkets({
      active: true,
      minVolume: 1000, // $1K以上
    });

    for (const market of markets) {
      // 既存市場の更新 or 新規市場の挿入
      const existing = await prisma.market.findUnique({
        where: { polymarketId: market.id },
      });

      let titleJa = existing?.titleJa;
      let contextNote = existing?.contextNote;
      let theme = existing?.theme;

      // 新規市場の場合のみ翻訳・テーマ分類
      if (!existing) {
        const translation = await translateMarket(market);
        titleJa = translation.titleJa;
        contextNote = translation.contextNote;
        theme = mapTheme(market.category, market.question);
      }

      await prisma.market.upsert({
        where: { polymarketId: market.id },
        update: {
          currentPrice: market.price,
          volume24h: market.volume24h,
          change24h: market.change24h,
          updatedAt: new Date(),
        },
        create: {
          polymarketId: market.id,
          question: market.question,
          category: market.category,
          titleJa,
          contextNote,
          theme,
          currentPrice: market.price,
          volume24h: market.volume24h,
          change24h: market.change24h,
        },
      });
    }

    return NextResponse.json({ success: true, synced: markets.length });
  } catch (error) {
    console.error('Market sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
```

```json
// vercel.json (Cron Job設定)
{
  "crons": [
    {
      "path": "/api/cron/sync-markets",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### Pattern 3: ドメイン辞書を用いた翻訳品質向上

**What:** LLM翻訳時に予測市場・米政治・暗号資産の専門用語辞書を参照し、正確な訳語を使用。

**When to use:** 汎用LLM翻訳では文脈が失われやすい場合（「win [state]」→「勝つ」ではなく「制する」）。

**Example:**
```typescript
// lib/translation.ts
import OpenAI from 'openai';

const DOMAIN_DICTIONARY = {
  // 予測市場用語
  'resolve': '決済',
  'YES/NO': 'YES(実現) / NO(不実現)',
  'whale': '大口投資家',

  // 米政治用語
  'win [state]': '[州]を制する',
  'electoral votes': '選挙人投票',
  'swing state': '激戦州',

  // 暗号資産用語
  'ATH': '史上最高値（All-Time High）',
  'halving': '半減期',
} as const;

export async function translateMarket(market: PolymarketMarket) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // ドメイン辞書を参照語として注入
  const glossary = Object.entries(DOMAIN_DICTIONARY)
    .map(([en, ja]) => `- ${en}: ${ja}`)
    .join('\n');

  const prompt = `
あなたは予測市場の専門翻訳者です。以下の市場タイトルを日本語に翻訳してください。

**市場タイトル:** ${market.question}
**カテゴリ:** ${market.category}

**参照用語集:**
${glossary}

**指示:**
1. タイトルを日本語に翻訳（30文字以内、簡潔に）
2. 日本人が「それ何？」とならないよう、1行（50文字以内）で文脈補足を追加

**出力形式（JSON）:**
{
  "titleJa": "日本語タイトル",
  "contextNote": "文脈補足（固有名詞・背景情報の簡潔な説明）"
}
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 200,
  });

  const result = JSON.parse(completion.choices[0].message.content!);
  return result as { titleJa: string; contextNote: string };
}
```

### Pattern 4: テーマ分類のハイブリッドアプローチ

**What:** Polymarketカテゴリをベースに、キーワードマッチングで日本語テーマにマッピング。Phase 2でLLM自動化を検討。

**When to use:** 独自テーマ分類が必要で、初期は手動ルールで十分な場合。

**Example:**
```typescript
// lib/theme-mapping.ts

export type Theme =
  | 'politics' // 米政治
  | 'crypto' // 暗号資産
  | 'ai' // AI
  | 'geopolitics' // 地政学
  | 'macro' // マクロ経済
  | 'sports' // スポーツ
  | 'entertainment' // エンタメ
  | 'other'; // その他

const THEME_KEYWORDS: Record<Theme, string[]> = {
  politics: ['election', 'trump', 'biden', 'senate', 'congress', 'electoral'],
  crypto: ['bitcoin', 'ethereum', 'btc', 'eth', 'crypto', 'blockchain'],
  ai: ['ai', 'artificial intelligence', 'chatgpt', 'openai', 'llm'],
  geopolitics: ['ukraine', 'russia', 'china', 'taiwan', 'iran', 'war'],
  macro: ['fed', 'interest rate', 'gdp', 'inflation', 'recession'],
  sports: ['nba', 'nfl', 'mlb', 'world cup', 'olympics'],
  entertainment: ['movie', 'oscar', 'emmy', 'box office'],
  other: [],
};

export function mapTheme(category: string, question: string): Theme {
  const text = `${category} ${question}`.toLowerCase();

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (keywords.some((keyword) => text.includes(keyword.toLowerCase()))) {
      return theme as Theme;
    }
  }

  return 'other';
}

export const THEME_LABELS: Record<Theme, string> = {
  politics: '米政治',
  crypto: '暗号資産',
  ai: 'AI',
  geopolitics: '地政学',
  macro: 'マクロ経済',
  sports: 'スポーツ',
  entertainment: 'エンタメ',
  other: 'その他',
};
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| UIコンポーネント（Table, Filter, Badge） | スクラッチで独自実装 | shadcn/ui | アクセシビリティ、レスポンシブ、ダークモード対応済み。カスタマイズも容易。 |
| 日付フォーマット・タイムゾーン処理 | `new Date().toLocaleString()` で手動 | date-fns | 日本語ロケール対応、相対時間表示、タイムゾーン処理が簡単。バンドルサイズ小。 |
| APIリトライロジック | 自前のループ＋setTimeout | fetch with retry (axios-retry等) | エクスポネンシャルバックオフ、jitter、タイムアウト処理が難しい。 |
| データキャッシュ | 独自のメモリキャッシュ | SWR | 自動再検証、重複リクエスト排除、フォーカス時再取得など高度な機能。 |
| フォームバリデーション | 手動の`if (value === '')`チェック | React Hook Form + Zod | 複雑なバリデーションルール、エラーメッセージ管理、パフォーマンス最適化。 |

**Key insight:** Phase 1は「データ基盤」が主目的。独自実装で時間を使うより、実績あるライブラリで速く作り、データ品質・翻訳品質に時間を投資すべき。

## Common Pitfalls

### Pitfall 1: Polymarket API認証遅延トラップ

**What goes wrong:** API認証キー作成直後、約2分間は401 Unauthorizedエラーが返される。デプロイ直後に「認証が壊れている」と誤判断してロールバック。

**Why it happens:** CLOBバックエンドの認証情報伝播に遅延がある（Issue #311報告済み）。ドキュメントに記載なし。

**How to avoid:**
1. API認証キー作成後、2-3分のwarm-up期間を設ける
2. 認証エラー時に即座に失敗とせず、指数バックオフリトライ（最大5分）
3. デプロイフローにキー作成→待機→検証のステップを組み込む
4. 監視: 401エラーが3分以上継続した場合のみアラート

**Warning signs:**
- デプロイ直後に短時間の401エラーが集中
- キーローテーション後の一時的なAPI障害

### Pitfall 2: 日本語翻訳の文脈喪失

**What goes wrong:** 「Will Trump win Pennsylvania?」を「トランプはペンシルバニアに勝ちますか？」と直訳し、予測市場文脈（選挙人獲得）が伝わらない。

**Why it happens:** 汎用LLM翻訳は予測市場ドメインの暗黙知を持たない。「win」は「勝つ」だが、予測市場では「獲得する」「制する」がより正確。

**How to avoid:**
1. ドメイン特化翻訳辞書を実装（Pattern 3参照）
2. 翻訳プロンプトに市場文脈を注入（「これは予測市場のタイトルです」）
3. 頻出市場タイプのテンプレート化（選挙、スポーツ結果、価格予測など）
4. 人間レビューフィードバックループ: 誤訳報告→辞書更新

**Warning signs:**
- ユーザーから「意味が分からない」フィードバック
- 同じ英語表現が複数の日本語訳で揺れる
- YES/NO市場で「どちらに賭けるべきか分からない」混乱

### Pitfall 3: データ同期の失敗を見逃す

**What goes wrong:** Cron Jobがエラーで停止しているのに気づかず、市場データが数時間更新されない。ユーザーから「古いデータが表示されている」と指摘されて初めて発覚。

**Why it happens:** Vercel Cron Jobsはエラー時に自動リトライしない。ログを能動的に確認しないと失敗に気づかない。

**How to avoid:**
1. Cron Job内で`try-catch`し、エラー時にログ＋通知（メール/Discord）
2. 最終同期時刻をDBに記録し、10分以上更新がない場合にアラート
3. Sentryなどのエラー監視で`/api/cron/*`を追跡
4. ヘルスチェックエンドポイントで最終同期時刻を返す

**Warning signs:**
- ダッシュボードの最終更新時刻が10分以上前
- 市場価格が静止している（リアルタイムでは常に動く）
- Vercelログに`500 Internal Server Error`

### Pitfall 4: フィルタリングの状態管理が複雑化

**What goes wrong:** テーマ・出来高・変動率・急変フラグの4軸フィルタを実装したら、URLパラメータとフォーム状態の同期が複雑化。ブラウザバック時にフィルタがリセットされる。

**Why it happens:** 複数フィルタの組み合わせ可能性を考慮せず、`useState`だけで管理。URL同期を後付けで追加すると不整合が発生。

**How to avoid:**
1. 最初からURL Search Paramsをsingle source of truthとして設計
2. React Hook Formの`defaultValues`をURL paramsから初期化
3. フィルタ変更時に`router.push()`でURL更新
4. Server Componentで`searchParams`を受け取りDBクエリに反映

**Warning signs:**
- フィルタ変更後にリロードすると状態が消える
- ブラウザバックでフィルタが意図しない状態になる
- 「フィルタが保存されない」というユーザーフィードバック

### Pitfall 5: テーブルのレスポンシブ対応を後回しにする

**What goes wrong:** PCでは見やすい10カラムのテーブルが、スマホでは横スクロール地獄。ユーザーの半数がモバイルで閲覧しているのに、使い物にならない。

**Why it happens:** デスクトップファーストで開発し、レスポンシブ対応を「後でやる」と先延ばし。テーブル構造を変更するコストが大きくなり、結局放置。

**How to avoid:**
1. 最初からモバイル優先でデザイン（カード表示 or 縦並びリスト）
2. PC版は`@media (min-width: 768px)`でテーブル表示に切り替え
3. shadcn/uiの`<Table>`はレスポンシブ対応済み、カスタマイズ可能
4. 重要カラムのみモバイル表示、詳細は展開式

**Warning signs:**
- モバイルでテーブルが画面外に溢れる
- ユーザーの直帰率がモバイルで50%以上
- 「スマホで見づらい」というフィードバック

## Code Examples

### 市場データ同期（Polymarket API → DB）

```typescript
// lib/polymarket.ts
import { ClobClient } from '@polymarket/clob-client';

export async function fetchActiveMarkets() {
  const client = new ClobClient({
    host: 'https://clob.polymarket.com',
    key: process.env.POLYMARKET_API_KEY,
  });

  const markets = await client.getMarkets({
    active: true,
  });

  // 出来高閾値でフィルタ（$1K以上）
  return markets.filter((market) => market.volumeNum >= 1000);
}
```

### データベーススキーマ（Prisma）

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Market {
  id              String   @id @default(cuid())
  polymarketId    String   @unique
  question        String   // 英語原文
  category        String   // Polymarketカテゴリ
  titleJa         String?  // 日本語タイトル
  contextNote     String?  // 文脈補足（1行）
  theme           String?  // 独自テーマ（politics, crypto, ai, etc）
  currentPrice    Float    // 現在確率（0.0-1.0）
  volume24h       Float    // 24時間出来高（USD）
  change24h       Float    // 24時間変動率（-1.0 ~ 1.0）
  isActive        Boolean  @default(true)
  endDate         DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  priceSnapshots  PriceSnapshot[]

  @@index([theme])
  @@index([volume24h])
  @@index([change24h])
  @@index([isActive])
}

model PriceSnapshot {
  id        String   @id @default(cuid())
  marketId  String
  market    Market   @relation(fields: [marketId], references: [id], onDelete: Cascade)
  price     Float
  volume    Float
  timestamp DateTime @default(now())

  @@index([marketId, timestamp])
}
```

### 市場一覧のServer Component

```typescript
// app/(dashboard)/page.tsx
import { prisma } from '@/lib/db';
import { MarketTable } from '@/components/market-table';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: {
    theme?: string;
    minVolume?: string;
    sortBy?: 'volume' | 'change' | 'time';
  };
}) {
  const { theme, minVolume, sortBy = 'volume' } = searchParams;

  const markets = await prisma.market.findMany({
    where: {
      isActive: true,
      theme: theme || undefined,
      volume24h: minVolume ? { gte: parseFloat(minVolume) } : undefined,
    },
    orderBy:
      sortBy === 'volume'
        ? { volume24h: 'desc' }
        : sortBy === 'change'
        ? { change24h: 'desc' }
        : { updatedAt: 'desc' },
    take: 100,
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">予測市場一覧</h1>
      <MarketTable markets={markets} />
    </div>
  );
}
```

### フィルタUIとテーブル表示（Client Component）

```typescript
// components/market-table.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { THEME_LABELS, type Theme } from '@/lib/theme-mapping';

interface MarketTableProps {
  markets: Array<{
    id: string;
    titleJa: string | null;
    contextNote: string | null;
    theme: string | null;
    currentPrice: number;
    change24h: number;
    volume24h: number;
  }>;
}

export function MarketTable({ markets }: MarketTableProps) {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onFilter = (data: {
    theme?: string;
    minVolume?: string;
    sortBy?: string;
  }) => {
    const params = new URLSearchParams();
    if (data.theme) params.set('theme', data.theme);
    if (data.minVolume) params.set('minVolume', data.minVolume);
    if (data.sortBy) params.set('sortBy', data.sortBy);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div>
      {/* フィルタUI */}
      <form onSubmit={handleSubmit(onFilter)} className="mb-6 flex gap-4">
        <select {...register('theme')} className="border rounded px-3 py-2">
          <option value="">全テーマ</option>
          {Object.entries(THEME_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <input
          type="number"
          {...register('minVolume')}
          placeholder="最小出来高（USD）"
          className="border rounded px-3 py-2"
        />

        <select {...register('sortBy')} className="border rounded px-3 py-2">
          <option value="volume">出来高順</option>
          <option value="change">変動率順</option>
          <option value="time">更新順</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          絞り込み
        </button>
      </form>

      {/* テーブル表示 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">市場タイトル</th>
              <th className="border p-2 text-left">文脈補足</th>
              <th className="border p-2 text-left">テーマ</th>
              <th className="border p-2 text-right">現在確率</th>
              <th className="border p-2 text-right">24h変動</th>
              <th className="border p-2 text-right">出来高</th>
            </tr>
          </thead>
          <tbody>
            {markets.map((market) => (
              <tr key={market.id} className="hover:bg-gray-50">
                <td className="border p-2">{market.titleJa || '（翻訳中）'}</td>
                <td className="border p-2 text-sm text-gray-600">
                  {market.contextNote}
                </td>
                <td className="border p-2">
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {market.theme ? THEME_LABELS[market.theme as Theme] : 'その他'}
                  </span>
                </td>
                <td className="border p-2 text-right">
                  {(market.currentPrice * 100).toFixed(1)}%
                </td>
                <td
                  className={`border p-2 text-right ${
                    market.change24h > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {market.change24h > 0 ? '+' : ''}
                  {(market.change24h * 100).toFixed(1)}%
                </td>
                <td className="border p-2 text-right">
                  ${market.volume24h.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router（Next.js 12以前） | App Router（Next.js 13+） | 2023年5月 | Server Components、Streaming SSR、ネストレイアウトが標準。 |
| axios | fetch API（Next.js組み込み） | 2024年 | Next.jsのfetchは自動キャッシュ・再検証対応。axiosは不要。 |
| moment.js | date-fns | 2020年頃 | moment.jsは非推奨（67kB）。date-fnsは軽量（2kB）でツリーシェイク可能。 |
| Vercel Postgres | Neon PostgreSQL | 2024年12月 | Vercel Postgresは廃止。Neonに自動移行済み。 |
| NextAuth.js | Auth.js（next-auth@beta） | 2024年 | 名称変更。パッケージ名はnext-auth@betaのまま。 |

**Deprecated/outdated:**
- **Vercel Postgres**: 2024年12月に廃止。Neonに移行推奨。
- **Pages Router**: App Routerに移行済み。新規プロジェクトはApp Router一択。
- **axios**: Next.jsのfetch APIで十分。追加ライブラリ不要。

## Claude's Discretion: Recommendations

### 1. デフォルトソートの最適な軸

**推奨:** 出来高（volume24h）降順をデフォルトとする。

**理由:**
- 出来高は市場の重要度・信頼性の指標
- 高流動性市場は価格操作されにくく、情報価値が高い
- 変動率順だと低流動性市場のノイズが上位に来やすい

**代替案:**
- 「重要度スコア」（出来高 × 変動率）でランキング → Phase 2で実装
- ユーザー選択式（出来高順 / 変動率順 / 更新順）→ UI実装済み（上記コード例参照）

### 2. 履歴保存の具体的な粒度

**推奨:** 1時間ごとにスナップショット保存。

**理由:**
- 5分間隔は過剰（Phase 1では24h変動率のみ表示）
- 1時間粒度で過去30日分 = 720レコード/市場（100市場で72,000レコード）
- Phase 3で急変検知実装時に5分粒度を追加検討

**実装:**
```typescript
// Cron Jobで1時間ごとに実行
// vercel.json: "schedule": "0 * * * *"
await prisma.priceSnapshot.create({
  data: {
    marketId: market.id,
    price: market.currentPrice,
    volume: market.volume24h,
    timestamp: new Date(),
  },
});
```

### 3. 出来高閾値の初期値

**推奨:** $1,000（1K USD）以上を表示対象とする。

**理由:**
- Polymarketの市場は流動性$100〜$100万まで幅広い
- $1K未満は投機的・低信頼性の市場が多い
- 初期フィルタリングで表示市場数を100〜200に絞り、情報過多を防ぐ

**Phase 2で調整:**
- ユーザーフィードバックに基づき$500や$2Kに調整
- テーマ別に閾値を変える（政治: $5K、スポーツ: $1K等）

### 4. ローディング・エラー・空状態のUI設計

**推奨:**

**ローディング:**
```typescript
// app/(dashboard)/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**エラー:**
```typescript
// app/(dashboard)/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container mx-auto py-8">
      <div className="bg-red-50 border border-red-200 rounded p-6">
        <h2 className="text-xl font-bold text-red-800 mb-2">
          データの読み込みに失敗しました
        </h2>
        <p className="text-red-600 mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          再試行
        </button>
      </div>
    </div>
  );
}
```

**空状態:**
```typescript
// components/market-table.tsx（空の場合）
{markets.length === 0 && (
  <div className="text-center py-12 text-gray-500">
    <p className="text-xl mb-2">該当する市場が見つかりませんでした</p>
    <p className="text-sm">フィルタ条件を変更してみてください</p>
  </div>
)}
```

### 5. テーママッピングの自動化手法

**Phase 1推奨:** ルールベース（キーワードマッチング）で開始。

**理由:**
- LLM呼び出しはコスト・レイテンシが発生
- 初期は市場数が少なく（100-200）、手動調整も可能
- キーワードルールは透明性が高く、デバッグしやすい

**Phase 2で検討:** LLMベースの自動分類

**実装案（Phase 2）:**
```typescript
// LLM分類（バッチ処理）
const prompt = `
以下の市場をテーマ分類してください。

市場: ${market.question}
カテゴリ: ${market.category}

テーマ選択肢: politics, crypto, ai, geopolitics, macro, sports, entertainment, other

テーマ:`;

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: prompt }],
  max_tokens: 10,
});

const theme = completion.choices[0].message.content.trim();
```

**Phase 1では:** Pattern 4のキーワードマッチングで十分。

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 2.1+ |
| Config file | vitest.config.ts（Wave 0で作成） |
| Quick run command | `npm test -- --run --reporter=verbose` |
| Full suite command | `npm test -- --run --coverage` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MKTD-01 | Polymarket市場データを日本語で一覧表示 | integration | `npm test tests/market-display.test.ts -x` | ❌ Wave 0 |
| MKTD-02 | 曖昧な市場に文脈補足を付与 | unit | `npm test tests/translation.test.ts -x` | ❌ Wave 0 |
| MKTD-04 | カテゴリ・出来高・変動率でフィルタリング・ソート | integration | `npm test tests/market-filters.test.ts -x` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm test -- --run --reporter=verbose` (全テスト、エラー時停止)
- **Per wave merge:** `npm test -- --run --coverage` (カバレッジレポート付き)
- **Phase gate:** Full suite green + coverage > 70% before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/market-display.test.ts` — MKTD-01をカバー（Server Component、データフェッチ、日本語表示）
- [ ] `tests/translation.test.ts` — MKTD-02をカバー（LLM翻訳、ドメイン辞書、文脈補足生成）
- [ ] `tests/market-filters.test.ts` — MKTD-04をカバー（フィルタUI、Prismaクエリ、ソート）
- [ ] `tests/setup.ts` — Vitest共通設定、モック（Prisma、OpenAI）
- [ ] `vitest.config.ts` — Next.js環境、TypeScript対応、カバレッジ設定
- [ ] Framework install: `npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom`

## Open Questions

1. **Polymarket APIのrate limit実測値**
   - What we know: 公式ドキュメントに明記なし、コミュニティでは60秒間隔推奨
   - What's unclear: 実際の制限値、IP単位かAPI Key単位か
   - Recommendation: 初期は5分間隔で安全マージンを取る。Phase 2でrate limit監視と動的調整

2. **翻訳の手動編集フロー**
   - What we know: LLM下書き＋手動編集が必要（CONTEXT.md）
   - What's unclear: 編集用の管理画面を作るか、DBを直接編集するか
   - Recommendation: Phase 1ではDB直接編集（Prisma Studio使用）。Phase 2で簡易管理画面を検討

3. **価格履歴の保存期間**
   - What we know: 1時間粒度で保存推奨（上記）
   - What's unclear: 何日分保存するか、古いデータの削除タイミング
   - Recommendation: 初期は30日分保存。Phase 3で分析機能実装時に90日に拡張検討

4. **急変バッジの閾値**
   - What we know: 24h変動率を表示（CONTEXT.md）
   - What's unclear: 何%以上を「急変」とするか
   - Recommendation: Phase 1では表示のみ（バッジなし）。Phase 3で急変検知実装時に閾値設定（5%以上を推奨）

## Sources

### Primary (HIGH confidence)
- Next.js 16.2 公式ドキュメント: https://nextjs.org/docs
- Prisma 7.5 公式ドキュメント: https://www.prisma.io/docs
- @polymarket/clob-client v5.8.0 GitHub: https://github.com/Polymarket/clob-client
- Neon PostgreSQL 公式ドキュメント: https://neon.com/docs
- Tailwind CSS 4.2 公式サイト: https://tailwindcss.com
- React Hook Form 公式サイト: https://react-hook-form.com
- Zod 公式サイト: https://zod.dev
- SWR 公式サイト: https://swr.vercel.app
- date-fns 公式サイト: https://date-fns.org

### Secondary (MEDIUM confidence)
- .planning/research/STACK.md（プロジェクト既存リサーチ）
- .planning/research/ARCHITECTURE.md（プロジェクト既存リサーチ）
- .planning/research/PITFALLS.md（プロジェクト既存リサーチ）

### Tertiary (LOW confidence)
- 訓練データ: Next.js App Routerのベストプラクティス（2025年時点）
- 訓練データ: テーブルUI・フィルタリングの一般的パターン

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - npm registryで全バージョン検証済み、公式ドキュメント確認済み
- Architecture: HIGH - Next.js App Router、Server/Client Components分離は確立済みパターン
- Pitfalls: HIGH - .planning/research/PITFALLS.mdで既に調査済み（Polymarket Issue報告ベース）
- Translation patterns: MEDIUM - LLM翻訳＋ドメイン辞書は一般的手法だが、予測市場特化は推測
- Theme mapping: MEDIUM - キーワードマッチングは確立済みだが、予測市場の最適閾値は運用次第

**Research date:** 2026-03-20
**Valid until:** 2026-04-20（30日間 - スタック安定、APIは変更リスク低）

---

**Next step:** プランナーがこのリサーチを基にWave構成とタスク分解を実施します。
