# Project Research Summary

**Project:** Oddscope (予測市場インテリジェンスプラットフォーム)
**Domain:** 予測市場データアグリゲーション・分析プラットフォーム
**Researched:** 2026-03-20
**Confidence:** MEDIUM-HIGH

## Executive Summary

Oddscopeは、英語の予測市場データ(Polymarket)を日本語で提供し、急変通知・クジラ検知・AI要約機能で差別化する情報プラットフォームです。Next.js 16.2 + Neon PostgreSQL + Discord Bot + LLM統合という2025年の標準スタックで構築可能で、技術的リスクは低めです。

推奨アプローチは、**データ取得基盤を最初に固める段階的構築**です。Phase 1でPolymarket API統合と基本データ表示を確立し、Phase 2で差別化機能(急変検知・Discord通知・AI要約)を追加、Phase 3でフリーミアムモデルと収益化を実装する順序が依存関係と価値提供の観点から最適です。

主要リスクは3つ: (1)WebSocket接続の静的崩壊による通知遅延、(2)LLMコストの爆発的増加、(3)クジラ検知の誤検知による通知過多。これらは各Phase開始時に防止策を組み込むことで回避可能です。日本語特化という差別化軸は競合不在のブルーオーシャンですが、翻訳品質(特にドメイン用語)の維持が継続的な課題となります。

## Key Findings

### Recommended Stack

Next.js 16.2をコアとしたフルスタック構成が最適です。App Router + React Server Components + TypeScriptでフロントエンドとバックエンドを統合し、Neon PostgreSQLでデータを管理、Upstash Redisでキャッシングとジョブキューを実現します。

**Core technologies:**
- **Next.js 16.2 (App Router):** フルスタックフレームワーク — React 19対応、Vercel統合、日本語サポート完備
- **Neon PostgreSQL:** サーバーレスDB — 自動スケーリング、ブランチング機能、Vercelとシームレス統合
- **@polymarket/clob-client v5.8.0:** Polymarket API統合 — 公式TypeScriptクライアント、viem対応、市場データ・オーダーブック取得
- **discord.js v14.25.1:** Discord Bot — 安定した本番環境対応、サウンドボード・サブスクリプション機能
- **OpenAI GPT-4o-mini / Claude Sonnet 4.6:** LLM要約 — コスト最適化(GPT-4o-mini)または日本語精度重視(Claude)
- **tRPC 11.0+ + Zod:** 型安全API層 — エンドツーエンド型安全性、REST/GraphQL不要
- **Upstash Redis:** キャッシング・ジョブキュー — サーバーレス対応、低レイテンシ、レート制限管理

**代替案の検討済み:** Remix(Next.jsが優位)、Supabase(Neonがシンプル)、Drizzle ORM(Prismaが成熟)、REST API(tRPCが型安全)。T3 Stackボイラープレートの利用を推奨。

### Expected Features

**Must have (table stakes) — v1 MVP:**
- **市場一覧表示** — 予測市場ダッシュボードの基本、Polymarket API経由でデータ取得
- **カテゴリ別フィルタリング・ソート** — 数百市場から情報を見つけるために必須(人気順・出来高順・終了間近)
- **確率・出来高表示** — 予測市場の基本情報、現在価格=予測確率
- **日本語翻訳(基本)** — Core Value実現の鍵、市場名・説明をLLM翻訳(ドメイン辞書併用)
- **急変検知** — シンプルな閾値ベース(1時間で±15%)、差別化機能の入り口
- **Discord通知(急変のみ)** — 通知機能の価値実証、クジラ検知は後回し
- **レスポンシブUI** — デスクトップ優先だがモバイルでも閲覧可能なレイアウト

