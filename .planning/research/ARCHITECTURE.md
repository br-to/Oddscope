# Architecture Research

**Domain:** 予測市場インテリジェンスプラットフォーム
**Researched:** 2026-03-20
**Confidence:** MEDIUM

> **信頼性について**: このアーキテクチャリサーチは、分散システム、リアルタイムデータ処理、市場データプラットフォームの一般的なベストプラクティスに基づいています。Polymarket固有のパターンについては公式ドキュメントでの検証を推奨します。

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                             │
├──────────────────────────────┬──────────────────────────────────────────┤
│    Web Dashboard (Next.js)   │      Discord Bot (discord.js)            │
│  - Market list view          │  - Alert notifications                   │
│  - Detail pages              │  - Whale alerts                          │
│  - Japanese UI               │  - Morning summary                       │
└──────────────┬───────────────┴───────────────┬──────────────────────────┘
               │                               │
               └───────────┬───────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY LAYER                              │
├─────────────────────────────────────────────────────────────────────────┤
│  REST API (Express/Fastify)                                             │
│  - Authentication/Authorization                                          │
│  - Rate limiting (freemium tier control)                                │
│  - Request routing                                                       │
└──────────────┬──────────────────────────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER                                │
├──────────────┬────────────────┬────────────────┬─────────────────────────┤
│  Market      │  Analytics     │  AI Analysis   │  Notification          │
│  Service     │  Service       │  Service       │  Service               │
│              │                │                │                        │
│ - データ取得  │ - 変動検知      │ - LLM要約      │ - Discord送信          │
│ - 正規化      │ - クジラ検出    │ - ニュース分析  │ - アラート管理         │
│ - キャッシュ  │ - 相関分析      │ - 手動編集管理  │ - 購読管理             │
└──────────────┴────────────────┴────────────────┴─────────────────────────┘
               │                │                │                │
               └────────────────┴────────────────┴────────────────┘
                                       ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA INGESTION LAYER                           │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │ Polymarket       │  │ News API         │  │ Scheduled Jobs   │      │
│  │ Poller           │  │ Aggregator       │  │ (Cron/Queue)     │      │
│  │                  │  │                  │  │                  │      │
│  │ - Market data    │  │ - 関連ニュース   │  │ - 定期更新       │      │
│  │ - Order book     │  │ - トピック抽出   │  │ - 朝のまとめ生成  │      │
│  │ - Trade history  │  │                  │  │ - データクリーン  │      │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
                                       ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                           STORAGE LAYER                                  │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐   │
│  │ PostgreSQL  │  │ Redis       │  │ TimescaleDB │  │ Object Store │   │
│  │             │  │             │  │  (拡張)      │  │  (S3互換)     │   │
│  │ - Markets   │  │ - Cache     │  │             │  │              │   │
│  │ - Users     │  │ - Sessions  │  │ - 時系列価格 │  │ - AI生成物   │   │
│  │ - Summaries │  │ - Rate limit│  │ - 出来高履歴 │  │ - Export data│   │
│  │ - Alerts    │  │ - Job queue │  │ - 変動履歴   │  │              │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                       ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES                                │
├─────────────────────────────────────────────────────────────────────────┤
│  Polymarket CLOB API  │  OpenAI/Claude API  │  News API  │  Stripe      │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Web Dashboard** | ユーザー向けUI、市場一覧、詳細表示、日本語UI | Next.js 14 App Router + React Server Components |
| **Discord Bot** | 通知配信、アラート送信、インタラクティブコマンド | discord.js v14 + Interaction handlers |
| **API Gateway** | 認証、レート制限、リクエストルーティング | Express.js + JWT + rate-limiter-flexible |
| **Market Service** | Polymarketデータ取得・正規化・キャッシュ | TypeScript service classes + axios-retry |
| **Analytics Service** | 変動検知、クジラ検出、統計処理 | 時系列分析ロジック + threshold-based alerts |
| **AI Analysis Service** | LLM要約生成、ニュース分析、手動編集フロー | OpenAI/Claude SDK + prompt templates |
| **Notification Service** | Discord送信、購読管理、アラートキュー | Bull queue + discord.js webhook |
| **Polymarket Poller** | 定期的なAPI polling、差分検知 | Node.js cron jobs + state comparison |
| **News Aggregator** | ニュース取得、関連性判定 | News API client + keyword matching |
| **PostgreSQL** | 構造化データストレージ (markets, users, alerts) | Prisma ORM + connection pooling |
| **Redis** | キャッシュ、セッション、ジョブキュー | ioredis + Bull for job queue |
| **TimescaleDB (拡張)** | 時系列データ最適化 (価格履歴、出来高) | PostgreSQL extension (v1では通常のPG可) |

