# Feature Research

**Domain:** 予測市場インテリジェンス・アグリゲーションプラットフォーム
**Researched:** 2026-03-20
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| 市場一覧表示 | 予測市場ダッシュボードの基本機能。Polymarket、Manifold、Kalshiなど全ての競合が提供 | LOW | API経由で市場データ取得、リスト表示。ページネーション必要 |
| カテゴリ別フィルタリング | ユーザーは関心領域（政治、スポーツ、暗号資産など）で絞り込むことを期待 | LOW | Polymarket APIの`tags`パラメータで実装可能 |
| ソート機能 | 「人気順」「出来高順」「終了間近」など。情報過多への対処として必須 | LOW | API応答をクライアント側でソート、または複数APIクエリ |
| 確率表示 | 現在の市場価格＝予測確率。これなしでは「予測市場」として機能しない | LOW | Polymarket APIから`price`または`midpoint`を取得 |
| 出来高データ | 市場の流動性・信頼性判断に必須。全ての予測市場プラットフォームが表示 | LOW | API応答の`volume`または`liquidity`フィールド |
| 市場詳細ページ | 市場説明、終了日時、解決条件などの詳細情報 | MEDIUM | イベントメタデータ、複数API呼び出し、マークダウンレンダリング |
| 検索機能 | 特定トピック・キーワードで市場を検索。数百〜数千の市場から探すために必須 | MEDIUM | Polymarket APIの検索エンドポイント、または全件取得後のクライアント検索 |
| リアルタイムまたは定期更新 | 予測市場は動的。古いデータは価値が低い | MEDIUM | WebSocket接続（Polymarket Market Channel）またはポーリング |
| レスポンシブUI | トレーダーはモバイルでも情報確認する | MEDIUM | フロントエンド実装、v1はWeb優先だがモバイルレイアウト必要 |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| 日本語ローカライゼーション | **Core Value実現の鍵**。英語の予測市場を日本語で提供する既存サービスなし | HIGH | 市場名、説明、カテゴリの翻訳。LLM API（GPT-4、Claude）でコンテキスト付き翻訳。キャッシュで翻訳コスト削減 |
| テーマ別市場グルーピング | 関連市場を束ねて表示（例:「米大統領選」配下に州別市場）。文脈理解を容易に | MEDIUM | 手動タグ付け＋自動相関検出（市場説明の類似度、価格相関分析）。Phase 2以降 |
| 急変検知・ハイライト | 価格が急変動した市場を自動抽出。トレーダーがチャンスを逃さない | MEDIUM | 価格履歴比較（例: 1時間で10%以上変動）。WebSocketまたは頻繁なポーリング必要 |
| AI要約「なぜ動いたか」 | LLMで急変理由を下書き生成＋手動編集。単なるデータ表示を超えた洞察提供 | HIGH | ニュースAPI連携、LLMプロンプトエンジニアリング、編集UIと承認フロー。コスト管理が課題 |
| クジラ検知 | 大口取引・出来高急増を検知し通知。プロトレーダー向け高付加価値機能 | HIGH | 取引履歴分析、異常検知アルゴリズム、閾値チューニング。プレミアム機能候補 |
| Discord通知 | 急変・クジラ検知をDiscordに即時通知。トレーダーの日常ツールと統合 | MEDIUM | Discord Bot API、ユーザーごとのWebhook設定、通知頻度制御 |
| 朝のまとめダッシュボード | 前日の主要な動きをサマリ表示。毎朝のルーティンに組み込まれる | MEDIUM | 日次バッチ処理、重要市場の抽出ロジック、サマリ生成（手動または自動） |
| 価格履歴グラフ | 市場価格の時系列変化を可視化。トレンド把握に有用 | MEDIUM | Polymarket APIから履歴データ取得、Chart.js等でグラフ描画 |
| マルチソース対応（将来） | Polymarket以外（Kalshi、Manifoldなど）も統合。包括的な情報源として差別化 | VERY HIGH | v1対象外だが将来の競争優位性。各APIの仕様統一、データ正規化が必要 |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| 自動売買・取引機能 | 「データと取引を一体化したい」という要望 | ライセンス・コンプライアンス複雑化、セキュリティリスク、開発コスト大。情報提供に集中すべき | Polymarketへの外部リンク、API統合ガイドを提供。トレーダーは既に取引プラットフォームを持つ |
| ユーザー間コミュニティ機能 | 「SNS的な交流でエンゲージメント向上」 | モデレーション負荷、荒らし対策、法的リスク。v1では不要 | Discordコミュニティへ誘導。プラットフォーム外でコミュニティ形成 |
| 完全リアルタイム更新 | 「ミリ秒単位でデータ更新」の期待 | WebSocket維持コスト高、サーバー負荷大。大半のユーザーには1分更新で十分 | 急変通知のみリアルタイム、ダッシュボードは1-5分間隔ポーリング。プレミアムで更新頻度向上 |
| 全市場の全データ永久保存 | 「過去データ分析したい」というデータサイエンティスト要望 | ストレージコスト、クエリ性能劣化。v1のコアユーザー（トレーダー）には不要 | 直近30-90日のデータ保持。長期データはAPI提供元（Polymarket）に委譲 |
| モバイルアプリ（v1） | 「アプリの方が使いやすい」という一般論 | 開発・保守コスト2倍（iOS/Android）、リリース承認プロセス、Web先行で十分検証可能 | レスポンシブWebアプリ。PWA検討。アプリはPMF確認後 |
| 全言語対応 | 「グローバル展開」の野心 | 翻訳品質管理困難、サポート負荷、ニッチ市場で分散。v1は日本語特化がブルーオーシャン | 日本語単一言語。PMF後に他言語（韓国語、中国語など）段階拡大 |