**Should have (competitive) — v1.x 段階的追加:**
- **AI要約「なぜ動いたか」** — LLM + ニュースAPI連携、手動編集フロー付き(コスト管理必須)
- **クジラ検知** — 大口取引・異常出来高検知、プレミアム機能候補(誤検知対策が課題)
- **価格履歴グラフ** — 時系列変化の可視化、Chart.js等で実装
- **テーマ別グルーピング** — 関連市場を束ねて表示、手動タグ付け→自動相関検出へ拡張
- **朝のまとめダッシュボード** — 前日の主要な動きをサマリ表示、日次バッチ処理
- **フリーミアムモデル実装** — 無料(遅延データ)・有料(リアルタイム通知・AI分析・クジラ検知)

**Defer (v2+) — PMF確立後:**
- **マルチソース統合(Kalshi, Manifold等)** — v1でPolymarket深耕後に拡張
- **モバイルネイティブアプリ** — PWA/レスポンシブWebで検証後
- **高度な異常検知(機械学習)** — v1はルールベースで十分
- **ユーザー間コミュニティ機能** — モデレーション負荷高く、v1ではAnti-feature

**Anti-features(避けるべき):**
- 自動売買・取引機能(コンプライアンス複雑化、情報提供に集中すべき)
- 完全リアルタイム更新(WebSocket維持コスト高、1-5分更新で十分)
- 全市場の全データ永久保存(ストレージコスト、30-90日で十分)
- モバイルアプリ(v1)(開発コスト2倍、レスポンシブWebで先行検証)

### Architecture Approach

**Monorepo(Turborepo/pnpm workspaces) + サービス層分離**のアーキテクチャを推奨します。Web Dashboard、Discord Bot、API、Workersを独立デプロイ可能にしつつ、`packages/core`でビジネスロジックを共有します。

**Major components:**
1. **Data Ingestion Layer** — Polymarket Poller(60秒間隔)でAPI polling、State Comparisonで差分検知、WebSocket接続(フォールバック用)
2. **Application Layer** — Market Service(データ取得・正規化・キャッシュ)、Analytics Service(変動検知・クジラ検出)、AI Service(LLM要約・ニュース分析)、Notification Service(Discord送信・購読管理)
3. **Presentation Layer** — Web Dashboard(Next.js App Router + SWR)、Discord Bot(discord.js + Commandパターン)
4. **Storage Layer** — PostgreSQL(構造化データ: markets, users, alerts)、Redis(L2キャッシュ・ジョブキュー)、TimescaleDB拡張(オプション、時系列データ最適化)

**重要なパターン:**
- **Polling with State Comparison:** WebSocket不安定性への対応、前回取得との差分で急変検知
- **Queue-Based AI Processing:** LLM呼び出しを非同期化、Bull queueでリトライ・コスト管理
- **Multi-Tier Caching:** L1(Memory 30秒) → L2(Redis 5分) → L3(PostgreSQL)で段階的キャッシュ
- **Webhook + Command Pattern:** Discord Interaction処理の拡張性確保

**Project Structure:** apps/(web, discord-bot, api) + packages/(core, db, config, types) + workers/(poller, analytics, summary, alert)

### Critical Pitfalls

研究で特定された致命的な落とし穴トップ5:

1. **WebSocket接続の静的崩壊** — 表面的にはOPENだが20-30分後にデータストリーム停止。独自のハートビート層実装(30秒ping/pong)、メッセージ頻度監視、エクスポネンシャルバックオフ再接続、HTTP polling フォールバックで回避。Phase 1で必須実装。

2. **LLMコスト爆発(未キャッシュ処理)** — 同じ市場データを数百回送信し月間コスト10-50倍増。Prompt Cachingで市場メタデータをキャッシュ(90%コスト削減)、要約生成を「有意な変動」のみに限定(5%以上の価格変動)、コスト上限アラート($10/日)で回避。Phase 2で必須実装。

3. **Discord Rate Limit突破** — 市場急変時に通知集中、rate limit抵触で最大10分間配信停止。優先度付きキュー、バッチング(同テーマを統合)、`X-RateLimit-Remaining`チェック、通知間隔の動的調整で回避。Phase 2で実装。

4. **クジラ検知の誤検知地獄** — 絶対額閾値のみ判定で小規模市場の通常取引を「異常」扱い、通知ミュート多発。市場流動性比率ベース検知(取引額が総流動性の5%以上)、カテゴリ別閾値、時系列異常検知(過去7日平均の3σ以上)で回避。Phase 2で実装。