## Recommended Project Structure

```
oddscope/
├── apps/
│   ├── web/                    # Next.js web dashboard
│   │   ├── app/                # App Router pages
│   │   ├── components/         # React components
│   │   ├── lib/                # Client utilities
│   │   └── public/             # Static assets
│   ├── discord-bot/            # Discord bot service
│   │   ├── commands/           # Slash commands
│   │   ├── events/             # Discord events
│   │   └── index.ts            # Bot entry point
│   └── api/                    # Backend API service
│       ├── routes/             # API endpoints
│       ├── middleware/         # Auth, rate limit
│       └── server.ts           # API server
├── packages/
│   ├── core/                   # Shared business logic
│   │   ├── services/           # Service classes
│   │   │   ├── market.ts       # Market data service
│   │   │   ├── analytics.ts   # Analytics service
│   │   │   ├── ai.ts           # AI analysis service
│   │   │   └── notification.ts # Notification service
│   │   ├── models/             # Domain models
│   │   └── utils/              # Shared utilities
│   ├── db/                     # Database layer
│   │   ├── prisma/             # Prisma schema & migrations
│   │   ├── schema.prisma       # Database schema
│   │   └── client.ts           # DB client singleton
│   ├── config/                 # Shared configuration
│   │   ├── env.ts              # Environment variables
│   │   └── constants.ts        # App constants
│   └── types/                  # Shared TypeScript types
│       ├── polymarket.ts       # Polymarket API types
│       ├── market.ts           # Internal market types
│       └── user.ts             # User & subscription types
├── workers/                    # Background jobs
│   ├── polymarket-poller.ts   # Market data polling
│   ├── analytics-processor.ts # Analytics calculations
│   ├── morning-summary.ts     # Daily summary generator
│   └── alert-dispatcher.ts    # Alert processing
└── infrastructure/             # Deployment configs
    ├── docker/                 # Docker configs
    ├── k8s/                    # Kubernetes manifests (future)
    └── terraform/              # Infrastructure as Code (future)
```

### Structure Rationale

