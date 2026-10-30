import { jsonSchema, tool, type Tool } from 'ai';
import { callFokals, type FokalsAnswer, type FokalsOptions, type FokalsPriceToAgree } from './client';
import { SPECS, type FokalsToolName, type ToolSpec } from './generated';

export { callFokals, DEFAULT_BASE_URL, FokalsError, VERSION } from './client';
export type { FokalsAnswer, FokalsOptions, FokalsPriceToAgree } from './client';
export { API_VERSION, SPECS, TOOL_NAMES } from './generated';
export type { FokalsToolName, ToolSpec } from './generated';

/** A Fokals tool: the arguments the model gives, and the API's answer or the price to agree to. */
export type FokalsTool = Tool<Record<string, unknown>, FokalsAnswer | FokalsPriceToAgree>;

function makeTool(spec: ToolSpec, options: FokalsOptions): FokalsTool {
  return tool({
    description: spec.description,
    inputSchema: jsonSchema<Record<string, unknown>>(spec.inputSchema as Parameters<typeof jsonSchema>[0]),
    execute: async (input, { abortSignal }) => callFokals(spec.endpoint, input, options, abortSignal),
  });
}

const specOf = (key: FokalsToolName) => SPECS.find((s) => s.key === key) as ToolSpec;
const factory =
  (key: FokalsToolName) =>
  (options: FokalsOptions = {}): FokalsTool =>
    makeTool(specOf(key), options);

/** Finds companies by a technology, buying topic, hiring, announcement, project, pricing change, agent readiness, health, industry or country. */
export const findCompanies = factory('findCompanies');
/** Counts the companies that match the same filters as findCompanies, and what getting them would cost. Free. */
export const countCompanies = factory('countCompanies');
/** Fills in the person's own list of companies, by website or name. */
export const enrichCompanies = factory('enrichCompanies');
/** One company in depth. */
export const companyProfile = factory('companyProfile');
/** What is new at the person's companies since a date. */
export const companyChanges = factory('companyChanges');
/** Searches open job postings. */
export const searchJobPostings = factory('searchJobPostings');
/** Lookalikes of a company, or its competitors. */
export const similarCompanies = factory('similarCompanies');
/** The customers, partners, integrations and investors a company's website names, and who names it. */
export const companyConnections = factory('companyConnections');
/** Which company a name or website address means. Free. */
export const identifyCompany = factory('identifyCompany');
/** How a market divides by industry, country, technology, buying topic and more. */
export const marketBreakdown = factory('marketBreakdown');
/** A technology vendor month by month: companies won and lost, churn and rivals. */
export const vendorScorecard = factory('vendorScorecard');
/** Companies that look today the way the person's customers looked when they bought. */
export const companiesLikeCustomers = factory('companiesLikeCustomers');
/** A company's health this week, with the reasons. */
export const companyHealth = factory('companyHealth');
/** The technologies a company is likeliest to add next. */
export const likelyNext = factory('likelyNext');
/** The values the search tools filter by. Free. */
export const listFilters = factory('listFilters');
/** The balance, what this month has spent, and the prices. Free. */
export const accountBalance = factory('accountBalance');

/**
 * Every Fokals tool, keyed by name, for `tools` in generateText or streamText.
 * Pass `include` to keep only some of them.
 */
export function fokalsTools(options: FokalsOptions & { include?: FokalsToolName[] } = {}) {
  const { include, ...rest } = options;
  const keys = include ?? SPECS.map((s) => s.key);
  for (const key of keys)
    if (!SPECS.some((s) => s.key === key)) throw new Error(`No Fokals tool called ${String(key)}.`);
  return Object.fromEntries(keys.map((key) => [key, makeTool(specOf(key), rest)])) as Record<
    FokalsToolName,
    FokalsTool
  >;
}
