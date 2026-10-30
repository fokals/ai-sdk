# @fokals/ai-sdk

[Fokals](https://www.fokals.com) as tools for the [AI SDK](https://ai-sdk.dev).

AI-powered company intelligence on how companies around the world grow, change and compete. Fokals derives advanced signals from company data, covering everything from technology and hiring to funding, buying intent and company health. Refreshed every day and brought together into a clear view of every market.

This package gives an AI SDK agent that data as tools: find companies by what they show, enrich a list of accounts, profile one company in depth, follow what changed, and size a market.

## Install

```bash
npm install @fokals/ai-sdk ai
```

## Get a key

Sign up at [fokals.com](https://www.fokals.com/signup) and make a key on your [account page](https://www.fokals.com/account). Then set it:

```bash
export FOKALS_API_KEY="your-key"
```

Or pass it to any tool as `apiKey`.

## Use it

```ts
import { generateText, isStepCount } from 'ai';
import { fokalsTools } from '@fokals/ai-sdk';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-5.5',
  prompt: 'Which US companies running HubSpot are hiring right now?',
  tools: fokalsTools(),
  stopWhen: isStepCount(5),
});

console.log(text);
```

Give the agent only some tools:

```ts
const tools = fokalsTools({ include: ['findCompanies', 'countCompanies', 'companyProfile'] });
```

Or take one tool on its own:

```ts
import { companyProfile } from '@fokals/ai-sdk';

const tools = { companyProfile: companyProfile() };
```

Every tool returns the API's own sentence about what it did, as `message`, and the data, as `data`.

## Tools

| Tool | What it does | Cost |
| --- | --- | --- |
| `findCompanies` | Finds companies by a technology they run, a buying topic, hiring, an announcement, a project in their job ads, a pricing change, agent readiness, health, industry or country | Paid |
| `countCompanies` | Counts the companies that match the same filters, and says what getting them would cost | Free |
| `enrichCompanies` | Fills in your own list of companies, by website or name, up to 100 a call | Paid |
| `companyProfile` | One company in depth: technologies and since when, open roles, buying topics, announcements, website changes, traffic, health and likely next technologies | Paid |
| `companyChanges` | What is new at your companies since a date: website changes and announcements, in plain words | Paid |
| `searchJobPostings` | Searches open job postings by title, function, seniority, country, work mode, technology and pay | Paid |
| `similarCompanies` | Lookalikes of a company, or its competitors, with what they share | Paid |
| `companyConnections` | The customers, partners, integrations and investors a company's website names, and who names it | Paid |
| `identifyCompany` | Which company a name or website address means | Free |
| `marketBreakdown` | How a market divides by industry, country, technology, buying topic and more | Paid |
| `vendorScorecard` | A technology vendor month by month: companies won and lost, churn, and the rivals they came from or moved to | Paid |
| `companiesLikeCustomers` | Companies that look today the way your customers looked when they bought | Paid |
| `companyHealth` | A company's health this week, with the reasons | Paid |
| `likelyNext` | The technologies a company is likeliest to add next | Paid |
| `listFilters` | The values the search tools filter by: technologies, buying topics, industries, countries | Free |
| `accountBalance` | The balance, what this month has spent, and the prices | Free |

## Prices

Paid tools are charged from your prepaid Fokals balance at the prices on the [pricing page](https://www.fokals.com/pricing), also at [api.fokals.com/v1/prices](https://api.fokals.com/v1/prices). A company that is not found costs nothing.

A call that would cost more than your account lets run unasked does not run. It returns `{ needsApproval: true, message, details }` with its price instead: the agent tells the person, and when they agree it calls again with `max_usd`. This is a normal answer, not an error.

## Errors

A refused call (a bad argument, a key that is not valid, too many calls in a minute) throws a `FokalsError` with the API's own words and the HTTP status. The AI SDK hands it to the model as a tool error, so the agent can correct itself.

## Prefer MCP?

Fokals is also a remote MCP server at `https://mcp.fokals.com/mcp`, with the same account, balance and prices. See [fokals.com/docs/connect](https://www.fokals.com/docs/connect).

## Development

The tools are written from the API's own OpenAPI document, so their names, descriptions and inputs match the API:

```bash
npm run generate
npm test
npm run build
```

## Licence

MIT