5. **日本語翻訳の文脈喪失** — 「Will Trump win Pennsylvania?」を直訳し予測市場文脈が伝わらない。ドメイン特化翻訳辞書(win [state]→制する、YES/NO→実現/不実現、resolve→決済)、翻訳プロンプトに市場文脈注入、頻出タイプのテンプレート化、人間レビューフィードバックループで回避。Phase 1で辞書実装、Phase 2-3でフィードバック反映。

**その他の重要な落とし穴:**
- Polymarket CLOB API認証遅延トラップ(キー作成後2-3分warm-up期間設定)
- 「なぜ動いたか」分析のニュース不在問題(多層ニュースソース、情報不足時は正直に表示)
- フリーミアム境界線の曖昧さ(価値ベースの境界設定、無料ユーザーへのプレミアム体験「チラ見せ」)

## Implications for Roadmap

研究結果に基づき、**4フェーズ構造**を推奨します。データ基盤→差別化機能→収益化→最適化の順序が、依存関係・価値提供・リスク管理の観点から最適です。

### Phase 1: データ基盤・基本UI構築

**Rationale:** 全ての機能はPolymarketデータ取得が前提。まずデータが流れる状態を作り、日本語で表示する基本UIを確立。WebSocket接続断の問題をこの段階で解決しないと、後続フェーズの信頼性が致命的に低下。

**Delivers:**
- Polymarket API統合(CLOB client + Poller Worker)
- 市場一覧表示(カテゴリ別フィルタリング・ソート)
- 日本語翻訳(基本版、ドメイン辞書実装)
- 基本データベーススキーマ(Prisma)
- Web Dashboard基盤(Next.js App Router)

**Addresses (from FEATURES.md):**
- 市場一覧表示(P1)
- カテゴリ別フィルタリング(P1)
- ソート機能(P1)
- 確率・出来高表示(P1)
- 日本語翻訳(基本)(P1)
- レスポンシブUI(P1)

**Avoids (from PITFALLS.md):**
- WebSocket接続の静的崩壊(ハートビート層・再接続ロジック実装)
- Polymarket CLOB API認証遅延トラップ(warm-up期間・リトライ実装)
- 日本語翻訳の文脈喪失(ドメイン辞書初期実装)

**Uses (from STACK.md):**
- Next.js 16.2 + TypeScript + Tailwind CSS
- Neon PostgreSQL + Prisma ORM
- @polymarket/clob-client v5.8.0
- OpenAI GPT-4o-mini or Claude Sonnet 4.6(翻訳用)
- Upstash Redis(キャッシング)

**Research flag:** 🟢 Standard patterns — Polymarket API統合は公式ドキュメントあり、Next.js + Prismaは確立済みパターン。WebSocket再接続ロジックのみ要注意実装。

---

### Phase 2: 差別化機能(急変検知・通知・AI分析)

**Rationale:** データ基盤ができた状態で、競合と差別化する価値提供機能を追加。急変検知→Discord通知→AI要約の順序は依存関係と価値実証の観点から最適。クジラ検知は誤検知対策が複雑なため後半に配置。

**Delivers:**
- Analytics Service(急変検知・クジラ検出ロジック)
- Discord Bot(基本コマンド・購読管理)
- Notification Service(Discord webhook送信)
- Alert Dispatcher Worker(優先度付きキュー)
- AI Analysis Service(LLM要約生成・手動編集フロー)
- News API統合(ニュース取得・関連性判定)

**Addresses (from FEATURES.md):**
- 急変検知(P1)
- Discord通知(急変)(P1)
- AI要約「なぜ動いたか」(P2)
- クジラ検知(P2)

**Avoids (from PITFALLS.md):**
- LLMコスト爆発(Prompt Caching実装、コスト上限アラート)
- Discord Rate Limit突破(優先度付きキュー・バッチング)
- クジラ検知の誤検知地獄(流動性比率ベース検知・カテゴリ別閾値)
- 「なぜ動いたか」分析のニュース不在問題(多層ニュースソース)