## Feature Dependencies

```
[市場一覧表示] (基盤)
    └──requires──> [Polymarket API統合]
                       └──requires──> [データ正規化層]

[急変検知]
    └──requires──> [価格履歴データ]
                       └──requires──> [定期ポーリングまたはWebSocket]

[AI要約]
    └──requires──> [急変検知]
    └──requires──> [ニュースAPI統合]
    └──requires──> [LLM API統合]

[クジラ検知]
    └──requires──> [取引履歴データ]
    └──requires──> [異常検知ロジック]

[Discord通知]
    └──requires──> [急変検知] OR [クジラ検知]
    └──requires──> [ユーザー設定（通知設定）]

[テーマ別グルーピング]
    └──requires──> [市場メタデータ]
    └──enhances──> [市場一覧表示]

[日本語翻訳]
    └──requires──> [LLM API統合]
    └──enhances──> [全ての表示機能]

[朝のまとめダッシュボード]
    └──requires──> [急変検知]
    └──requires──> [バッチ処理基盤]
```

### Dependency Notes

- **急変検知 requires 価格履歴データ:** 現在価格だけでは「急変」を判定できない。少なくとも1-24時間の履歴が必要
- **AI要約 requires 急変検知:** 全市場を要約するとコスト大。急変市場に絞ることで実用的に
- **Discord通知 requires 急変/クジラ検知:** 通知機能単体では価値なし。通知する価値あるイベント検知が前提
- **日本語翻訳 enhances 全機能:** Core Valueの中核だが、翻訳なしでも英語のまま機能は動作可能。段階実装可
- **テーマ別グルーピング enhances 市場一覧:** UX改善だが必須ではない。v1後に追加可能

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [x] **市場一覧表示** — データがなければプラットフォーム不成立。優先度P1
- [x] **カテゴリ別フィルタリング** — 数百市場から情報を見つけるために必須。P1
- [x] **ソート機能** — 「人気順」「出来高順」最低2-3種類。P1
- [x] **確率・出来高表示** — 予測市場の基本情報。P1
- [x] **日本語翻訳（基本）** — Core Value実現の鍵。市場名・説明のみv1で翻訳。P1
- [x] **急変検知** — 差別化機能の入り口。シンプルな閾値ベース（例: 1時間で±15%）。P1
- [x] **Discord通知（急変のみ）** — 通知機能の価値実証。クジラ検知は後回し。P1
- [ ] **検索機能** — v1ではカテゴリフィルタで代用可能。あれば便利だがP2
- [ ] **レスポンシブUI** — デスクトップ優先だがモバイルでも閲覧可能なレイアウト。P1

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] **AI要約（手動編集付き）** — v1で急変通知が価値あると確認後に追加。ユーザーフィードバック次第
- [ ] **クジラ検知** — 取引履歴分析の複雑性からv1.1以降。プレミアム機能候補
- [ ] **価格履歴グラフ** — 視覚的価値高いが、v1はテキストベースで検証可能
- [ ] **テーマ別グルーピング** — 手動タグ付けから開始。自動相関はv1.2以降
- [ ] **朝のまとめダッシュボード** — 日次サマリ生成。v1で通知が定着したら追加
- [ ] **市場詳細ページ（拡張版）** — v1は一覧中心、詳細は最小限。v1.x で拡充
- [ ] **ユーザー設定（通知カスタマイズ）** — v1はデフォルト通知、v1.xでカスタマイズ可能に
- [ ] **フリーミアムモデル実装** — v1で価値検証後、有料プラン設計・実装

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **マルチソース統合（Kalshi, Manifoldなど）** — v1でPolymarket単体を深く理解してから拡張
- [ ] **モバイルネイティブアプリ** — PWAまたはレスポンシブWebで十分検証後
- [ ] **高度な異常検知（機械学習）** — v1はルールベース。v2で精度向上
- [ ] **ユーザー間コミュニティ機能** — Anti-featureだが、PMF後に要望強ければ検討
- [ ] **長期データアーカイブ** — 数ヶ月の履歴で十分。分析ニーズ確認後に検討
- [ ] **他言語展開（英語、韓国語など）** — 日本市場でPMF確立後

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| 市場一覧表示 | HIGH | LOW | P1 |
| カテゴリ別フィルタリング | HIGH | LOW | P1 |
| 確率・出来高表示 | HIGH | LOW | P1 |
| 日本語翻訳（基本） | HIGH | HIGH | P1 |
| 急変検知 | HIGH | MEDIUM | P1 |
| Discord通知（急変） | HIGH | MEDIUM | P1 |
| ソート機能 | MEDIUM | LOW | P1 |
| レスポンシブUI | MEDIUM | MEDIUM | P1 |
| 検索機能 | MEDIUM | MEDIUM | P2 |
| AI要約 | HIGH | HIGH | P2 |
| クジラ検知 | HIGH | HIGH | P2 |
| 価格履歴グラフ | MEDIUM | MEDIUM | P2 |
| テーマ別グルーピング | MEDIUM | MEDIUM | P2 |
| 朝のまとめダッシュボード | MEDIUM | MEDIUM | P2 |
| 市場詳細ページ（拡張） | MEDIUM | MEDIUM | P2 |
| ユーザー設定 | MEDIUM | HIGH | P2 |
| フリーミアム実装 | HIGH | HIGH | P2 |
| マルチソース統合 | MEDIUM | VERY HIGH | P3 |
| モバイルアプリ | MEDIUM | VERY HIGH | P3 |
| 高度な異常検知 | MEDIUM | HIGH | P3 |
| 自動売買機能 | LOW | VERY HIGH | Anti-feature |
| ユーザーコミュニティ | LOW | HIGH | Anti-feature (v1) |
| 完全リアルタイム | LOW | HIGH | Anti-feature |

