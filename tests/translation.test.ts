import { describe, it, expect, vi, beforeEach } from 'vitest';
import { translateMarket } from '@/lib/translation';
import OpenAI from 'openai';

// Mock OpenAI
vi.mock('openai', () => {
  const OpenAI = vi.fn();
  OpenAI.prototype.chat = {
    completions: {
      create: vi.fn(),
    },
  };
  return { default: OpenAI };
});

describe('translation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return titleJa and contextNote from LLM response', async () => {
    const mockCreate = vi.mocked(OpenAI.prototype.chat.completions.create);
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              titleJa: 'トランプがペンシルバニアを制するか？',
              contextNote: '2024年米大統領選の激戦州',
            }),
          },
        },
      ],
    } as any);

    const result = await translateMarket({
      question: 'Will Trump win Pennsylvania?',
      category: 'politics',
    });

    expect(result).toEqual({
      titleJa: 'トランプがペンシルバニアを制するか？',
      contextNote: '2024年米大統領選の激戦州',
    });
  });

  it('should include domain dictionary in prompt', async () => {
    const mockCreate = vi.mocked(OpenAI.prototype.chat.completions.create);
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              titleJa: 'ビットコインが史上最高値に到達するか？',
              contextNote: '現在の最高値は約$69,000',
            }),
          },
        },
      ],
    } as any);

    await translateMarket({
      question: 'Will Bitcoin reach ATH?',
      category: 'crypto',
    });

    const callArgs = mockCreate.mock.calls[0][0];
    const prompt = callArgs.messages[0].content;

    // Check that domain dictionary terms are included in prompt
    expect(prompt).toContain('resolve');
    expect(prompt).toContain('決済');
    expect(prompt).toContain('swing state');
    expect(prompt).toContain('激戦州');
  });

  it('should use gpt-4o-mini model', async () => {
    const mockCreate = vi.mocked(OpenAI.prototype.chat.completions.create);
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              titleJa: 'テスト',
              contextNote: 'テスト',
            }),
          },
        },
      ],
    } as any);

    await translateMarket({
      question: 'Test market?',
      category: 'test',
    });

    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.model).toBe('gpt-4o-mini');
  });

  it('should throw error on empty LLM response', async () => {
    const mockCreate = vi.mocked(OpenAI.prototype.chat.completions.create);
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: null,
          },
        },
      ],
    } as any);

    await expect(
      translateMarket({
        question: 'Test?',
        category: 'test',
      })
    ).rejects.toThrow('Empty LLM response');
  });

  it('should use json_object response format', async () => {
    const mockCreate = vi.mocked(OpenAI.prototype.chat.completions.create);
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              titleJa: 'テスト',
              contextNote: 'テスト',
            }),
          },
        },
      ],
    } as any);

    await translateMarket({
      question: 'Test?',
      category: 'test',
    });

    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.response_format).toEqual({ type: 'json_object' });
  });
});
