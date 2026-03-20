# Technology Stack Research

**Project:** Oddscope (予測市場インテリジェンスプラットフォーム)
**Researched:** 2026-03-20
**Overall Confidence:** HIGH

## Executive Summary

予測市場インテリジェンスプラットフォームに最適な2025年の標準スタックを調査しました。Next.js 16.2 + TypeScript + Neon PostgreSQL + Tailwind CSSをコアに、Polymarket CLOB API統合、Discord通知、LLM要約機能を実現するフルスタック構成を推奨します。

**主要な判断:**
- **フロントエンド:** Next.js 16.2 (App Router) — サーバーコンポーネント、React 19対応、Vercelとの統合
- **データベース:** Neon PostgreSQL — サーバーレス、自動スケーリング、ブランチング機能
- **API連携:** @polymarket/clob-client v5.8.0 — 公式TypeScriptクライアント
- **LLM:** OpenAI GPT-4o-mini — コスト最適化された要約に最適
- **通知:** discord.js v14.25.1 — 安定した本番環境対応

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| **Next.js** | 16.2.0 | フルスタックフレームワーク | App Router、React 19サポート、Server Components、Vercel統合。日本語対応も問題なし。2025年の標準。 | HIGH |
| **TypeScript** | 5.7+ | 型安全な開発 | Next.js、Prisma、tRPCと完全統合。エンドツーエンドの型安全性を実現。 | HIGH |
| **Neon PostgreSQL** | PostgreSQL 18.3互換 | データベース（サーバーレス） | Vercel Postgresの後継。自動スケーリング、ブランチング、無料枠あり。Vercelとシームレス統合。 | HIGH |
| **Prisma ORM** | 6.0+ | データベースORM | 型安全なクエリ、マイグレーション管理、Next.jsとの相性抜群。T3 Stackでも推奨。 | HIGH |
| **Tailwind CSS** | 4.2 | スタイリング | Next.jsとの統合が標準。10kB未満のバンドルサイズ。ダークモード、レスポンシブ対応。 | HIGH |

