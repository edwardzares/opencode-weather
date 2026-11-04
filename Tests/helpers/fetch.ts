export type FetchHandler = (url: string, init?: RequestInit) => Response | Promise<Response>;

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export function mockFetch(handler: FetchHandler): { calls: string[]; restore: () => void } {
  const original = globalThis.fetch;
  const calls: string[] = [];

  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    calls.push(url);
    return handler(url, init);
  }) as typeof fetch;

  return {
    calls,
    restore: () => {
      globalThis.fetch = original;
    },
  };
}

export async function withFetch<T>(handler: FetchHandler, fn: () => Promise<T>): Promise<T> {
  const mock = mockFetch(handler);
  try {
    return await fn();
  } finally {
    mock.restore();
  }
}