**Implements (from ARCHITECTURE.md):**
- Polling with State Comparison(Analytics Service)
- Queue-Based AI Processing(Bull queue + LLM API)
- Webhook + Command Pattern(Discord Bot)

**Research flag:** 🟡 Moderate research needed — Discord Bot rate limit対策とLLMコスト最適化(Prompt Caching)は実装パターン確立済みだが、予測市場特有の急変検知閾値チューニングは実験的要素あり。Phase開始時に1-2日の閾値調整期間を設定推奨。

---

### Phase 3: フリーミアムモデル・収益化

**Rationale:** 基本機能が動作し、価値が実証された状態で収益化を追加。無料と有料の境界を明確にし、認証・レート制限・決済統合を実装。パフォーマンス最適化(Multi-Tier Caching)も併せて実装し、有料ユーザー向けの安定性を確保。

**Delivers:**
- Authentication & Authorization(Auth.js + JWT)
- Subscription管理(Stripe統合)
- Rate Limiting(tier別制限、freemium制御)
- Multi-Tier Caching(L1: Memory → L2: Redis → L3: PostgreSQL)
- ユーザー設定(通知カスタマイズ)
- 価格履歴グラフ(時系列データ可視化)

**Addresses (from FEATURES.md):**
- フリーミアム実装(P2)
- ユーザー設定(P2)
- 価格履歴グラフ(P2)

**Avoids (from PITFALLS.md):**
- フリーミアム境界線の曖昧さ(価値ベースの境界設定、プレミアム体験「チラ見せ」)
- 市場データキャッシュなし(Multi-Tier Caching実装)

**Uses (from STACK.md):**
- Auth.js(NextAuth.js後継)
- Stripe(決済、Webhook署名検証)
- Upstash Redis(レート制限・キャッシング)
- Chart.js or Recharts(価格履歴グラフ)

**Research flag:** 🟢 Standard patterns — Auth.js + Stripe統合は確立済みパターン。フリーミアム境界の設計はビジネス判断だが、技術実装は標準的。

---

### Phase 4: 運用最適化・拡張機能

**Rationale:** PMF確認後、運用品質向上とユーザー体験拡張。テーマ別グルーピング(自動相関検出)、朝のまとめダッシュボード、検索機能など、Phase 1-3で「あれば便利」と後回しにした機能を追加。エラー監視(Sentry)とスケーリング対策も実装。

**Delivers:**
- テーマ別グルーピング(手動タグ付け + 自動相関検出)
- 朝のまとめダッシュボード(日次バッチ処理・サマリ生成)
- 検索機能(Algolia or Elasticsearchで全文検索)
- Sentry統合(エラー監視・パフォーマンストレース)
- TimescaleDB拡張(オプション、時系列データ最適化)
- 市場詳細ページ拡張版

**Addresses (from FEATURES.md):**
- テーマ別グルーピング(P2)
- 朝のまとめダッシュボード(P2)
- 検索機能(P2)
- 市場詳細ページ(拡張)(P2)

**Implements (from ARCHITECTURE.md):**
- Scheduled Jobs(Vercel Cron Jobs)
- 全文検索インデックス
- TimescaleDB hypertable(オプション)

**Research flag:** 🟡 Moderate research needed — 自動相関検出(市場説明の類似度、価格相関分析)は実験的。全文検索統合は標準パターン。Phase開始時に相関検出アルゴリズムの検証期間(2-3日)推奨。

---

### Phase Ordering Rationale

**依存関係に基づく順序:**
- Phase 2(差別化機能)は Phase 1(データ基盤)に依存 — データが流れないと分析・通知不可能
- Phase 3(収益化)は Phase 2(価値提供)後 — 価値実証なしで課金は困難
- Phase 4(最適化)は Phase 1-3完了後 — 基本機能が動作している前提

**価値提供の観点:**
- Phase 1で「日本語で予測市場を見られる」最小価値提供
- Phase 2で「急変を逃さない」差別化価値提供
- Phase 3で「継続的な収益」を実現
- Phase 4で「使いやすさ」を向上

