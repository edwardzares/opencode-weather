type PromptFn = (message?: string) => string | null;

export function mockPromptQueue(answers: string[]): { restore: () => void } {
  const original = (globalThis as unknown as { prompt: PromptFn }).prompt;
  let index = 0;

  (globalThis as unknown as { prompt: PromptFn }).prompt = () => {
    if (index >= answers.length) return null;
    const answer = answers[index];
    index += 1;
    return answer ?? null;
  };

  return {
    restore: () => {
      (globalThis as unknown as { prompt: PromptFn }).prompt = original;
    },
  };
}

export async function withPrompt<T>(answers: string[], fn: () => Promise<T>): Promise<T> {
  const mock = mockPromptQueue(answers);
  try {
    return await fn();
  } finally {
    mock.restore();
  }
}