- **Monorepo (Turborepo/pnpm workspaces)**: Web、Discord Bot、API、Workersを単一リポジトリで管理。共通ロジックを `packages/core` で共有し、重複を排除。
- **apps/**: 各デプロイ単位（Web、Bot、API）を分離。独立してスケール・デプロイ可能。
- **packages/core/**: ビジネスロジックを集約。Market Service、Analytics Service、AI Serviceなどドメイン駆動設計のサービス層。
- **packages/db/**: Prismaを使ったDB層。スキーマ定義とマイグレーションを一元管理。
- **workers/**: 長時間実行・定期実行のバックグラウンドジョブ。Bullキューで非同期実行。

## Architectural Patterns

### Pattern 1: Polling with State Comparison (データインジェスト)

**What:** Polymarket APIを定期的にpollingし、前回取得時との差分を検知してイベントを発火させる。

**When to use:** WebSocketやStreaming APIが提供されていない場合（Polymarket CLOB APIはREST主体）。

**Trade-offs:**
- **Pro:** 実装がシンプル、エラーハンドリングしやすい、APIレート制限に対応しやすい
- **Con:** リアルタイム性が polling interval に依存（推奨: 30秒〜1分）、API呼び出し回数が多い

**Example:**
```typescript
// workers/polymarket-poller.ts
import { MarketService } from '@oddscope/core/services/market';
import { AnalyticsService } from '@oddscope/core/services/analytics';

interface MarketSnapshot {
  id: string;
  price: number;
  volume: number;
  timestamp: Date;
}

class PolymarketPoller {
  private lastSnapshots: Map<string, MarketSnapshot> = new Map();

  async poll() {
    const markets = await MarketService.fetchActiveMarkets();

    for (const market of markets) {
      const previous = this.lastSnapshots.get(market.id);

      if (previous) {
        const priceChange = Math.abs(market.price - previous.price);
        const volumeChange = market.volume - previous.volume;

        // 急変検知 (5%以上の価格変動)
        if (priceChange / previous.price > 0.05) {
          await AnalyticsService.triggerPriceAlert(market, previous);
        }

        // 出来高急増検知 (前回の2倍以上)
        if (volumeChange > previous.volume) {
          await AnalyticsService.triggerVolumeAlert(market, previous);
        }
      }

      // スナップショット更新
      this.lastSnapshots.set(market.id, {
        id: market.id,
        price: market.price,
        volume: market.volume,
        timestamp: new Date(),
      });
    }
  }

  start(intervalMs: number = 60000) {
    setInterval(() => this.poll(), intervalMs);
  }
}
```

### Pattern 2: Queue-Based AI Processing (AI要約生成)

**What:** AI要約生成リクエストをキューに積み、ワーカーで非同期処理。生成結果は手動編集可能な下書きとして保存。

**When to use:** LLM API呼び出しのような高コスト・高レイテンシ処理を同期的に待ちたくない場合。

**Trade-offs:**
- **Pro:** APIレスポンスをブロックしない、リトライ可能、レート制限対応しやすい、コスト管理しやすい
- **Con:** リアルタイム性が低下（数秒〜数十秒の遅延）、キューインフラが必要

**Example:**
```typescript
// packages/core/services/ai.ts
import { Queue } from 'bull';
import OpenAI from 'openai';

interface SummaryJob {
  marketId: string;
  priceChange: number;
  newsContext: string[];
}

const summaryQueue = new Queue<SummaryJob>('ai-summary', {
  redis: { host: 'localhost', port: 6379 }
});

// Jobをキューに追加
export async function requestSummary(job: SummaryJob) {
  await summaryQueue.add(job, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  });
}

// Workerでジョブ処理
summaryQueue.process(async (job) => {
  const { marketId, priceChange, newsContext } = job.data;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
あなたは予測市場アナリストです。以下の市場変動について、日本語で1行（50文字以内）で要約してください。

市場ID: ${marketId}
価格変動: ${priceChange > 0 ? '+' : ''}${(priceChange * 100).toFixed(1)}%
関連ニュース:
${newsContext.join('\n')}

要約:`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 100,
    temperature: 0.7,
  });

  const summary = completion.choices[0].message.content;

  // 下書きとして保存（手動編集可能）
  await db.marketSummary.create({
    data: {
      marketId,
      content: summary,
      status: 'draft', // 'draft' | 'approved' | 'published'
      generatedAt: new Date(),
    }
  });
});
```

### Pattern 3: Multi-Tier Caching Strategy (パフォーマンス最適化)

**What:** 頻繁にアクセスされるデータを複数層でキャッシュ。L1: In-memory、L2: Redis、L3: Database。

**When to use:** 同じデータへのアクセスが多く、データベースクエリを削減したい場合。

**Trade-offs:**
- **Pro:** レスポンス速度向上、DB負荷軽減、スケーラビリティ向上
- **Con:** キャッシュ無効化の複雑さ、データの鮮度管理、メモリ使用量増加

**Example:**
```typescript
// packages/core/services/market.ts
import NodeCache from 'node-cache';
import Redis from 'ioredis';
import { prisma } from '@oddscope/db';

const memoryCache = new NodeCache({ stdTTL: 30 }); // L1: 30秒
const redis = new Redis(); // L2: 5分

export class MarketService {
  static async getMarket(marketId: string) {
    // L1: In-memory cache check
    const l1Hit = memoryCache.get<Market>(marketId);
    if (l1Hit) return l1Hit;

    // L2: Redis cache check
    const l2Hit = await redis.get(`market:${marketId}`);
    if (l2Hit) {
      const market = JSON.parse(l2Hit);
      memoryCache.set(marketId, market);
      return market;
    }

    // L3: Database query
    const market = await prisma.market.findUnique({
      where: { id: marketId }
    });

    if (market) {
      // キャッシュに保存
      await redis.setex(`market:${marketId}`, 300, JSON.stringify(market)); // 5分
      memoryCache.set(marketId, market);
    }

    return market;
  }

  static async invalidateCache(marketId: string) {
    memoryCache.del(marketId);
    await redis.del(`market:${marketId}`);
  }
}
```

### Pattern 4: Webhook + Command Pattern (Discord Bot)

**What:** Discord Interactionを受信し、Commandパターンで処理を分離。通知はWebhookで送信。

**When to use:** Discord Botで複数のコマンドを管理し、拡張性を保ちたい場合。

**Trade-offs:**
- **Pro:** コマンド追加が容易、テスト可能、責任分離
- **Con:** 小規模なBotには過剰設計の可能性

**Example:**
```typescript
// apps/discord-bot/commands/subscribe.ts
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { NotificationService } from '@oddscope/core/services/notification';

export const data = new SlashCommandBuilder()
  .setName('subscribe')
  .setDescription('市場アラートを購読')
  .addStringOption(option =>
    option.setName('market')
      .setDescription('市場ID')
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  const marketId = interaction.options.get('market')?.value as string;
  const userId = interaction.user.id;

  await NotificationService.subscribe(userId, marketId);

  await interaction.reply({
    content: `✅ 市場 ${marketId} のアラートを購読しました`,
    ephemeral: true
  });
}

// apps/discord-bot/index.ts
import { Client, GatewayIntentBits } from 'discord.js';
import * as subscribeCommand from './commands/subscribe';

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = new Map();
commands.set('subscribe', subscribeCommand);

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = commands.get(interaction.commandName);
  if (command) {
    await command.execute(interaction);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
```

## Data Flow

### Market Data Ingestion Flow

```
[Polymarket API]
    ↓ (HTTP GET every 60s)
[Polymarket Poller Worker]
    ↓ (compare with last snapshot)
[State Comparison Logic]
    ↓ (if change detected)
[Analytics Service] → [PostgreSQL: market_snapshots table]
    ↓ (if alert threshold exceeded)
[Notification Service] → [Bull Queue: alert-dispatch]
    ↓
[Alert Dispatcher Worker]
    ↓
[Discord Webhook API] → [User's Discord Channel]
```

### AI Summary Generation Flow

```
[Analytics Service detects price spike]
    ↓
[AI Service: requestSummary()]
    ↓
[Bull Queue: ai-summary]
    ↓
[AI Worker pulls job]
    ↓
[Fetch related news from News API]
    ↓
[Generate prompt with context]
    ↓
[OpenAI API call]
    ↓
[Store as 'draft' in PostgreSQL: market_summaries]
    ↓
[Admin reviews in Web Dashboard]
    ↓
[Approve → status = 'published']
    ↓
[Display in dashboard & send to Discord]
```

### User Request Flow (Web Dashboard)

```
[User Browser]
    ↓ (HTTPS)
[Next.js App Router SSR]
    ↓ (fetch data)
[API Gateway] → [Authentication Middleware] → [Rate Limiter]
    ↓
[Market Service]
    ↓ (check cache hierarchy)
[L1: Memory] → [L2: Redis] → [L3: PostgreSQL]
    ↓
[Data aggregation & transformation]
    ↓
[Return JSON to Next.js]
    ↓
[Server Components render HTML]
    ↓
[Send to User Browser]
```

### Whale Detection Flow

```
[Polymarket Poller fetches trade history]
    ↓
[Analytics Service: detectWhaleActivity()]
    ↓ (check conditions)
    • Single trade > $10k
    • User's total position change > $50k
    • Unusual order size (>3 std dev)
    ↓
[Create whale alert record]
    ↓
[Notification Service] → [Discord webhook to premium users]
    ↓
[Store in PostgreSQL: whale_alerts table]
    ↓
[Display in Web Dashboard with highlight]
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **0-1k users** | Monolith architecture is fine. Single PostgreSQL instance, Redis for cache/queue. All services in one Node.js process or separate Docker containers on single server. Cost: ~$50-100/month (VPS + DB hosting). |
| **1k-10k users** | Separate API, Web, and Workers into independent deployments. Add read replicas for PostgreSQL. Use managed Redis (e.g., Upstash, Redis Cloud). CDN for static assets. Horizontal scaling of workers. Cost: ~$200-500/month. |
| **10k-100k users** | Microservices architecture. Separate Market Service, Analytics Service, AI Service into independent APIs. TimescaleDB for time-series optimization. Kubernetes for orchestration. Message broker (RabbitMQ/Kafka) for inter-service communication. Cost: ~$1k-3k/month. |
| **100k+ users** | Multi-region deployment. Event-driven architecture with Kafka. Separate read/write databases. Caching layer with Redis cluster. AI batch processing optimization. Consider building WebSocket service for real-time updates. Cost: $5k+/month. |

### Scaling Priorities

1. **First bottleneck: Polymarket API rate limits**
   - **Problem:** Polling頻度を上げられない、ユーザー増加で同じデータを重複取得
   - **Solution:** Polling結果をRedisでキャッシュ、全ユーザーで共有。1回のpollingで全市場データを取得し、各ユーザーリクエストはキャッシュから返す。

2. **Second bottleneck: AI要約生成のコスト**
   - **Problem:** LLM APIコストがユーザー数に比例して増大
   - **Solution:** 要約生成を「有意な変動」がある市場のみに限定。閾値を設ける（例: 5%以上の価格変動、出来高2倍以上）。生成済み要約を再利用（同じ市場の要約は6時間有効など）。

3. **Third bottleneck: PostgreSQL書き込み負荷**
   - **Problem:** 市場スナップショットの保存頻度が高いとDB書き込みがボトルネック
   - **Solution:** バッチ書き込み（複数スナップショットをまとめてINSERT）。TimescaleDBのhypertableで時系列データを最適化。古いデータのアーカイブ（S3へのexport）。

## Anti-Patterns

### Anti-Pattern 1: Synchronous LLM Calls in API Requests

**What people do:** ユーザーがダッシュボードで市場詳細を開いた時、その場でLLM APIを呼び出して要約を生成し、レスポンスで返す。

**Why it's wrong:**
- LLM APIのレスポンスタイムは2-10秒。ユーザーは待たされる。
- API呼び出しが失敗した場合、ユーザーにエラーが表示される。
- 同じ市場を複数ユーザーが閲覧すると、重複してLLM APIを呼び出しコストが爆増。

**Do this instead:**
- 要約生成はバックグラウンドジョブ（Bull queue）で非同期処理。
- 生成済み要約をDBに保存し、APIリクエストでは保存済みデータを返す。
- 要約が未生成の場合は「生成中...」と表示し、WebSocketまたはpollingで更新を通知。

### Anti-Pattern 2: Storing All Price Ticks in PostgreSQL

**What people do:** Polymarket APIから取得した全市場の価格データを、1分ごとにPostgreSQLにINSERTする。

**Why it's wrong:**
- 数百市場 × 1分間隔 = 1日で数十万レコード。テーブルサイズが急速に増大。
- 時系列クエリ（「過去24時間の価格推移」）が遅くなる。
- インデックスサイズも肥大化し、メモリを圧迫。

**Do this instead:**
- **Short-term (過去24時間):** Redisに時系列データ保存（Sorted Setsを使用）。TTL=24時間。
- **Mid-term (過去30日):** TimescaleDB hypertableで圧縮保存。Continuous aggregatesで1時間ごとに集約。
- **Long-term (30日以上):** S3にParquet形式でexport。分析用途のみ。
- **Dashboard表示:** Redisから取得（最速）、なければTimescaleDBからクエリ。

### Anti-Pattern 3: Webhook Spamming Discord

**What people do:** 市場価格が変動するたびに、即座にDiscord webhookで通知を送る。

**Why it's wrong:**
- Discord API rate limit: 30 requests per minute per webhook。複数市場が同時に変動すると制限に引っかかる。
- ユーザーは通知過多で疲弊（notification fatigue）。重要なアラートが埋もれる。
- 短時間に大量の通知が届くと、Discordサーバーでスパム扱いされる可能性。

**Do this instead:**
- **Alert aggregation:** 同じ市場の連続したアラートは、最初の1回のみ送信し、5分間はサイレント。
- **Batch notifications:** 複数市場のアラートを1つのEmbedにまとめて送信（例: 「5つの市場が急変」）。
- **User preferences:** ユーザーが通知頻度を設定可能に（即時 / 10分ごと / 1時間ごと）。
- **Priority-based:** 変動幅で優先度をつけ、高優先度のみ即時通知、低優先度は朝のまとめに含める。

### Anti-Pattern 4: No API Versioning from Day 1

**What people do:** APIエンドポイントを `/api/markets` のような形で作り、後から仕様変更が必要になった時に既存ユーザーを壊す。

**Why it's wrong:**
- Discord Botや外部連携が既存APIに依存していると、変更時にダウンタイムが発生。
- フリーミアムモデルで有料ユーザーがいる場合、APIの破壊的変更はサービスレベル違反。

**Do this instead:**
- 最初から `/api/v1/markets` のような形でバージョニング。
- 新機能・仕様変更は `/api/v2/` として追加。
- v1は最低6ヶ月〜1年間は非推奨（deprecated）として維持し、移行期間を設ける。
- OpenAPI (Swagger) でAPIドキュメントを自動生成し、変更履歴を明示。

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Polymarket CLOB API** | RESTful polling + axios-retry | Rate limit: 未公開（推奨: 60秒間隔）。API Keyは不要だが、IP制限の可能性あり。エラー時は exponential backoff でリトライ。 |
| **OpenAI API** | Queue-based async processing | Rate limit: Tier依存（新規: 3 RPM）。Bull queueでジョブ管理。`gpt-4o-mini` でコスト削減（$0.15/1M tokens）。 |
| **News API** | Scheduled fetch + keyword matching | 無料プランは100 requests/day。朝のまとめ生成時に一括取得。キーワード: 市場のトピックから抽出。 |
| **Discord Webhook** | Direct POST with rate limiting | Rate limit: 30/min per webhook。Client-side rate limiter で送信間隔を制御。Embed形式で視認性向上。 |
| **Stripe (決済)** | Webhook + subscription management | フリーミアム管理。Webhook署名検証必須。Subscription statusをDBと同期。 |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Web ↔ API** | REST API (HTTPS) | Next.js Server ActionsまたはfetchでAPI呼び出し。JWT認証。CORS設定。 |
| **Discord Bot ↔ API** | REST API (internal network) | BotはユーザーアクションをAPI経由でDB操作。認証はBot専用API Key。 |
| **Workers ↔ Services** | Direct import (monorepo) | `packages/core` を共有。Workers内で `MarketService.fetchActiveMarkets()` などを直接呼び出し。 |
| **Services ↔ Queue** | Bull (Redis-backed) | 非同期処理が必要な箇所でキューを介する。リトライ・失敗ハンドリングはBull側で管理。 |
| **API ↔ Database** | Prisma ORM | Type-safe query。Connection pooling有効化。Read replicaは環境変数で切り替え。 |

## Build Order & Dependencies

### Phase 1 推奨順序: Core Infrastructure
1. **Database setup** (Prisma schema定義・マイグレーション)
2. **Market Service** (Polymarket API連携・データ取得)
3. **Polymarket Poller Worker** (定期データ取得)
4. **API Gateway** (基本的なREST endpoint・認証なしでOK)

**理由:** データ取得とストレージが全ての機能の基盤。まずデータが流れる状態を作る。

### Phase 2 推奨順序: Analytics & Alerts
1. **Analytics Service** (変動検知・クジラ検出ロジック)
2. **Notification Service** (Discord webhook送信)
3. **Alert Dispatcher Worker** (キューからアラート処理)

**理由:** データが流れている状態で、分析と通知機能を追加。Discord Botの前にWebhookで通知テスト。

### Phase 3 推奨順序: User-Facing Features
1. **Web Dashboard** (市場一覧表示・詳細ページ)
2. **Discord Bot** (基本コマンド・購読管理)
3. **AI Analysis Service** (要約生成・手動編集フロー)

**理由:** UIとBot並行開発可能だが、AI機能は最後（コスト管理のため最初はマニュアル運用でもOK）。

### Phase 4 推奨順序: Freemium & Optimization
1. **Authentication & Authorization** (JWT・Stripe連携)
2. **Rate Limiting** (tier別制限)
3. **Caching Layer** (Redis multi-tier cache)

**理由:** 基本機能が動いている状態で、収益化とパフォーマンス最適化を追加。

**Critical Path Dependencies:**
- Web Dashboard → API Gateway → Market Service → Database
- Discord Bot → Notification Service → Alert Dispatcher → Analytics Service → Market Service
- AI Analysis → News API integration → Market Service

## Database Schema Considerations

### Core Tables

```sql
-- Markets table
CREATE TABLE markets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  end_date TIMESTAMP,
  current_price DECIMAL(10, 6),
  volume_24h DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Market snapshots (time-series data)
CREATE TABLE market_snapshots (
  id SERIAL PRIMARY KEY,
  market_id TEXT REFERENCES markets(id),
  price DECIMAL(10, 6),
  volume DECIMAL(15, 2),
  timestamp TIMESTAMP NOT NULL,
  INDEX idx_market_time (market_id, timestamp DESC)
);

-- AI summaries
CREATE TABLE market_summaries (
  id SERIAL PRIMARY KEY,
  market_id TEXT REFERENCES markets(id),
  content TEXT NOT NULL,
  status TEXT CHECK (status IN ('draft', 'approved', 'published')),
  generated_at TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by INTEGER REFERENCES users(id)
);

-- Users & subscriptions
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  discord_id TEXT UNIQUE,
  email TEXT UNIQUE,
  subscription_tier TEXT DEFAULT 'free', -- 'free' | 'premium'
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Alert subscriptions
CREATE TABLE alert_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  market_id TEXT REFERENCES markets(id),
  alert_type TEXT, -- 'price_change' | 'whale' | 'volume'
  threshold DECIMAL(10, 2),
  UNIQUE (user_id, market_id, alert_type)
);

-- Whale alerts
CREATE TABLE whale_alerts (
  id SERIAL PRIMARY KEY,
  market_id TEXT REFERENCES markets(id),
  trade_amount DECIMAL(15, 2),
  user_address TEXT,
  detected_at TIMESTAMP DEFAULT NOW()
);
```

**TimescaleDB extension (オプション、v1では不要):**
```sql
-- Convert market_snapshots to hypertable for time-series optimization
SELECT create_hypertable('market_snapshots', 'timestamp');

-- Continuous aggregate for hourly price summary
CREATE MATERIALIZED VIEW market_hourly_summary
WITH (timescaledb.continuous) AS
SELECT
  market_id,
  time_bucket('1 hour', timestamp) AS hour,
  AVG(price) as avg_price,
  MAX(price) as high,
  MIN(price) as low,
  SUM(volume) as total_volume
FROM market_snapshots
GROUP BY market_id, hour;
```

## Confidence Assessment

| Area | Confidence | Rationale |
|------|------------|-----------|
| **Component structure** | HIGH | 分散システム・リアルタイムデータ処理・市場データプラットフォームの一般的なパターンに基づく |
| **Polymarket API integration** | MEDIUM | CLOB API仕様を直接確認していないため、polling間隔・rate limitは推測 |
| **Discord Bot patterns** | HIGH | discord.js v14の公式パターンとベストプラクティスに準拠 |
| **AI integration** | HIGH | OpenAI/Claude APIのqueue-based処理は実績あるパターン |
| **Scaling strategy** | MEDIUM | 予測市場プラットフォーム特有のスケール課題は推測。一般的なデータプラットフォームのパターンを適用 |
| **Database design** | HIGH | 時系列データ・市場データのDB設計は確立されたパターン |

## Sources

- **General architecture patterns:** 分散システム設計、マイクロサービスアーキテクチャ、イベント駆動アーキテクチャの標準的なベストプラクティス
- **Discord Bot architecture:** discord.js公式ドキュメント (https://discord.js.org)
- **Time-series data:** TimescaleDB公式ドキュメント、市場データ処理の一般的なパターン
- **Queue patterns:** Bull公式ドキュメント (https://github.com/OptimalBits/bull)
- **LLM integration:** OpenAI公式ドキュメント、非同期AI処理のベストプラクティス

## Next Steps for Validation

1. **Polymarket CLOB API仕様確認:** 公式ドキュメントでrate limit・WebSocket有無・認証要件を確認
2. **Discord API制限検証:** Webhook rate limitの実測、Embed表示の日本語対応確認
3. **TimescaleDB必要性評価:** v1のデータ量予測に基づき、通常のPostgreSQLで十分か判断
4. **News API選定:** 日本語ニュース対応、予測市場関連キーワードでのヒット率を検証

---
*Architecture research for: 予測市場インテリジェンスプラットフォーム (Oddscope)*
*Researched: 2026-03-20*
*Confidence: MEDIUM (Polymarket固有パターンは要検証)*