**リスク管理の観点:**
- Phase 1で技術的な致命的リスク(WebSocket接続断)を解決
- Phase 2で運用的なリスク(LLMコスト・Discord rate limit)を解決
- Phase 3でビジネスリスク(収益化の曖昧さ)を解決
- Phase 4でスケーラビリティリスクに対処

**Critical Path:**
- Web Dashboard → API Gateway → Market Service → Database (Phase 1)
- Discord Bot → Notification Service → Alert Dispatcher → Analytics Service → Market Service (Phase 2)
- AI Analysis → News API integration → Market Service (Phase 2)

### Research Flags Summary

| Phase | Research Needs | Confidence | Notes |
|-------|----------------|------------|-------|
| **Phase 1** | 🟢 Low | HIGH | Next.js + Prisma + Polymarket API統合は確立済みパターン。WebSocket再接続ロジックのみ要注意。 |
| **Phase 2** | 🟡 Moderate | MEDIUM | Discord rate limit対策・LLM Prompt Cachingは確立済み。急変検知閾値チューニングは実験的(1-2日調整期間推奨)。 |
| **Phase 3** | 🟢 Low | HIGH | Auth.js + Stripe統合は標準パターン。フリーミアム境界はビジネス判断、技術実装は標準的。 |
| **Phase 4** | 🟡 Moderate | MEDIUM | 全文検索統合は標準。自動相関検出は実験的(2-3日検証期間推奨)。TimescaleDBはオプション、Phase 1-3でPostgreSQLのみで十分。 |

**Skip research-phase for:**
- Phase 1のNext.js + Prisma基本セットアップ
- Phase 3のAuth.js + Stripe統合

