export const DEFAULT_BASE_URL = 'https://api.fokals.com/v1';
export const VERSION = '0.2.0';

export type FokalsOptions = {
  /** The Fokals key. Read from FOKALS_API_KEY unless given. Make one at https://www.fokals.com/account. */
  apiKey?: string;
  /** The API's address. */
  baseUrl?: string;
  /** A fetch to use in place of the global one, for proxies and tests. */
  fetch?: typeof fetch;
};

/** What a call came back with: the API's own sentence about what it did, and the data. */
export type FokalsAnswer = {
  message: string;
  data: Record<string, unknown>;
};

/**
 * A call that did not run because it needs the person's agreement on price (or more funds).
 * Not an error: the agent tells the person and, once they agree, calls again with max_usd.
 */
export type FokalsPriceToAgree = {
  needsApproval: true;
  message: string;
  details: Record<string, unknown>;
};

export class FokalsError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'FokalsError';
    this.status = status;
    this.code = code;
  }
}

function keyOf(options: FokalsOptions): string {
  const key =
    options.apiKey ??
    (typeof process !== 'undefined' ? process.env?.FOKALS_API_KEY : undefined);
  if (!key)
    throw new FokalsError(
      401,
      'no_key',
      'No Fokals key. Set FOKALS_API_KEY or pass apiKey. Make a key on your account page at https://www.fokals.com/account.',
    );
  return key;
}

/** One POST to an endpoint of the Fokals API, with only the arguments given. */
export async function callFokals(
  endpoint: string,
  args: Record<string, unknown>,
  options: FokalsOptions = {},
  signal?: AbortSignal,
): Promise<FokalsAnswer | FokalsPriceToAgree> {
  const body = Object.fromEntries(
    Object.entries(args ?? {}).filter(([, value]) => value !== undefined && value !== null),
  );
  const doFetch = options.fetch ?? fetch;
  const response = await doFetch(`${(options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '')}/${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${keyOf(options)}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': `fokals-ai-sdk/${VERSION}`,
    },
    body: JSON.stringify(body),
    signal,
  });
  let parsed: unknown = {};
  try {
    parsed = await response.json();
  } catch {
    parsed = {};
  }
  const answer = (parsed && typeof parsed === 'object' ? parsed : {}) as Record<string, unknown>;
  if (response.status === 200) {
    return {
      message: String(answer.message ?? '').trim(),
      data: (answer.data && typeof answer.data === 'object' ? answer.data : {}) as Record<string, unknown>,
    };
  }
  const error = (answer.error && typeof answer.error === 'object' ? answer.error : {}) as Record<string, unknown>;
  const message = String(error.message || `Fokals answered ${response.status}.`);
  if (response.status === 402) {
    const details = { ...error };
    delete details.message;
    return { needsApproval: true, message, details };
  }
  throw new FokalsError(response.status, String(error.code ?? 'error'), message);
}
