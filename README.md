# Oddscope

日本語の予測市場インテリジェンスプラットフォーム。Polymarket の海外予測市場データを日本語で整理・表示し、テーマ分類・急変検知を提供する。

## 主要機能

- **日本語市場一覧** — Polymarket 市場を日本語タイトル・文脈補足付きで表示
- **テーマ分類** — 米政治・暗号資産・AI・地政学・マクロ経済など 8 テーマに自動分類
- **フィルタ・ソート** — テーマ・出来高・変動率でフィルタリング、URL パラメータで状態保持
- **急変検知** — 24h 変動 5%以上の市場をハイライト
- **自動データ同期** — 5 分間隔で市場データ取得、1 時間間隔で価格スナップショット保存

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16.2 (App Router) |
| 言語 | TypeScript |
| DB | PostgreSQL (Neon) + Prisma 7.5 |
| UI | Tailwind CSS 4.2 + shadcn/ui |
| LLM 翻訳 | OpenAI gpt-4o-mini |
| データソース | Polymarket CLOB API |
| テスト | Vitest + React Testing Library |
| デプロイ | Vercel |

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env` を編集して以下を設定:

| 変数 | 取得元 |
|------|--------|
| `DATABASE_URL` | [Neon Console](https://console.neon.tech) → Project → Connection Details |
| `POLYMARKET_API_KEY` | [Polymarket CLOB API](https://docs.polymarket.com) |
| `OPENAI_API_KEY` | [OpenAI Dashboard](https://platform.openai.com/api-keys) → API Keys |
| `CRON_SECRET` | 任意の文字列（Cron Job 認証用） |

### 3. データベースのセットアップ

```bash
npx prisma generate
npx prisma db push
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でダッシュボードが表示されます。

## 開発コマンド

```bash
npm run dev       # 開発サーバー起動
npm run build     # プロダクションビルド
npm run test      # テスト実行
npm run lint      # Lint 実行
```

## プロジェクト構成

```
app/
  (dashboard)/     # ダッシュボード（市場一覧）
  api/cron/        # Cron Job エンドポイント
    sync-markets/  #   市場データ同期（5分間隔）
    snapshot-prices/ # 価格スナップショット（1時間間隔）
components/        # UI コンポーネント
lib/
  db.ts            # Prisma クライアント
  types.ts         # 共通型定義
  polymarket.ts    # Polymarket API クライアント
  translation.ts   # LLM 翻訳エンジン
  theme-mapping.ts # テーマ分類
  queries.ts       # DB クエリ関数
prisma/
  schema.prisma    # DB スキーマ（Market, PriceSnapshot, SyncLog）
```

## ライセンス

Private