**Priority key:**
- P1: Must have for launch — v1 MVP
- P2: Should have, add when possible — v1.x 段階的追加
- P3: Nice to have, future consideration — v2+ 長期戦略

## Competitor Feature Analysis

| Feature | Polymarket（ソース） | Manifold Markets | Kalshi | Our Approach |
|---------|---------------------|------------------|--------|--------------|
| 市場一覧 | カテゴリ別、ソート豊富（New/Trending/Liquid等） | カテゴリ別、シンプルなソート | カテゴリ別、規制市場特化 | Polymarketを参考にソート実装、日本語カテゴリ |
| 確率表示 | パーセンテージ表示、リアルタイム更新 | パーセンテージ＋Mana（独自通貨） | パーセンテージ＋ドル価格 | パーセンテージ表示、1-5分更新 |
| 通知機能 | なし（プラットフォーム内のみ） | メール通知（市場作成者向け） | メール・プッシュ通知（価格アラート） | Discord通知（急変・クジラ）で差別化 |
| AI分析 | なし | なし | なし | LLM要約「なぜ動いたか」で差別化 |
| 言語 | 英語のみ | 英語のみ | 英語のみ | 日本語特化で差別化 |
| グルーピング | 手動タグのみ | 手動タグのみ | カテゴリのみ | 手動＋自動相関で差別化（v1.x） |
| 取引機能 | あり（本体） | あり（本体） | あり（本体） | なし（情報提供特化） |
| データ履歴 | API経由で取得可能 | 限定的 | 限定的 | 短期履歴（30-90日）、急変検知に活用 |
| モバイル対応 | レスポンシブWeb | レスポンシブWeb | iOS/Androidアプリあり | レスポンシブWeb（v1）、アプリ後回し |

