import OpenAI from 'openai';
import { buildGlossaryPrompt } from './domain-dictionary';
import type { PolymarketRawMarket } from './types';

export async function translateMarket(
  market: Pick<PolymarketRawMarket, 'question' | 'category'>
): Promise<{ titleJa: string; contextNote: string }> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const glossary = buildGlossaryPrompt();

  const prompt = `あなたは予測市場の専門翻訳者です。以下の市場タイトルを日本語に翻訳してください。

**市場タイトル:** ${market.question}
**カテゴリ:** ${market.category}

**参照用語集:**
${glossary}

**指示:**
1. タイトルを日本語に翻訳（30文字以内、簡潔に）
2. 日本人が「それ何？」とならないよう、1行（50文字以内）で文脈補足を追加
3. 正確さを優先（自然さより意味の正しさ）
4. 固有名詞は原文のままでもOK（人名等）

**出力形式（JSON）:**
{
  "titleJa": "日本語タイトル",
  "contextNote": "文脈補足（固有名詞・背景情報の簡潔な説明）"
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 200,
    temperature: 0.3,
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error('Empty LLM response');

  const result = JSON.parse(content);
  return {
    titleJa: result.titleJa ?? '',
    contextNote: result.contextNote ?? '',
  };
}
