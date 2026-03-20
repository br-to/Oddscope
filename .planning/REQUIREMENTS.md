# Requirements: Oddscope

**Defined:** 2026-03-20
**Core Value:** 予測市場の「今何が起きているか」を、日本語で瞬時に把握できること

## v1 Requirements

### Market Data

- [x] **MKTD-01**: Polymarket市場を日本語で一覧表示（タイトル翻訳＋短い説明文で「何の市場か」を一瞬で理解可能に）
- [ ] **MKTD-02**: 曖昧な市場・米政治/規制ネタに文脈補足を付与（日本人が「それ何？」とならないように）
- [ ] **MKTD-03**: テーマ別グルーピング（米政治、AI、暗号資産、地政学、マクロ等）をプロダクト全体の中心軸として実装（急変検知・朝まとめ・検索・通知全てに効く）
- [ ] **MKTD-04**: カテゴリ・出来高・変動率でのフィルタリング・ソート
- [ ] **MKTD-05**: 重要度スコアによるノイズ抑制（低流動性市場の扱い、同種市場の重複抑制、束ね表示）
- [ ] **MKTD-06**: テーマ軸での横断検索
- [ ] **MKTD-07**: データソース非依存の共通市場モデル（Polymarket以外への拡張を見据えた抽象化）

### Analytics

- [ ] **ANLY-01**: 急変市場の自動抽出・ハイライト（テーマ単位でも検知可能）
- [ ] **ANLY-02**: 「なぜ動いたか」をAI下書き＋手動編集で提供。原因と断定せず「関連ニュース」として提示
- [ ] **ANLY-03**: 自信が低いときは無理に説明せず、価格変動とニュースのタイミング差も表示
- [ ] **ANLY-04**: コピペしやすい要約フォーマット（X発信・記事ネタとして使える形式）

### Morning Experience

- [ ] **MORN-01**: 朝ダイジェストを主画面として設計（昨夜の急変をまとめて把握）
- [ ] **MORN-02**: テーマごとに「何が起きたか」を整理表示
- [ ] **MORN-03**: 通知から開いた時も朝見た時も破綻しないUI設計

### Notifications

- [ ] **NOTF-01**: Discord急変通知（日本語で自然、長すぎない、一目で「見る価値あるか」判断可能）
- [ ] **NOTF-02**: 通知にテーマ情報＋関連ニュース1行を含める
- [ ] **NOTF-03**: 通知の間引き設計（ノイズにならない頻度制御）
- [ ] **NOTF-04**: 朝のまとめダイジェストをDiscordにも配信

### Monetization

- [ ] **MONT-01**: フリーミアム実装（無料: 一覧＋遅延データ、有料: 通知＋分析＋リアルタイム）
- [ ] **MONT-02**: 認証・課金の基盤

### Shareability

- [ ] **SHAR-01**: 共有しやすい表示（市場・テーマ単位のパーマリンク）
- [ ] **SHAR-02**: 一覧からネタを拾いやすい構造

## v2 Requirements

### Advanced Analytics

- **ADVN-01**: クジラ・出来高急増検知
- **ADVN-02**: 相関自動検出（連動する市場の自動発見）

### Content

- **CONT-01**: 市場詳細ページ（個別チャート・価格履歴）

### Data Sources

- **DATA-01**: Kalshi API統合
- **DATA-02**: その他予測市場データソースの追加

## Out of Scope

| Feature | Reason |
|---------|--------|
| 自動売買・取引機能 | 情報提供に特化、ライセンスリスク回避 |
| モバイルアプリ | Web優先、レスポンシブで対応 |
| ユーザー間コミュニティ | v1では不要、コア価値と無関係 |
| リアルタイムチャット | 複雑度高、コア価値と無関係 |
| OAuth/ソーシャルログイン | メール/パスワードでv1は十分 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| MKTD-01 | Phase 1 | Complete |
| MKTD-02 | Phase 1 | Pending |
| MKTD-04 | Phase 1 | Pending |
| MKTD-03 | Phase 2 | Pending |
| MKTD-05 | Phase 2 | Pending |
| MKTD-06 | Phase 2 | Pending |
| MKTD-07 | Phase 2 | Pending |
| SHAR-01 | Phase 2 | Pending |
| SHAR-02 | Phase 2 | Pending |
| ANLY-01 | Phase 3 | Pending |
| ANLY-02 | Phase 3 | Pending |
| ANLY-03 | Phase 3 | Pending |
| ANLY-04 | Phase 3 | Pending |
| NOTF-01 | Phase 4 | Pending |
| NOTF-02 | Phase 4 | Pending |
| NOTF-03 | Phase 4 | Pending |
| MORN-01 | Phase 5 | Pending |
| MORN-02 | Phase 5 | Pending |
| MORN-03 | Phase 5 | Pending |
| NOTF-04 | Phase 5 | Pending |
| MONT-01 | Phase 6 | Pending |
| MONT-02 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0

---
*Requirements defined: 2026-03-20*
*Last updated: 2026-03-20 after roadmap creation*
