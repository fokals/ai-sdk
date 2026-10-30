import { generateText, isStepCount } from 'ai';
import { MockLanguageModelV4 } from 'ai/test';
import { describe, expect, it } from 'vitest';
import {
  callFokals,
  companyProfile,
  FokalsError,
  fokalsTools,
  identifyCompany,
  SPECS,
  VERSION,
} from '../src/index';

type Seen = { url: string; init: RequestInit };

function fakeFetch(status: number, body: unknown, seen: Seen[] = []) {
  return (async (url: string | URL | Request, init?: RequestInit) => {
    seen.push({ url: String(url), init: init ?? {} });
    return new Response(typeof body === 'string' ? body : JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;
}

const usage = {
  inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 5, text: 5, reasoning: 0 },
};
const ANSWER = { message: '1 company could be meant.', data: { companies: [{ id: 'c_1', website: 'stripe.com' }] } };

describe('a call', () => {
  it('is one POST with the key and only the arguments given', async () => {
    const seen: Seen[] = [];
    const result = await callFokals(
      'find_companies',
      { technology: 'HubSpot', hiring: true, country: undefined },
      { apiKey: 'test-key', fetch: fakeFetch(200, ANSWER, seen) },
    );
    expect(result).toEqual(ANSWER);
    expect(seen).toHaveLength(1);
    expect(seen[0].url).toBe('https://api.fokals.com/v1/find_companies');
    expect(seen[0].init.method).toBe('POST');
    const headers = seen[0].init.headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer test-key');
    expect(headers['User-Agent']).toBe(`fokals-ai-sdk/${VERSION}`);
    expect(JSON.parse(String(seen[0].init.body))).toEqual({ technology: 'HubSpot', hiring: true });
  });

  it('reads the key from FOKALS_API_KEY, and says where to make one when there is none', async () => {
    const seen: Seen[] = [];
    process.env.FOKALS_API_KEY = 'env-key';
    await callFokals('account_balance', {}, { fetch: fakeFetch(200, ANSWER, seen) });
    expect((seen[0].init.headers as Record<string, string>).Authorization).toBe('Bearer env-key');
    delete process.env.FOKALS_API_KEY;
    await expect(callFokals('account_balance', {}, { fetch: fakeFetch(200, ANSWER) })).rejects.toThrow(
      /fokals\.com\/account/,
    );
  });

  it('passes on a price to agree to, not as an error', async () => {
    const price = {
      error: { code: 'payment_required', message: 'This call costs $4.00. Call again with max_usd.', cost_usd: 4 },
    };
    const result = await callFokals('find_companies', { technology: 'HubSpot' }, {
      apiKey: 'k',
      fetch: fakeFetch(402, price),
    });
    expect(result).toEqual({
      needsApproval: true,
      message: 'This call costs $4.00. Call again with max_usd.',
      details: { code: 'payment_required', cost_usd: 4 },
    });
  });

  it.each([400, 401, 422, 429, 500])('turns a %i refusal into an error in the API words', async (status) => {
    const body = { error: { code: 'x', message: `Refused with ${status}.` } };
    const call = callFokals('find_companies', {}, { apiKey: 'k', fetch: fakeFetch(status, body) });
    await expect(call).rejects.toThrow(`Refused with ${status}.`);
    await expect(call).rejects.toBeInstanceOf(FokalsError);
  });

  it('still has words when the answer is not JSON', async () => {
    await expect(
      callFokals('find_companies', {}, { apiKey: 'k', fetch: fakeFetch(502, 'Bad gateway') }),
    ).rejects.toThrow('Fokals answered 502.');
  });
});

describe('the tools', () => {
  it('are every spec, keyed by name, or the ones named', () => {
    const all = fokalsTools({ apiKey: 'k' });
    expect(Object.keys(all)).toEqual(SPECS.map((s) => s.key));
    const some = fokalsTools({ apiKey: 'k', include: ['findCompanies', 'companyProfile'] });
    expect(Object.keys(some)).toEqual(['findCompanies', 'companyProfile']);
    expect(() => fokalsTools({ include: ['nothingHere' as never] })).toThrow('No Fokals tool called nothingHere.');
  });

  it('fit what chat models accept, state no price and name other tools by their keys', () => {
    const endpoints = new Set<string>(SPECS.map((s) => s.endpoint));
    for (const spec of SPECS) {
      expect(spec.description.length).toBeLessThanOrEqual(1024);
      // Prices change: the package points to them and never states one.
      expect(spec.description).not.toMatch(/\$\d/);
      // Another tool is named by its key here (countCompanies), never its endpoint.
      const named = (spec.description.match(/\b[a-z]+(?:_[a-z]+)+\b/g) ?? []).filter((w) => endpoints.has(w));
      expect(named).toEqual([]);
      expect(spec.inputSchema.type).toBe('object');
    }
  });

  it('run inside generateText with the current AI SDK', async () => {
    const seen: Seen[] = [];
    let step = 0;
    const model = new MockLanguageModelV4({
      doGenerate: async () => {
        step += 1;
        if (step === 1)
          return {
            content: [
              {
                type: 'tool-call',
                toolCallId: 'call-1',
                toolName: 'identifyCompany',
                input: JSON.stringify({ company: 'Stripe' }),
              },
            ],
            finishReason: { unified: 'tool-calls', raw: 'tool_calls' },
            usage,
            warnings: [],
          };
        return {
          content: [{ type: 'text', text: 'Stripe is stripe.com.' }],
          finishReason: { unified: 'stop', raw: 'stop' },
          usage,
          warnings: [],
        };
      },
    });
    const result = await generateText({
      model,
      prompt: 'Which company is Stripe?',
      tools: { identifyCompany: identifyCompany({ apiKey: 'k', fetch: fakeFetch(200, ANSWER, seen) }) },
      stopWhen: isStepCount(3),
    });
    expect(result.text).toBe('Stripe is stripe.com.');
    expect(seen).toHaveLength(1);
    expect(JSON.parse(String(seen[0].init.body))).toEqual({ company: 'Stripe' });
    const toolResults = result.steps.flatMap((s) => s.toolResults);
    expect(toolResults[0]?.output).toEqual(ANSWER);
  });

  it('report a refusal to the model as a tool error rather than ending the run', async () => {
    let step = 0;
    const model = new MockLanguageModelV4({
      doGenerate: async () => {
        step += 1;
        if (step === 1)
          return {
            content: [
              { type: 'tool-call', toolCallId: 'c', toolName: 'companyProfile', input: JSON.stringify({ company: 'x' }) },
            ],
            finishReason: { unified: 'tool-calls', raw: 'tool_calls' },
            usage,
            warnings: [],
          };
        return { content: [{ type: 'text', text: 'done' }], finishReason: { unified: 'stop', raw: 'stop' }, usage, warnings: [] };
      },
    });
    const result = await generateText({
      model,
      prompt: 'Profile x',
      tools: {
        companyProfile: companyProfile({
          apiKey: 'bad',
          fetch: fakeFetch(401, { error: { code: 'unauthorized', message: 'That key or sign-in is not valid.' } }),
        }),
      },
      stopWhen: isStepCount(3),
    });
    expect(result.text).toBe('done');
    const errors = result.steps.flatMap((s) => s.content).filter((c) => c.type === 'tool-error');
    expect(errors).toHaveLength(1);
    expect(String((errors[0] as { error: unknown }).error)).toContain('That key or sign-in is not valid.');
  });
});

describe('the package', () => {
  it('reports the version it is published as', async () => {
    const { readFileSync } = await import('node:fs');
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    expect(VERSION).toBe(pkg.version);
  });
});
