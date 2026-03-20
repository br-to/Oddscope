// ドメイン特化翻訳辞書
export const DOMAIN_DICTIONARY: Record<string, string> = {
  // 予測市場用語
  'resolve': '決済',
  'resolve YES': 'YESで決済（実現）',
  'resolve NO': 'NOで決済（不実現）',
  'YES/NO': 'YES(実現) / NO(不実現)',
  'whale': '大口投資家',
  'liquidity': '流動性',
  'odds': 'オッズ（確率）',

  // 米政治用語
  'win [state]': '[州]を制する',
  'electoral votes': '選挙人投票',
  'swing state': '激戦州',
  'primary': '予備選挙',
  'nomination': '指名',
  'impeachment': '弾劾',
  'executive order': '大統領令',
  'debt ceiling': '債務上限',
  'government shutdown': '政府閉鎖',
  'midterm': '中間選挙',
  'Speaker of the House': '下院議長',
  'Senate confirmation': '上院承認',
  'filibuster': '議事妨害（フィリバスター）',
  'gerrymandering': 'ゲリマンダリング（選挙区改変）',

  // 暗号資産用語
  'ATH': '史上最高値（All-Time High）',
  'halving': '半減期',
  'ETF': 'ETF（上場投資信託）',
  'spot ETF': '現物ETF',
  'DeFi': '分散型金融（DeFi）',
  'stablecoin': 'ステーブルコイン',

  // AI用語
  'AGI': '汎用人工知能（AGI）',
  'frontier model': 'フロンティアモデル',
  'AI safety': 'AI安全性',

  // 地政学用語
  'sanctions': '制裁',
  'ceasefire': '停戦',
  'annexation': '併合',

  // マクロ経済用語
  'Fed': '米連邦準備制度（FRB）',
  'rate cut': '利下げ',
  'rate hike': '利上げ',
  'CPI': '消費者物価指数（CPI）',
  'recession': '景気後退',
  'soft landing': '軟着陸',
};

export function buildGlossaryPrompt(): string {
  return Object.entries(DOMAIN_DICTIONARY)
    .map(([en, ja]) => `- ${en}: ${ja}`)
    .join('\n');
}
