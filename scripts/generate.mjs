// Writes src/generated.ts from the Fokals OpenAPI document, so each tool's description and
// input schema are the API's own. Run it again when the API gains or changes a tool:
//
//   node scripts/generate.mjs                       reads https://api.fokals.com/v1/openapi.json
//   node scripts/generate.mjs path/to/openapi.json  or a saved copy

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OPENAPI_URL = 'https://api.fokals.com/v1/openapi.json';
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'generated.ts');

// The tools an agent reads data with. Tools that change what an account holds (watches, files,
// funds, requests, reports) are left to the account page and the MCP server.
const TOOLS = [
  'find_companies',
  'count_companies',
  'enrich_companies',
  'company_profile',
  'company_changes',
  'search_job_postings',
  'similar_companies',
  'company_connections',
  'identify_company',
  'market_breakdown',
  'vendor_scorecard',
  'companies_like_customers',
  'company_health',
  'likely_next',
  'intent_history',
  'sales_team',
  'funding_filings',
  'headcount_history',
  'traffic_history',
  'signal_feed',
  'announcement_feed',
  'change_feed',
  'listed_securities',
  'market_trends',
  'market_movers',
  'sales_pay_benchmarks',
  'list_filters',
  'account_balance',
];

// Prices change, so the package never states them. In their place a paid tool says where they
// are and what to do when a call returns its price.
const PAID_TAIL =
  ' Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices.' +
  ' A call that costs more than the account lets run unasked returns its price instead:' +
  ' tell the person, then call again with max_usd once they agree.';
const MAX_DESCRIPTION = 1024;

const camel = (name) => name.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let allEndpoints = [];

// A description that names another tool names it by its key here (countCompanies); a sentence
// about a tool this package leaves out is dropped.
function rename(text) {
  const leftOut = allEndpoints.filter((e) => !TOOLS.includes(e));
  if (leftOut.length) {
    const mention = new RegExp(`\\b(${leftOut.map(escape).join('|')})\\b`);
    text = text
      .trim()
      .split(/(?<=[.;])\s+/)
      .filter((s) => !mention.test(s))
      .join(' ');
  }
  const ours = new RegExp(`\\b(${TOOLS.map(escape).join('|')})\\b`, 'g');
  return text.replace(ours, (m) => camel(m));
}

function describe(text, paid) {
  text = rename(text).replace(/\s*Costs \$[\s\S]*$/, '').trim();
  if (paid) text = text.replace(/\s*Free\.\s*$/, '') + PAID_TAIL;
  if (text.length > MAX_DESCRIPTION) {
    const tail = paid ? PAID_TAIL : '';
    const sentences = (paid ? text.slice(0, -PAID_TAIL.length) : text).split(/(?<=\.)\s+/);
    const fits = () => (sentences.join(' ') + tail).length <= MAX_DESCRIPTION;
    const each = sentences.findIndex((s) => s.startsWith('Each company comes with'));
    if (!fits() && each >= 0) sentences.splice(each, 1);
    while (!fits() && sentences.length > 1) sentences.pop();
    text = sentences.join(' ') + tail;
  }
  if (text.length > MAX_DESCRIPTION) throw new Error(`Too long: ${text}`);
  return text;
}

// The schema as the model is shown it: the API's own, with tool names in descriptions renamed.
function schemaOf(schema) {
  const out = JSON.parse(JSON.stringify(schema));
  delete out.$schema;
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (typeof node.description === 'string') node.description = rename(node.description);
    for (const value of Object.values(node)) walk(value);
  };
  walk(out);
  return out;
}

async function load(source) {
  if (source) return JSON.parse(readFileSync(source, 'utf8'));
  const response = await fetch(OPENAPI_URL, { headers: { 'User-Agent': 'fokals-ai-sdk-generate' } });
  if (!response.ok) throw new Error(`${OPENAPI_URL} answered ${response.status}`);
  return response.json();
}

const doc = await load(process.argv[2]);
allEndpoints = Object.entries(doc.paths)
  .filter(([, item]) => item.post)
  .map(([path]) => path.replace(/^\//, ''));

const specs = TOOLS.map((endpoint) => {
  const op = doc.paths[`/${endpoint}`].post;
  const body = op.requestBody.content['application/json'];
  return {
    key: camel(endpoint),
    endpoint,
    title: op.summary,
    paid: Boolean(op['x-fokals-paid']),
    description: describe(op.description, Boolean(op['x-fokals-paid'])),
    inputSchema: schemaOf(body.schema),
    example: body.example ?? {},
  };
});

const lines = [
  '// Written by scripts/generate.mjs from the Fokals OpenAPI document. Do not edit by hand.',
  '',
  'export type ToolSpec = {',
  '  /** The key the tool has in fokalsTools(), and the name of its function. */',
  '  key: string;',
  '  /** The endpoint it calls: POST https://api.fokals.com/v1/<endpoint>. */',
  '  endpoint: string;',
  '  title: string;',
  '  paid: boolean;',
  '  description: string;',
  '  inputSchema: Record<string, unknown>;',
  '  /** The API\'s own example call. */',
  '  example: Record<string, unknown>;',
  '};',
  '',
  `export const API_VERSION = ${JSON.stringify(doc.info.version)};`,
  '',
  '/** Every tool, by the key it has in fokalsTools(). */',
  `export const TOOL_NAMES = ${JSON.stringify(specs.map((s) => s.key))} as const;`,
  'export type FokalsToolName = (typeof TOOL_NAMES)[number];',
  '',
  `export const SPECS: readonly (ToolSpec & { key: FokalsToolName })[] = ${JSON.stringify(specs, null, 2)};`,
  '',
];
writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log(`Wrote ${specs.length} tools to ${OUT}`);