**考察:**
- **日本語特化は明確な差別化**: 全ての主要競合が英語のみ。日本市場でブルーオーシャン
- **通知機能の差**: 競合はプラットフォーム内またはメール。Discordはトレーダーの日常ツールで優位性
- **AI分析のギャップ**: 既存製品は生データのみ。「なぜ動いたか」の洞察提供で差別化可能
- **取引機能を持たないリスク**: 情報と取引を分離するのは異例だが、Anti-feature分析で正当化済み。外部リンクで補完

## Sources

### 高信頼度（Context7, 公式ドキュメント）
- **Polymarket公式ドキュメント** (https://docs.polymarket.com) — API仕様、エンドポイント、データフィールド確認（HIGH confidence）
- **Polymarket公式サイト** (https://polymarket.com) — UIパターン、ソート・フィルタリング機能の実例（HIGH confidence）

### 中信頼度（WebFetch経由で検証）
- **Manifold Markets** (https://manifold.markets) — 競合分析、カテゴリ・ソート機能確認（MEDIUM confidence）
- **Augur公式サイト** (https://augur.net) — 競合分析、限定的な情報（LOW-MEDIUM confidence）

### 低信頼度（トレーニングデータ）
- **Kalshi, PredictIt等の予測市場プラットフォーム** — 一般的な機能パターン、アクセス制限で詳細未確認（LOW confidence）
- **Dune Analytics等のブロックチェーン分析ツール** — Polymarketダッシュボード存在の推測、403エラーで未確認（LOW confidence）
- **Discord通知パターン** — 暗号資産・NFTコミュニティでの標準プラクティス（トレーニングデータ、MEDIUM confidence）

### 検証できなかった情報
- Reddit/Twitter等のユーザーフィードバック — アクセス制限・レート制限により未確認
- 第三者製Polymarket分析ツール — GitHub検索では発見できず、存在するか不明

**全体的な信頼度: MEDIUM**
- Polymarket公式情報（API、UI）は高信頼度
- 競合製品の詳細は限定的（アクセス制限）
- 日本語特化の差別化はトレーニングデータベース（既存製品不在の推測）

---
*Feature research for: 予測市場インテリジェンス・アグリゲーションプラットフォーム*
*Researched: 2026-03-20*
