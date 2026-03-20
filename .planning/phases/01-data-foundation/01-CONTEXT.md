# Phase 1: データ基盤・基本表示 - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Polymarket市場データを取得・保存し、日本語で一覧表示する基盤を構築する。ユーザーが「何の市場か」を一瞬で理解でき、テーマ・変動率・出来高・急変フラグでフィルタリングできる状態を作る。

Requirements: MKTD-01, MKTD-02, MKTD-04

</domain>

<decisions>
## Implementation Decisions

### データ取得・更新
- Polymarket APIを5分間隔でポーリング
- アクティブ市場＋一定出来高以上の市場を取得（終了済み・低流動性は除外）
- 価格履歴も保存するが粒度は絞る（5分snapではなく粗い粒度でOK）
- Phase 1では全ユーザー同じデータ（遅延差はPhase 6で実装）

### 日本語化
- 市場タイトル: LLM下書き＋手動編集（重要市場は人が品質調整）
- 文脈補足（「それ何？」防止の1行解説）: LLM＋ドメイン辞書で自動生成
- タイミング: 新市場検出時に即生成＋未処理回収のバッチも持つ
- 品質基準: 正確さ優先（自然さより意味の正しさ）
- ドメイン辞書: 予測市場用語・米政治用語・暗号資産用語を整備

### 一覧表示
- 1行1市場のテーブル寄りリスト（情報密度高め）
- 各行に表示: 日本語タイトル、文脈補足1行、テーマタグ、現在確率、24h変動、出来高、急変バッジ、関連ニュースありバッジ
- レスポンシブ対応（PCベースでスマホでも崩れない）

### テーマ分類
- Phase 1から日本語テーマを独自定義してマッピング（Polymarketカテゴリをそのまま使わない）
- テーマ例: 米政治、AI、暗号資産、地政学、マクロ、スポーツ等
- 新市場の日本語化時にテーマも同時にマッピング

### フィルタ・ソート
- フィルタ軸: テーマ、変動率、出来高、急変フラグ
- デフォルトソート: Claude's Discretion（リサーチで最適値を提案）
- 複数フィルタの組み合わせ可能

### Claude's Discretion
- デフォルトソートの最適な軸（出来高、変動率、重要度スコアの組み合わせ等）
- 履歴保存の具体的な粒度（1時間、6時間等）
- 出来高閾値の初期値
- ローディング・エラー・空状態のUI設計
- テーママッピングの自動化手法（LLMベースかルールベースか）

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context
- `.planning/PROJECT.md` -- プロダクトビジョン、独自要件（「解釈レイヤー」としての位置づけ）
- `.planning/REQUIREMENTS.md` -- Phase 1要件: MKTD-01, MKTD-02, MKTD-04
- `.planning/ROADMAP.md` -- Phase依存関係、Phase 2以降との接続点

### Research
- `.planning/research/STACK.md` -- 技術スタック推奨（Next.js 16.2, Neon, Prisma, @polymarket/clob-client）
- `.planning/research/ARCHITECTURE.md` -- システム構造、Polymarket API統合パターン
- `.planning/research/PITFALLS.md` -- WebSocket接続断、API認証遅延、LLMコスト管理の落とし穴

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- なし（グリーンフィールドプロジェクト）

### Established Patterns
- なし（Phase 1で確立する）

### Integration Points
- Polymarket CLOB API -- 市場データ取得の外部接点
- LLM API (OpenAI/Claude) -- 翻訳・文脈補足生成
- Neon PostgreSQL -- データ永続化

</code_context>

<specifics>
## Specific Ideas

- 「Polymarket日本語ダッシュボード」で終わらせない。「予測市場を解釈するレイヤー」として設計する
- テーマ分類はPhase 1からプロダクトの中心軸として据える（Phase 2以降の急変検知・朝まとめ・通知全てに効く）
- 文脈補足は特に米政治・規制ネタが重要（日本人には馴染みが薄い）
- 情報を減らす設計が大事（市場が多すぎて何が大事かわからない問題を防ぐ）

</specifics>

<deferred>
## Deferred Ideas

- 重要度スコアによるノイズ抑制 -- Phase 2
- テーマ別グルーピング表示（セクション分け）-- Phase 2
- 相関自動検出 -- v2
- 市場詳細ページ -- v2

</deferred>

---

*Phase: 01-data-foundation*
*Context gathered: 2026-03-20*