**Sources:**
- Next.js: [公式ドキュメント](https://nextjs.org/docs) — v16.2.0確認
- Neon: [公式ドキュメント](https://neon.com/docs/introduction) — Vercel Postgresの移行先
- Prisma: [公式ドキュメント](https://www.prisma.io/docs) — Next.js統合
- Tailwind: [公式サイト](https://tailwindcss.com) — v4.2確認

### API & Integration Layer

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| **@polymarket/clob-client** | 5.8.0 | Polymarket API統合 | 公式TypeScriptクライアント。市場データ、オーダーブック、取引履歴へのアクセス。viemサポート。 | HIGH |
| **discord.js** | 14.25.1 | Discord通知Bot | Node.js標準。サウンドボード、サブスクリプション機能など最新Discord APIをサポート。 | HIGH |
| **tRPC** | 11.0+ | 型安全API層 | エンドツーエンドの型安全性。Next.jsと完全統合。REST/GraphQL不要。T3 Stackで推奨。 | HIGH |
| **Zod** | 3.24+ | スキーマバリデーション | TypeScript-first。2kB軽量。Prisma、tRPC、React Hook Formと統合可能。 | HIGH |

**Sources:**
- @polymarket/clob-client: [GitHub](https://github.com/Polymarket/clob-client) — v5.8.0 (2025-03-09)
- discord.js: [GitHub Releases](https://github.com/discordjs/discord.js/releases) — v14.25.1確認
- tRPC: [公式サイト](https://trpc.io) — T3 Stack推奨
- Zod: [公式サイト](https://zod.dev) — 2kBバンドル

### LLM & AI Integration

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| **OpenAI Node.js SDK** | latest | LLMによるニュース要約 | GPT-4o-miniによるコスト最適化。ストリーミング、Webhook対応。公式SDK。 | HIGH |
| **Claude API** (代替) | Sonnet 4.6 | LLM要約（代替案） | 日本語精度が高い。Anthropic公式。OpenAIよりコスト効率が良い場合あり。 | MEDIUM |

**推奨モデル:**
- **GPT-4o-mini:** コスト最適化モデル。ニュース要約に最適。高速。
- **Claude Sonnet 4.6:** 日本語の要約精度を重視する場合の代替案。

**Sources:**
- OpenAI SDK: [GitHub](https://github.com/openai/openai-node) — 公式Node.jsライブラリ
- Claude: [公式ドキュメント](https://platform.claude.com/docs/claude/docs/intro-to-claude) — Sonnet 4.6確認

### Supporting Libraries

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| **SWR** | 2.3+ | データフェッチング | リアルタイムデータの更新、キャッシング、再検証。Vercel製。Next.jsと相性抜群。 | HIGH |
| **React Hook Form** | 7.54+ | フォーム管理 | 軽量（依存なし）、パフォーマンス最適化、Zodとの統合。 | HIGH |
| **shadcn/ui** | latest | UIコンポーネント | Tailwind CSS + Radix UI。コピー&ペースト型。カスタマイズ性が高い。 | MEDIUM |
| **Upstash Redis** | latest | キャッシング、レート制限 | サーバーレス対応。99.99%稼働率。グローバル低レイテンシ。 | HIGH |
| **date-fns** | 4.1+ | 日付操作 | moment.jsより軽量。ツリーシェイク対応。日本語ロケール対応。 | HIGH |
| **nanoid** | 5.0+ | ID生成 | UUID v4より短く軽量（118 bytes）。URL-safe。 | HIGH |
| **Auth.js** | latest (NextAuth.js後継) | 認証 | OAuth統合。Next.js標準。フリーミアムモデルに対応。 | MEDIUM |

**Sources:**
- SWR: [公式サイト](https://swr.vercel.app) — Vercel製、Next.js推奨
- React Hook Form: [公式サイト](https://react-hook-form.com) — 軽量、高性能
- shadcn/ui: [公式サイト](https://www.shadcn.com) — Tailwind + Radix UI
- Upstash Redis: [公式ドキュメント](https://upstash.com/docs/redis) — サーバーレス対応
- date-fns: [公式サイト](https://date-fns.org) — 軽量、ツリーシェイク対応
- nanoid: [GitHub](https://github.com/ai/nanoid) — 118 bytes
- Auth.js: [公式サイト](https://authjs.dev) — NextAuth.js後継

### Development & Monitoring Tools

| Tool | Version | Purpose | Notes | Confidence |
|------|---------|---------|-------|------------|
| **Sentry** | latest | エラー監視、パフォーマンストレース | Session Replay、AI監視、ソースマップ自動アップロード。本番環境10%サンプリング推奨。 | HIGH |
| **Vercel Cron Jobs** | N/A | スケジュールタスク | データ定期取得、通知バッチ処理。Vercel Functionsで実行。UTC cron式。 | HIGH |
| **ESLint + Prettier** | latest | コード品質 | Next.js組み込み。TypeScript対応。 | HIGH |
| **Vitest** | latest | テスティング | @polymarket/clob-client v5.6.0で採用。高速、Vite互換。 | MEDIUM |

**Sources:**
- Sentry: [Next.js公式ドキュメント](https://docs.sentry.io/platforms/javascript/guides/nextjs/) — Session Replay、AI監視
- Vercel Cron Jobs: [公式ドキュメント](https://vercel.com/docs/cron-jobs) — UTC cron式、Functions統合

## Installation

### 初期セットアップ (T3 Stack推奨)

```bash
# T3 Stackボイラープレート（推奨）
npx create-t3-app@latest oddscope
# 選択: TypeScript, tRPC, Tailwind CSS, Prisma, NextAuth.js

# または手動セットアップ
npx create-next-app@latest oddscope --typescript --tailwind --app
cd oddscope
```

### Core Dependencies

```bash
# Core framework
npm install next@latest react@latest react-dom@latest

# Database & ORM
npm install @neondatabase/serverless @prisma/client
npm install -D prisma

# API & Validation
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next @tanstack/react-query
npm install zod

# Polymarket integration
npm install @polymarket/clob-client

# Discord bot
npm install discord.js

# LLM integration
npm install openai
# または
npm install @anthropic-ai/sdk

# UI & Forms
npm install react-hook-form @hookform/resolvers
npm install swr
npm install date-fns nanoid

# Caching & Rate limiting
npm install @upstash/redis

# Authentication (if needed)
npm install next-auth@beta
```

### Dev Dependencies

```bash
npm install -D typescript @types/node @types/react @types/react-dom
npm install -D eslint eslint-config-next prettier
npm install -D @tailwindcss/typography @tailwindcss/forms
npm install -D vitest @vitejs/plugin-react
```

### Monitoring & Error Tracking

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative | Confidence |
|-------------|-------------|-------------------------|------------|
| **Next.js 16.2** | Remix v2 | React RouterベースのSPA志向の場合。ただし予測市場プラットフォームにはNext.jsの方が適合。 | HIGH |
| **Neon PostgreSQL** | Supabase Postgres | リアルタイムサブスクリプション、Row Level Securityが必要な場合。ただしNeonの方がシンプル。 | HIGH |
| **Prisma ORM** | Drizzle ORM | より軽量なORMが必要な場合。T3 Stackでは両方サポート。Prismaの方が成熟。 | MEDIUM |
| **tRPC** | REST API (Next.js API Routes) | 外部API公開が必要な場合。内部APIのみならtRPC推奨。 | HIGH |
| **OpenAI GPT-4o-mini** | Claude Sonnet 4.6 | 日本語要約精度を重視する場合。コスト比較次第。 | MEDIUM |
| **SWR** | TanStack Query (React Query) | より複雑なキャッシング戦略が必要な場合。tRPCと統合するならReact Query。 | MEDIUM |
| **shadcn/ui** | Chakra UI, Mantine | 完全なコンポーネントライブラリが必要な場合。shadcn/uiはカスタマイズ性重視。 | MEDIUM |
| **Upstash Redis** | Vercel KV | Vercel環境に完全統合したい場合。Upstashの方が柔軟。 | HIGH |

## What NOT to Use

| Avoid | Why | Use Instead | Confidence |
|-------|-----|-------------|------------|
| **Moment.js** | 非推奨、バンドルサイズ大（67kB）、ツリーシェイク不可 | date-fns (軽量、ツリーシェイク対応) | HIGH |
| **uuid/v4** | nanoidより大きい（423 bytes vs 118 bytes）、ID長い（36文字 vs 21文字） | nanoid (より短く軽量) | HIGH |
| **Axios** | 2025年では不要。fetch APIが標準化され、Next.jsに組み込み。 | fetch API (Next.js組み込み) | MEDIUM |
| **Create React App** | 非推奨。Next.jsに移行済み。 | Next.js | HIGH |
| **Vercel Postgres** | 2024年12月に廃止。Neonに自動移行済み。 | Neon PostgreSQL | HIGH |
| **NextAuth.js** | Auth.jsに名称変更。パッケージ名は`next-auth@beta` | Auth.js (next-auth@beta) | MEDIUM |
| **Pages Router (旧Next.js)** | App Routerに移行済み。新規プロジェクトはApp Router推奨。 | App Router (Next.js 13+) | HIGH |

## Stack Patterns by Use Case

### If リアルタイム通知が最優先:
- **Upstash Redis** + **SWR** + **Vercel Cron Jobs**
- Redis Pub/Sub でリアルタイム市場変動を検知
- SWRで自動再検証
- Cron Jobsで定期バッチ処理

### If コスト最適化が最優先:
- **Claude Haiku 4.5** (最速、低コスト) または **GPT-4o-mini**
- **Neon Free Tier** (500MB、自動スケールダウン)
- **Vercel Hobby Plan** (無料、ビルド時間制限あり)

### If 日本語精度が最優先:
- **Claude Sonnet 4.6** (日本語精度最高)
- **GPT-4o** (高精度、高コスト)

### If フリーミアムモデル実装:
- **Auth.js** + **Prisma** + **Upstash Redis**
- Auth.jsで認証
- Prismaでユーザープラン管理
- Redisでレート制限（無料ユーザーは遅延データ、有料は即時）

### If 外部API公開が必要:
- **REST API (Next.js API Routes)** > tRPC
- tRPCは内部API専用（型共有不可）

## Version Compatibility

| Package A | Compatible With | Notes | Confidence |
|-----------|-----------------|-------|------------|
| Next.js 16.2 | React 19 | Next.js 16.2はReact 19に対応 | HIGH |
| Prisma 6.0+ | Neon PostgreSQL 18.3 | 完全互換 | HIGH |
| tRPC 11.0+ | Next.js 16.2 App Router | App Router専用アダプター利用 | HIGH |
| @polymarket/clob-client 5.8+ | viem WalletClient | v5.5.0でviem対応追加 | HIGH |
| discord.js 14.25+ | Node.js 18+ | Node.js 18以上が必須 | HIGH |
| Zod 3.24+ | React Hook Form 7.54+ | @hookform/resolvers経由で統合 | HIGH |
| Sentry Next.js | Next.js 16.2 | withSentryConfigでラップ | HIGH |

## Architecture Recommendations

### Project Structure (App Router)

```
oddscope/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # ダッシュボード (レイアウト共有)
│   │   ├── page.tsx      # トップページ (市場一覧)
│   │   ├── market/       # 市場詳細
│   │   └── alerts/       # アラート設定
│   ├── api/              # API Routes (Cron, Webhook)
│   │   ├── cron/         # Vercel Cron Jobs
│   │   └── webhook/      # Discord Webhook
│   └── layout.tsx        # ルートレイアウト
├── server/                # バックエンドロジック
│   ├── api/              # tRPC routers
│   ├── db/               # Prisma client
│   ├── integrations/     # 外部API統合
│   │   ├── polymarket/   # Polymarket CLOB client
│   │   ├── discord/      # Discord bot
│   │   └── llm/          # OpenAI/Claude
│   └── services/         # ビジネスロジック
├── components/            # Reactコンポーネント
├── lib/                   # ユーティリティ
├── prisma/               # Prismaスキーマ
└── public/               # 静的ファイル
```

### Database Schema (Prisma Example)

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
  question        String
  category        String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  priceSnapshots  PriceSnapshot[]
  alerts          Alert[]
}

model PriceSnapshot {
  id        String   @id @default(cuid())
  marketId  String
  market    Market   @relation(fields: [marketId], references: [id])
  price     Float
  volume    Float
  timestamp DateTime @default(now())

  @@index([marketId, timestamp])
}

model Alert {
  id        String   @id @default(cuid())
  userId    String
  marketId  String
  market    Market   @relation(fields: [marketId], references: [id])
  type      String   // "price_change" | "volume_spike" | "whale_activity"
  threshold Float
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  @@index([userId, isActive])
}

model User {
  id            String   @id @default(cuid())
  discordId     String?  @unique
  email         String?  @unique
  tier          String   @default("free") // "free" | "premium"
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## Production Deployment

### Recommended Platform: Vercel

**理由:**
- Next.js開発元
- Cron Jobs、Edge Functions、Analytics統合
- Neonとのシームレス統合
- 無料枠あり（Hobby Plan）

**代替案:**
- **Railway**: データベース + アプリケーションホスティング統合
- **Fly.io**: 低レイテンシ、グローバル展開

### Environment Variables

```bash
# .env.local
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."  # Neon pooling

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

DISCORD_BOT_TOKEN="..."
DISCORD_WEBHOOK_URL="..."

POLYMARKET_API_KEY="..."

OPENAI_API_KEY="..."
# または
ANTHROPIC_API_KEY="..."

UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."

SENTRY_DSN="..."

NEXT_PUBLIC_APP_URL="https://oddscope.app"
```

## Cost Estimates (Minimum Viable Product)

| Service | Free Tier | Paid Plan (低トラフィック) | Notes |
|---------|-----------|---------------------------|-------|
| Vercel Hosting | Hobby: 無料 | Pro: $20/月 | Cron Jobs含む |
| Neon PostgreSQL | 500MB: 無料 | Pro: $19/月 (10GB) | 自動スケールダウン |
| Upstash Redis | 10k commands/day: 無料 | Pay-as-you-go: $0.2/10k | レート制限用 |
| OpenAI GPT-4o-mini | N/A | ~$0.15/1M tokens (input) | 要約生成 |
| Claude Sonnet 4.6 | N/A | ~$3/1M tokens (input) | 代替案 |
| Sentry | 5k errors/月: 無料 | Team: $26/月 | エラー監視 |
| **Total (MVP)** | **無料 ~ $20/月** | **$65 ~ $85/月** | トラフィック次第 |

## Sources

### HIGH Confidence (公式ドキュメント、公式リリース)
- Next.js 16.2.0: https://github.com/vercel/next.js/releases
- @polymarket/clob-client v5.8.0: https://github.com/Polymarket/clob-client/releases
- discord.js v14.25.1: https://github.com/discordjs/discord.js/releases
- Neon PostgreSQL: https://neon.com/docs/introduction
- Prisma: https://www.prisma.io/docs
- Tailwind CSS v4.2: https://tailwindcss.com
- tRPC: https://trpc.io
- Zod: https://zod.dev
- Sentry Next.js: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Vercel Cron Jobs: https://vercel.com/docs/cron-jobs
- OpenAI Node.js SDK: https://github.com/openai/openai-node
- Claude API: https://platform.claude.com/docs/claude/docs/intro-to-claude

### MEDIUM Confidence (コミュニティ推奨、ベストプラクティス)
- T3 Stack: https://github.com/t3-oss/create-t3-app
- SWR: https://swr.vercel.app
- React Hook Form: https://react-hook-form.com
- shadcn/ui: https://www.shadcn.com
- Upstash Redis: https://upstash.com/docs/redis
- date-fns: https://date-fns.org
- nanoid: https://github.com/ai/nanoid
- Auth.js: https://authjs.dev

---
*Stack research for: 予測市場インテリジェンスプラットフォーム*
*Researched: 2026-03-20*
