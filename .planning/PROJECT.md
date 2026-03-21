# Oddscope

## What This Is

日本語の予測市場データインフラ。Polymarket + Kalshi のデータをリアルタイムで正規化・統合し、日本語UIで提供する。Oddpoolの日本語版を目指す。

## Core Value

複数の予測市場を横断して「今何が起きているか」を日本語で瞬時に把握できるデータプラットフォーム。

## Architecture

- DBレス: API プロキシ + キャッシュのみ（Prisma/Neon不要）
- AI不要: カテゴリは静的マッピング、タイトルは英語のまま
- コスト: Vercel無料枠で運用
- データソース: Polymarket Gamma API + Kalshi Trade API
- キャッシュ: Next.js ISR / unstable_cache（1-5分）

## Requirements

### Validated

(None yet -- ship to validate)

### Active (MVP)

- [ ] 統合トレンドダッシュボード -- 両市場のホットな市場をカード表示（volume/変動率ソート）
- [ ] カテゴリ別ビュー -- 政治、暗号資産、経済、スポーツ、AI/テクノロジーなど
- [ ] カテゴリ名の日本語マッピング（静的）
- [ ] クロスベニュー比較 -- 同じイベントの Polymarket vs Kalshi 価格を並べる
- [ ] レスポンシブUI（カード形式）

### Next (v1.1)

- [ ] アービトラージスキャナー -- 市場間価格差の自動検出
- [ ] クジラ/出来高急増検出
- [ ] 市場詳細ページ（価格チャート、オーダーブック）
- [ ] APIエンドポイント提供（外部向け）
- [ ] Discord通知（急変・クジラ・アラート）

### Future

- [ ] AI翻訳（新規市場タイトルの日本語意訳、バッチ1日1回）
- [ ] 「なぜ動いたか」AI要約（有料プラン機能）
- [ ] 朝のまとめダッシュボード
- [ ] フリーミアムモデル（無料: 一覧+遅延 / 有料: 通知+分析+リアルタイム+API）

### Out of Scope

- DB運用（コスト回避）
- モバイルアプリ -- Web優先
- 自動売買・取引機能 -- 情報提供に特化
- ユーザー間コミュニティ機能

## Context

- Polymarket Gamma API: 認証不要、market一覧・volume・price取得可能
- Kalshi Trade API: 認証不要（読み取り）、market一覧・price・volume取得可能
- 日本語の予測市場データインフラは現状ほぼ存在しない
- ターゲット: 予測市場トレーダー、マクロ/クオンツ、情報収集層

## Constraints

- コスト最小化: DB無し、AI無し、Vercel無料枠
- データソース: v1は Polymarket + Kalshi の2ベニュー
- キャッシュ戦略でAPI制限を回避

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| DBレス | コスト回避、APIプロキシで十分 | Adopted |
| AIなし（MVP） | コスト回避、カテゴリは静的マッピングで対応 | Adopted |
| Polymarket + Kalshi 同時対応 | クロスベニュー比較が差別化要素 | Adopted |
| Oddpool的データインフラ路線 | 単なる翻訳レイヤーではなく情報基盤 | Adopted |

---
*Last updated: 2026-03-20 after pivot*