**Needs research-phase for:**
- Phase 2の急変検知閾値チューニング(市場タイプ別の最適値実験)
- Phase 4の自動相関検出アルゴリズム(類似度計算・相関係数の閾値検証)

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| **Stack** | HIGH | Next.js 16.2、Neon PostgreSQL、discord.js、@polymarket/clob-clientは全て公式ドキュメント確認済み。T3 Stackボイラープレート利用でさらに安定性向上。 |
| **Features** | MEDIUM | Polymarket公式サイトでUI確認、競合(Manifold, Kalshi)の一部は詳細未確認(アクセス制限)。日本語特化の差別化はトレーニングデータベース(既存製品不在の推測)。 |
| **Architecture** | MEDIUM | 分散システム・リアルタイムデータ処理の一般的なパターンは確立。Polymarket固有のWebSocket挙動・API rate limit詳細は推測(公式ドキュメントに詳細記載薄い)。 |
| **Pitfalls** | MEDIUM-HIGH | Polymarket py-clob-client GitHub Issues(82 open, Issue #311/#327など)で実ユーザー報告確認。WebSocket接続断(Issue #14)はreal-time-data-clientで報告あり。Discord rate limitは公式ドキュメント確認済み。 |

**Overall confidence:** MEDIUM-HIGH

研究は公式ドキュメント・GitHub Issues・コミュニティ情報を組み合わせて実施。技術スタック選定は高信頼度、Polymarket固有の挙動(WebSocket安定性・API rate limit詳細)は中程度の推測を含む。Phase 1開始時に実際のAPI挙動を検証し、調整推奨。

### Gaps to Address

以下の領域は研究で結論が出ず、実装中の検証が必要:

- **Polymarket WebSocket接続の実際の安定性:** Issue #14で報告されているが、最新版での改善状況不明。Phase 1開始時に1時間以上の連続動作テストを実施し、再接続ロジックの必要性を確認。最悪ケースとしてHTTP pollingのみでも機能設計(WebSocketはオプション化)。

- **Polymarket CLOB API rate limit詳細:** 公式ドキュメントに「Rate Limits」ページ存在するが、具体的な数値(requests per minute等)が明記されていない。Phase 1で実測し、polling間隔を調整。推奨初期値: 60秒間隔、エラー頻度に応じて30秒〜5分に動的調整。

- **日本語翻訳品質(ドメイン用語):** 初期辞書は研究で作成したが、網羅性は不明。Phase 1で主要カテゴリ(政治・スポーツ・暗号資産)各10市場の翻訳レビューを実施。Phase 2以降でユーザーフィードバックループを構築し、継続的改善。

- **急変検知閾値の最適値:** 研究では「1時間で±15%」を推奨したが、市場タイプ別(政治・スポーツ・暗号資産等)で最適値は異なる可能性。Phase 2開始時に1週間の実データでチューニング実験。誤検知率20%以下、見逃し率10%以下を目標。

- **LLMコスト実績:** Prompt Cachingで90%削減は理論値(Claude公式)。実際のキャッシュヒット率は市場データの更新頻度・ユーザー行動に依存。Phase 2でコスト監視ダッシュボード構築、日次$10上限アラート設定、週次でコスト効率レビュー。

- **News API日本語対応・予測市場関連ヒット率:** 研究ではNews API等の利用を推奨したが、日本語ニュース対応・予測市場トピックでのヒット率は未検証。Phase 2開始時に複数ニュースソース(Reuters, Bloomberg, X API等)の比較検証。「分析不能」率20%以下を目標。

## Sources

### Primary (HIGH confidence)

**公式ドキュメント・リリース:**
- Next.js 16.2.0: https://github.com/vercel/next.js/releases
- Neon PostgreSQL: https://neon.com/docs/introduction
- Prisma ORM: https://www.prisma.io/docs
- @polymarket/clob-client v5.8.0: https://github.com/Polymarket/clob-client/releases
- discord.js v14.25.1: https://github.com/discordjs/discord.js/releases
- Tailwind CSS v4.2: https://tailwindcss.com
- tRPC: https://trpc.io
- Zod: https://zod.dev
- OpenAI Node.js SDK: https://github.com/openai/openai-node
- Claude API: https://platform.claude.com/docs/claude/docs/intro-to-claude
- Discord Rate Limits: https://docs.discord.com/developers/topics/rate-limits
- Sentry Next.js: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Vercel Cron Jobs: https://vercel.com/docs/cron-jobs

**実ユーザー報告(GitHub Issues):**
- Polymarket py-clob-client Issues: Issue #311(認証遅延)、#327(ログ漏洩)、#310(注文失敗) — https://github.com/Polymarket/py-clob-client/issues
- Polymarket real-time-data-client Issue #14(WebSocket接続断) — https://github.com/Polymarket/real-time-data-client/issues

### Secondary (MEDIUM confidence)

**コミュニティ推奨・ベストプラクティス:**
- T3 Stack: https://github.com/t3-oss/create-t3-app
- SWR: https://swr.vercel.app
- React Hook Form: https://react-hook-form.com
- shadcn/ui: https://www.shadcn.com
- Upstash Redis: https://upstash.com/docs/redis
- date-fns: https://date-fns.org
- nanoid: https://github.com/ai/nanoid
- Auth.js: https://authjs.dev
- Stripe Subscription Best Practices: https://stripe.com/docs/billing/subscriptions

**競合サービス分析:**
- Polymarket公式サイト: https://polymarket.com — UIパターン・ソート機能確認
- Manifold Markets: https://manifold.markets — 競合分析(一部アクセス制限)
- Augur: https://augur.net — 競合分析(限定的情報)

### Tertiary (LOW confidence)

**トレーニングデータ・推測:**
- Kalshi, PredictIt等の予測市場プラットフォーム機能パターン(アクセス制限で詳細未確認)
- Dune Analytics等のPolymarketダッシュボード存在の推測(403エラーで未確認)
- 日本語特化予測市場プラットフォームの不在(検索・調査で発見できず)

**検証できなかった情報:**
- Reddit/Twitter等のユーザーフィードバック(アクセス制限・レート制限)
- 第三者製Polymarket分析ツール(GitHub検索で発見できず)

---

*Research completed: 2026-03-20*
*Ready for roadmap: yes*
