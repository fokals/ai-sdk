// Written by scripts/generate.mjs from the Fokals OpenAPI document. Do not edit by hand.

export type ToolSpec = {
  /** The key the tool has in fokalsTools(), and the name of its function. */
  key: string;
  /** The endpoint it calls: POST https://api.fokals.com/v1/<endpoint>. */
  endpoint: string;
  title: string;
  paid: boolean;
  description: string;
  inputSchema: Record<string, unknown>;
  /** The API's own example call. */
  example: Record<string, unknown>;
};

export const API_VERSION = "v1";

/** Every tool, by the key it has in fokalsTools(). */
export const TOOL_NAMES = ["findCompanies","countCompanies","enrichCompanies","companyProfile","companyChanges","searchJobPostings","similarCompanies","companyConnections","identifyCompany","marketBreakdown","vendorScorecard","companiesLikeCustomers","companyHealth","likelyNext","listFilters","accountBalance"] as const;
export type FokalsToolName = (typeof TOOL_NAMES)[number];

export const SPECS: readonly (ToolSpec & { key: FokalsToolName })[] = [
  {
    "key": "findCompanies",
    "endpoint": "find_companies",
    "title": "Find companies by signal",
    "paid": true,
    "description": "Finds companies by what they show: a technology they run, a buying topic they show signs of, whether they are hiring, an announcement they made lately (funding, a launch, a partnership, a leadership change), a project their job ads state (a migration, a first team, a certification, an expansion, an AI build), a change on their pricing page, how ready their website is for AI agents, their health this week (a band, or a shift in positioning), their industry, business model or country, and how lately their website changed. The companies whose website changed most lately come first. Give at least one filter; countCompanies says how many match, free, before this is called. At most 100 companies a call. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "technology": {
          "description": "A technology the company runs on its website, by name: \"Shopify\", \"HubSpot\". The stance a website states towards AI is found the same way: \"Blocks GPTBot (OpenAI)\", \"llms.txt for AI assistants\", \"WebMCP tools for AI agents\".",
          "type": "string",
          "minLength": 1,
          "maxLength": 80
        },
        "buying_topic": {
          "description": "A buying topic the company shows signs of, by name or id: \"Marketing automation\". listFilters with kind buying_topics has them all.",
          "type": "string",
          "minLength": 1,
          "maxLength": 80
        },
        "hiring": {
          "description": "true keeps only companies with open roles now.",
          "type": "boolean"
        },
        "industry": {
          "description": "One of: fashion_apparel, beauty_personal_care, health_wellness, food_beverage, home_garden, consumer_electronics, software_saas, finance_insurance, education, travel_hospitality, automotive, real_estate, entertainment_media, gaming, sports_outdoors, retail_marketplace, professional_services, telecom_utilities, nonprofit_public, pets, other.",
          "type": "string",
          "minLength": 1,
          "maxLength": 60
        },
        "business_model": {
          "description": "One of: b2b, b2c, both.",
          "type": "string",
          "minLength": 1,
          "maxLength": 20
        },
        "country": {
          "description": "A country as a two-letter code: US, GB, DE. Matches the head office's country where it is known, otherwise the main market the company's website serves: country and market_country in an answer.",
          "type": "string",
          "pattern": "^[A-Za-z]{2}$"
        },
        "listed": {
          "description": "true keeps only companies with a stock exchange listing, their own or a parent's.",
          "type": "boolean"
        },
        "changed_since": {
          "description": "Keeps only companies whose website changed on or after this date, YYYY-MM-DD.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "region": {
          "description": "The state or province of the head office: \"CA\", \"Ontario\". Held where a filing or the company's own website gives it.",
          "type": "string",
          "minLength": 2,
          "maxLength": 60
        },
        "sic": {
          "description": "A four-digit SIC industry code. Held for companies that file with the SEC.",
          "type": "string",
          "pattern": "^\\d{4}$"
        },
        "announcement": {
          "description": "A type of announcement the company made lately. One of: product_launch, partnership, acquisition_made, acquired_or_merged, funding_round, leadership_change, layoffs_restructuring, expansion, incident, financial_results, award_or_recognition, regulatory_or_legal.",
          "type": "string",
          "minLength": 1,
          "maxLength": 40
        },
        "announced_since": {
          "description": "With announcement: made on or after this date, YYYY-MM-DD. 30 days ago unless given.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "name_contains": {
          "description": "Text the company's name or website address holds.",
          "type": "string",
          "minLength": 2,
          "maxLength": 80
        },
        "agent_ready_min": {
          "description": "Keeps only companies whose agent readiness score is at least this, from 50 to 100. The score, from 0 to 100, says how ready a company's website is for AI agents: to be found, to show its prices, to sell and to be acted on.",
          "type": "integer",
          "minimum": 50,
          "maximum": 100
        },
        "agent_ready_part": {
          "description": "One of the four parts of agent readiness that must be strong: find, price, buy or act. With agent_ready_min, or alone for a score of 50 or more.",
          "type": "string",
          "enum": [
            "find",
            "price",
            "buy",
            "act"
          ]
        },
        "agent_ready_part_min": {
          "description": "With agent_ready_part: the least points of its 25 that part holds. 15 unless given.",
          "type": "integer",
          "minimum": 1,
          "maximum": 25
        },
        "project": {
          "description": "A project the company's job ads state: migration (a move from one system to another), first_team (the first team of a function), compliance (work towards a certification), expansion (into a new country or region), ai_build (building an AI product).",
          "type": "string",
          "enum": [
            "migration",
            "first_team",
            "compliance",
            "expansion",
            "ai_build"
          ]
        },
        "project_detail": {
          "description": "With project, what narrows it. migration: a system by name, on either side (\"Salesforce\"), or \"to HubSpot\", \"from Salesforce\", \"Salesforce to HubSpot\". first_team: a job function (data_analytics, sales). compliance: soc2, iso27001, hipaa, pci, fedramp, gdpr. expansion: a two-letter country code or a region (europe, dach). ai_build: agents, llm, ml, ai.",
          "type": "string",
          "minLength": 1,
          "maxLength": 80
        },
        "project_days": {
          "description": "With project: stated in job ads on a board in the last this many days. 90 unless given.",
          "type": "integer",
          "minimum": 7,
          "maximum": 365
        },
        "price_change": {
          "description": "A change the company's pricing page showed lately: price_raised, price_cut, free_plan_removed, free_plan_added, usage_pricing_added, ai_addon_added.",
          "type": "string",
          "enum": [
            "price_raised",
            "price_cut",
            "free_plan_removed",
            "free_plan_added",
            "usage_pricing_added",
            "ai_addon_added"
          ]
        },
        "price_changed_since": {
          "description": "With price_change: on or after this date, YYYY-MM-DD. 90 days ago unless given.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "health_band": {
          "description": "The company's health in the latest week: distress (signs of distress), watch (worth watching), growing or breakout (breaking out).",
          "type": "string",
          "enum": [
            "distress",
            "watch",
            "growing",
            "breakout"
          ]
        },
        "shift": {
          "description": "A shift in positioning the company shows in the latest week: upmarket, downmarket, ai_pivot (turning to AI), new_buyer (selling to a new buyer), price_up or price_down.",
          "type": "string",
          "enum": [
            "upmarket",
            "downmarket",
            "ai_pivot",
            "new_buyer",
            "price_up",
            "price_down"
          ]
        },
        "limit": {
          "description": "How many companies to return. 25 unless given.",
          "type": "integer",
          "minimum": 1,
          "maximum": 1000
        },
        "cursor": {
          "description": "next_cursor of the answer before, to carry on where it ended.",
          "type": "string",
          "maxLength": 2000
        },
        "max_usd": {
          "description": "The most the person has agreed to pay for this call, in US dollars. Leave it out unless a call has returned its price and the person agreed to it.",
          "type": "number",
          "minimum": 0,
          "maximum": 100000
        }
      },
      "additionalProperties": false
    },
    "example": {
      "technology": "HubSpot",
      "hiring": true,
      "country": "US",
      "limit": 10
    }
  },
  {
    "key": "countCompanies",
    "endpoint": "count_companies",
    "title": "Count companies",
    "paid": false,
    "description": "Counts the companies that match a set of filters, and says what it would cost to get them. Free. Takes the same filters as findCompanies. Use it before findCompanies, so the person knows the size and the price of what they are asking for.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "technology": {
          "description": "A technology the company runs on its website, by name: \"Shopify\", \"HubSpot\". The stance a website states towards AI is found the same way: \"Blocks GPTBot (OpenAI)\", \"llms.txt for AI assistants\", \"WebMCP tools for AI agents\".",
          "type": "string",
          "minLength": 1,
          "maxLength": 80
        },
        "buying_topic": {
          "description": "A buying topic the company shows signs of, by name or id: \"Marketing automation\". listFilters with kind buying_topics has them all.",
          "type": "string",
          "minLength": 1,
          "maxLength": 80
        },
        "hiring": {
          "description": "true keeps only companies with open roles now.",
          "type": "boolean"
        },
        "industry": {
          "description": "One of: fashion_apparel, beauty_personal_care, health_wellness, food_beverage, home_garden, consumer_electronics, software_saas, finance_insurance, education, travel_hospitality, automotive, real_estate, entertainment_media, gaming, sports_outdoors, retail_marketplace, professional_services, telecom_utilities, nonprofit_public, pets, other.",
          "type": "string",
          "minLength": 1,
          "maxLength": 60
        },
        "business_model": {
          "description": "One of: b2b, b2c, both.",
          "type": "string",
          "minLength": 1,
          "maxLength": 20
        },
        "country": {
          "description": "A country as a two-letter code: US, GB, DE. Matches the head office's country where it is known, otherwise the main market the company's website serves: country and market_country in an answer.",
          "type": "string",
          "pattern": "^[A-Za-z]{2}$"
        },
        "listed": {
          "description": "true keeps only companies with a stock exchange listing, their own or a parent's.",
          "type": "boolean"
        },
        "changed_since": {
          "description": "Keeps only companies whose website changed on or after this date, YYYY-MM-DD.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "region": {
          "description": "The state or province of the head office: \"CA\", \"Ontario\". Held where a filing or the company's own website gives it.",
          "type": "string",
          "minLength": 2,
          "maxLength": 60
        },
        "sic": {
          "description": "A four-digit SIC industry code. Held for companies that file with the SEC.",
          "type": "string",
          "pattern": "^\\d{4}$"
        },
        "announcement": {
          "description": "A type of announcement the company made lately. One of: product_launch, partnership, acquisition_made, acquired_or_merged, funding_round, leadership_change, layoffs_restructuring, expansion, incident, financial_results, award_or_recognition, regulatory_or_legal.",
          "type": "string",
          "minLength": 1,
          "maxLength": 40
        },
        "announced_since": {
          "description": "With announcement: made on or after this date, YYYY-MM-DD. 30 days ago unless given.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "name_contains": {
          "description": "Text the company's name or website address holds.",
          "type": "string",
          "minLength": 2,
          "maxLength": 80
        },
        "agent_ready_min": {
          "description": "Keeps only companies whose agent readiness score is at least this, from 50 to 100. The score, from 0 to 100, says how ready a company's website is for AI agents: to be found, to show its prices, to sell and to be acted on.",
          "type": "integer",
          "minimum": 50,
          "maximum": 100
        },
        "agent_ready_part": {
          "description": "One of the four parts of agent readiness that must be strong: find, price, buy or act. With agent_ready_min, or alone for a score of 50 or more.",
          "type": "string",
          "enum": [
            "find",
            "price",
            "buy",
            "act"
          ]
        },
        "agent_ready_part_min": {
          "description": "With agent_ready_part: the least points of its 25 that part holds. 15 unless given.",
          "type": "integer",
          "minimum": 1,
          "maximum": 25
        },
        "project": {
          "description": "A project the company's job ads state: migration (a move from one system to another), first_team (the first team of a function), compliance (work towards a certification), expansion (into a new country or region), ai_build (building an AI product).",
          "type": "string",
          "enum": [
            "migration",
            "first_team",
            "compliance",
            "expansion",
            "ai_build"
          ]
        },
        "project_detail": {
          "description": "With project, what narrows it. migration: a system by name, on either side (\"Salesforce\"), or \"to HubSpot\", \"from Salesforce\", \"Salesforce to HubSpot\". first_team: a job function (data_analytics, sales). compliance: soc2, iso27001, hipaa, pci, fedramp, gdpr. expansion: a two-letter country code or a region (europe, dach). ai_build: agents, llm, ml, ai.",
          "type": "string",
          "minLength": 1,
          "maxLength": 80
        },
        "project_days": {
          "description": "With project: stated in job ads on a board in the last this many days. 90 unless given.",
          "type": "integer",
          "minimum": 7,
          "maximum": 365
        },
        "price_change": {
          "description": "A change the company's pricing page showed lately: price_raised, price_cut, free_plan_removed, free_plan_added, usage_pricing_added, ai_addon_added.",
          "type": "string",
          "enum": [
            "price_raised",
            "price_cut",
            "free_plan_removed",
            "free_plan_added",
            "usage_pricing_added",
            "ai_addon_added"
          ]
        },
        "price_changed_since": {
          "description": "With price_change: on or after this date, YYYY-MM-DD. 90 days ago unless given.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "health_band": {
          "description": "The company's health in the latest week: distress (signs of distress), watch (worth watching), growing or breakout (breaking out).",
          "type": "string",
          "enum": [
            "distress",
            "watch",
            "growing",
            "breakout"
          ]
        },
        "shift": {
          "description": "A shift in positioning the company shows in the latest week: upmarket, downmarket, ai_pivot (turning to AI), new_buyer (selling to a new buyer), price_up or price_down.",
          "type": "string",
          "enum": [
            "upmarket",
            "downmarket",
            "ai_pivot",
            "new_buyer",
            "price_up",
            "price_down"
          ]
        }
      },
      "additionalProperties": false
    },
    "example": {
      "technology": "HubSpot",
      "hiring": true,
      "country": "US"
    }
  },
  {
    "key": "enrichCompanies",
    "endpoint": "enrich_companies",
    "title": "Enrich a list of companies",
    "paid": true,
    "description": "Takes the person's own list of companies, by website address or name, and returns what is held on each: industry and business model, the technologies its website runs, open roles and hiring in the last 30 days, buying topics it shows signs of, its agent readiness score, the projects its job ads state, its health band this week, and when its website last changed. Use it to fill in, score or rank a list of accounts, leads or customers. A website address finds a company more surely than a name. At most 100 companies a call; send a longer list in parts. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "companies": {
          "minItems": 1,
          "maxItems": 1000,
          "type": "array",
          "items": {
            "type": "string",
            "minLength": 1,
            "maxLength": 200
          },
          "description": "The person's own companies, each as a website address (\"acme.com\"), a name (\"Acme Inc\") or an id from an earlier answer."
        },
        "max_usd": {
          "description": "The most the person has agreed to pay for this call, in US dollars. Leave it out unless a call has returned its price and the person agreed to it.",
          "type": "number",
          "minimum": 0,
          "maximum": 100000
        }
      },
      "required": [
        "companies"
      ],
      "additionalProperties": false
    },
    "example": {
      "companies": [
        "stripe.com",
        "shopify.com"
      ]
    }
  },
  {
    "key": "companyProfile",
    "endpoint": "company_profile",
    "title": "Company profile",
    "paid": true,
    "description": "One company in depth: what it sells and to whom, every technology its website runs and since when, its open roles by function, seniority and country with the latest postings, the buying topics it shows signs of with the signals behind them, its latest announcements by type, the latest changes on its website, how its traffic ranks, its agent readiness score with the evidence behind it, the projects its job ads state, the back-office software they name that its website does not show, its weekly health with the reasons, and the technologies it is likeliest to add next. Use it to research an account before a call, to explain why a company is on a list, or to compare companies. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "company": {
          "type": "string",
          "minLength": 1,
          "maxLength": 200,
          "description": "The company, as a website address (\"acme.com\"), a name or an id from an earlier answer."
        },
        "sections": {
          "description": "Which parts to return: technology, hiring, buying_topics, announcements, changes, traffic, agent_readiness, projects, internal_tools, health, likelyNext. All of them unless given; ask for fewer to keep the answer short.",
          "minItems": 1,
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "technology",
              "hiring",
              "buying_topics",
              "announcements",
              "changes",
              "traffic",
              "agent_readiness",
              "projects",
              "internal_tools",
              "health",
              "likely_next"
            ]
          }
        },
        "max_usd": {
          "description": "The most the person has agreed to pay for this call, in US dollars. Leave it out unless a call has returned its price and the person agreed to it.",
          "type": "number",
          "minimum": 0,
          "maximum": 100000
        }
      },
      "required": [
        "company"
      ],
      "additionalProperties": false
    },
    "example": {
      "company": "stripe.com"
    }
  },
  {
    "key": "companyChanges",
    "endpoint": "company_changes",
    "title": "What changed at my companies",
    "paid": true,
    "description": "What is new at the person's own companies since a date: changes on each website (a technology added or dropped, a new market, language, currency, page or app, a price raised or cut, a plan or a free plan added or dropped, a sales motion or customer size that moved, a title reworded) and the company's announcements by type (funding, launches, partnerships, leadership changes, expansion). Each change comes in plain words. Use it for a weekly check on a list of accounts, or to find a timely reason to get in touch. A company with nothing new costs nothing and is named as such. At most 100 companies a call. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "companies": {
          "minItems": 1,
          "maxItems": 1000,
          "type": "array",
          "items": {
            "type": "string",
            "minLength": 1,
            "maxLength": 200
          },
          "description": "The person's own companies, each as a website address (\"acme.com\"), a name or an id from an earlier answer."
        },
        "since": {
          "description": "What changed on or after this date, YYYY-MM-DD. 7 days ago unless given; at most 90 days back.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "max_usd": {
          "description": "The most the person has agreed to pay for this call, in US dollars. Leave it out unless a call has returned its price and the person agreed to it.",
          "type": "number",
          "minimum": 0,
          "maximum": 100000
        }
      },
      "required": [
        "companies"
      ],
      "additionalProperties": false
    },
    "example": {
      "companies": [
        "stripe.com",
        "shopify.com"
      ],
      "since": "2026-10-01"
    }
  },
  {
    "key": "searchJobPostings",
    "endpoint": "search_job_postings",
    "title": "Search job postings",
    "paid": true,
    "description": "Searches the open job postings of companies: by words in the title, function, seniority, country, remote or on site, a technology the posting asks for, the hiring company's industry, pay, and how lately the posting appeared. The latest postings come first, each with its company, function, seniority, pay where stated, and link. Use it to find who is hiring for a role, to spot a team being built, or to check hiring at a list of accounts. Give at least one filter. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "title": {
          "description": "Text the job title holds: \"account executive\", \"data engineer\".",
          "type": "string",
          "minLength": 2,
          "maxLength": 80
        },
        "job_function": {
          "description": "One of: software_engineering, hardware_engineering, data_analytics, data_science_ml, product_management, design, marketing_brand, marketing_performance, marketing_content_social, sales, sales_development, customer_success_support, operations, supply_chain_logistics, manufacturing_production, finance_accounting, legal_compliance, people_hr, it_security, research_science, healthcare_clinical, retail_store, hospitality_food, education_training, executive_leadership, other.",
          "type": "string",
          "minLength": 1,
          "maxLength": 40
        },
        "seniority": {
          "description": "One of: intern, entry, mid, senior, lead_principal, manager, director, vp, c_level.",
          "type": "string",
          "minLength": 1,
          "maxLength": 20
        },
        "country": {
          "description": "Where the job is, as a two-letter country code: US, GB, DE.",
          "type": "string",
          "pattern": "^[A-Za-z]{2}$"
        },
        "work_mode": {
          "description": "onsite, hybrid or remote.",
          "type": "string",
          "enum": [
            "onsite",
            "hybrid",
            "remote"
          ]
        },
        "technology": {
          "description": "A technology the posting asks for, by name: \"Snowflake\", \"Salesforce\".",
          "type": "string",
          "minLength": 1,
          "maxLength": 80
        },
        "industry": {
          "description": "The hiring company's industry. One of: fashion_apparel, beauty_personal_care, health_wellness, food_beverage, home_garden, consumer_electronics, software_saas, finance_insurance, education, travel_hospitality, automotive, real_estate, entertainment_media, gaming, sports_outdoors, retail_marketplace, professional_services, telecom_utilities, nonprofit_public, pets, other.",
          "type": "string",
          "minLength": 1,
          "maxLength": 60
        },
        "seen_since": {
          "description": "Only postings first seen on or after this date, YYYY-MM-DD.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "min_salary_usd": {
          "description": "Only postings that state pay of at least this much a year, in US dollars.",
          "type": "number",
          "minimum": 1,
          "maximum": 10000000
        },
        "companies": {
          "description": "Search only at these companies (the person's own list), each as a website address, a name or an id.",
          "minItems": 1,
          "maxItems": 1000,
          "type": "array",
          "items": {
            "type": "string",
            "minLength": 1,
            "maxLength": 200
          }
        },
        "limit": {
          "description": "How many postings to return. 20 unless given, 50 at most.",
          "type": "integer",
          "minimum": 1,
          "maximum": 50
        },
        "cursor": {
          "description": "next_cursor of the answer before, to carry on where it ended.",
          "type": "string",
          "maxLength": 2000
        },
        "max_usd": {
          "description": "The most the person has agreed to pay for this call, in US dollars. Leave it out unless a call has returned its price and the person agreed to it.",
          "type": "number",
          "minimum": 0,
          "maximum": 100000
        }
      },
      "additionalProperties": false
    },
    "example": {
      "title": "data engineer",
      "country": "US",
      "work_mode": "remote",
      "limit": 10
    }
  },
  {
    "key": "similarCompanies",
    "endpoint": "similar_companies",
    "title": "Similar companies and competitors",
    "paid": true,
    "description": "Finds companies like a given one, the most alike first, each with what it shares with the one given: the labels in common (business model, offering, customer size, pricing, growth stage, home country) and the technologies in common. Ask for lookalikes to grow a list from a best customer, or for competitors to see who sells the same kind of thing to the same kind of customer. The company given is not charged. At most 100 companies a call. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "company": {
          "type": "string",
          "minLength": 1,
          "maxLength": 200,
          "description": "The company to start from, as a website address, a name or an id."
        },
        "kind": {
          "description": "lookalikes (unless given): companies of the same kind, to sell to as one sells to this one. competitors: companies that sell the same kind of thing to the same kind of customer.",
          "type": "string",
          "enum": [
            "lookalikes",
            "competitors"
          ]
        },
        "limit": {
          "description": "How many companies to return. 10 unless given.",
          "type": "integer",
          "minimum": 1,
          "maximum": 1000
        },
        "max_usd": {
          "description": "The most the person has agreed to pay for this call, in US dollars. Leave it out unless a call has returned its price and the person agreed to it.",
          "type": "number",
          "minimum": 0,
          "maximum": 100000
        }
      },
      "required": [
        "company"
      ],
      "additionalProperties": false
    },
    "example": {
      "company": "shopify.com",
      "kind": "lookalikes",
      "limit": 10
    }
  },
  {
    "key": "companyConnections",
    "endpoint": "company_connections",
    "title": "Customers, partners, integrations and investors",
    "paid": true,
    "description": "The other companies a company's own website names, and as what: its customers, partners, integrations and investors, each by website and, where held, by name. And the reverse: the companies whose websites name this one, and as what, which shows whose customer or partner it is. Taken from links a page puts under a heading of its own (\"Trusted by\", \"Our partners\", \"Integrations\", \"Backed by\") and seen in the last 60 days; a company whose pages name nobody that way has none. Only the company asked about is charged. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "company": {
          "type": "string",
          "minLength": 1,
          "maxLength": 200,
          "description": "The company, as a website address, a name or an id."
        },
        "max_usd": {
          "description": "The most the person has agreed to pay for this call, in US dollars. Leave it out unless a call has returned its price and the person agreed to it.",
          "type": "number",
          "minimum": 0,
          "maximum": 100000
        }
      },
      "required": [
        "company"
      ],
      "additionalProperties": false
    },
    "example": {
      "company": "stripe.com"
    }
  },
  {
    "key": "identifyCompany",
    "endpoint": "identify_company",
    "title": "Which company is meant",
    "paid": false,
    "description": "Lists the companies a name or a website address could mean, the surest first, each with its website, country, industry and whether it has been read. Free. Use it when a name is ambiguous or a paid tool said a company is not held, then pass the id of the right one to the other tools.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "company": {
          "type": "string",
          "minLength": 2,
          "maxLength": 200,
          "description": "A company name, part of one, or a website address."
        }
      },
      "required": [
        "company"
      ],
      "additionalProperties": false
    },
    "example": {
      "company": "Stripe"
    }
  },
  {
    "key": "marketBreakdown",
    "endpoint": "market_breakdown",
    "title": "Market breakdown",
    "paid": true,
    "description": "Answers a question about a market as a whole: how the companies that match a set of filters divide by one attribute (industry, business_model, country, growth_stage, customer_size, price_tier, sales_motion, pricing_model, region, sic, technology, buying_topic), with the number of companies under each value and the total. Takes the same filters as findCompanies, or none for every company held. Use it to size a segment, to see which technologies or buying topics lead in an industry, or which countries a kind of company is in. It returns counts, not companies. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "technology": {
          "description": "A technology the company runs on its website, by name: \"Shopify\", \"HubSpot\". The stance a website states towards AI is found the same way: \"Blocks GPTBot (OpenAI)\", \"llms.txt for AI assistants\", \"WebMCP tools for AI agents\".",
          "type": "string",
          "minLength": 1,
          "maxLength": 80
        },
        "buying_topic": {
          "description": "A buying topic the company shows signs of, by name or id: \"Marketing automation\". listFilters with kind buying_topics has them all.",
          "type": "string",
          "minLength": 1,
          "maxLength": 80
        },
        "hiring": {
          "description": "true keeps only companies with open roles now.",
          "type": "boolean"
        },
        "industry": {
          "description": "One of: fashion_apparel, beauty_personal_care, health_wellness, food_beverage, home_garden, consumer_electronics, software_saas, finance_insurance, education, travel_hospitality, automotive, real_estate, entertainment_media, gaming, sports_outdoors, retail_marketplace, professional_services, telecom_utilities, nonprofit_public, pets, other.",
          "type": "string",
          "minLength": 1,
          "maxLength": 60
        },
        "business_model": {
          "description": "One of: b2b, b2c, both.",
          "type": "string",
          "minLength": 1,
          "maxLength": 20
        },
        "country": {
          "description": "A country as a two-letter code: US, GB, DE. Matches the head office's country where it is known, otherwise the main market the company's website serves: country and market_country in an answer.",
          "type": "string",
          "pattern": "^[A-Za-z]{2}$"
        },
        "listed": {
          "description": "true keeps only companies with a stock exchange listing, their own or a parent's.",
          "type": "boolean"
        },
        "changed_since": {
          "description": "Keeps only companies whose website changed on or after this date, YYYY-MM-DD.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "region": {
          "description": "The state or province of the head office: \"CA\", \"Ontario\". Held where a filing or the company's own website gives it.",
          "type": "string",
          "minLength": 2,
          "maxLength": 60
        },
        "sic": {
          "description": "A four-digit SIC industry code. Held for companies that file with the SEC.",
          "type": "string",
          "pattern": "^\\d{4}$"
        },
        "announcement": {
          "description": "A type of announcement the company made lately. One of: product_launch, partnership, acquisition_made, acquired_or_merged, funding_round, leadership_change, layoffs_restructuring, expansion, incident, financial_results, award_or_recognition, regulatory_or_legal.",
          "type": "string",
          "minLength": 1,
          "maxLength": 40
        },
        "announced_since": {
          "description": "With announcement: made on or after this date, YYYY-MM-DD. 30 days ago unless given.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "name_contains": {
          "description": "Text the company's name or website address holds.",
          "type": "string",
          "minLength": 2,
          "maxLength": 80
        },
        "agent_ready_min": {
          "description": "Keeps only companies whose agent readiness score is at least this, from 50 to 100. The score, from 0 to 100, says how ready a company's website is for AI agents: to be found, to show its prices, to sell and to be acted on.",
          "type": "integer",
          "minimum": 50,
          "maximum": 100
        },
        "agent_ready_part": {
          "description": "One of the four parts of agent readiness that must be strong: find, price, buy or act. With agent_ready_min, or alone for a score of 50 or more.",
          "type": "string",
          "enum": [
            "find",
            "price",
            "buy",
            "act"
          ]
        },
        "agent_ready_part_min": {
          "description": "With agent_ready_part: the least points of its 25 that part holds. 15 unless given.",
          "type": "integer",
          "minimum": 1,
          "maximum": 25
        },
        "project": {
          "description": "A project the company's job ads state: migration (a move from one system to another), first_team (the first team of a function), compliance (work towards a certification), expansion (into a new country or region), ai_build (building an AI product).",
          "type": "string",
          "enum": [
            "migration",
            "first_team",
            "compliance",
            "expansion",
            "ai_build"
          ]
        },
        "project_detail": {
          "description": "With project, what narrows it. migration: a system by name, on either side (\"Salesforce\"), or \"to HubSpot\", \"from Salesforce\", \"Salesforce to HubSpot\". first_team: a job function (data_analytics, sales). compliance: soc2, iso27001, hipaa, pci, fedramp, gdpr. expansion: a two-letter country code or a region (europe, dach). ai_build: agents, llm, ml, ai.",
          "type": "string",
          "minLength": 1,
          "maxLength": 80
        },
        "project_days": {
          "description": "With project: stated in job ads on a board in the last this many days. 90 unless given.",
          "type": "integer",
          "minimum": 7,
          "maximum": 365
        },
        "price_change": {
          "description": "A change the company's pricing page showed lately: price_raised, price_cut, free_plan_removed, free_plan_added, usage_pricing_added, ai_addon_added.",
          "type": "string",
          "enum": [
            "price_raised",
            "price_cut",
            "free_plan_removed",
            "free_plan_added",
            "usage_pricing_added",
            "ai_addon_added"
          ]
        },
        "price_changed_since": {
          "description": "With price_change: on or after this date, YYYY-MM-DD. 90 days ago unless given.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "health_band": {
          "description": "The company's health in the latest week: distress (signs of distress), watch (worth watching), growing or breakout (breaking out).",
          "type": "string",
          "enum": [
            "distress",
            "watch",
            "growing",
            "breakout"
          ]
        },
        "shift": {
          "description": "A shift in positioning the company shows in the latest week: upmarket, downmarket, ai_pivot (turning to AI), new_buyer (selling to a new buyer), price_up or price_down.",
          "type": "string",
          "enum": [
            "upmarket",
            "downmarket",
            "ai_pivot",
            "new_buyer",
            "price_up",
            "price_down"
          ]
        },
        "by": {
          "type": "string",
          "enum": [
            "industry",
            "business_model",
            "country",
            "growth_stage",
            "customer_size",
            "price_tier",
            "sales_motion",
            "pricing_model",
            "region",
            "sic",
            "technology",
            "buying_topic"
          ],
          "description": "The attribute to divide the companies by. country is the head office's country where it is known, otherwise the main market the company's website serves; region is the head office's state or province."
        },
        "limit": {
          "description": "How many values to return, the largest first. 15 unless given.",
          "type": "integer",
          "minimum": 1,
          "maximum": 50
        },
        "max_usd": {
          "description": "The most the person has agreed to pay for this call, in US dollars. Leave it out unless a call has returned its price and the person agreed to it.",
          "type": "number",
          "minimum": 0,
          "maximum": 100000
        }
      },
      "required": [
        "by"
      ],
      "additionalProperties": false
    },
    "example": {
      "technology": "Shopify",
      "by": "country",
      "limit": 10
    }
  },
  {
    "key": "vendorScorecard",
    "endpoint": "vendor_scorecard",
    "title": "Vendor scorecard",
    "paid": true,
    "description": "A technology vendor's scorecard, month by month: how many companies ran it at the start of each month, how many took it up and how many dropped it, the net change and the churn rate, and the rival tools the companies that took it up came from and the ones that dropped it moved to; with the last 30 days to today beside them. Divide it by company size, industry, growth stage or country to see where it wins and where it loses (industry and growth stage are the companies' labels today), and ask for the other technologies of its category ranked by net gain. A month marked partial was not observed from its first day. Use it for competitive research on a vendor, to see where a rival is losing customers, or to size a vendor's momentum. It returns counts, not companies. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "technology": {
          "type": "string",
          "minLength": 1,
          "maxLength": 80,
          "description": "The technology, by name or id: \"HubSpot\", \"Shopify\", \"Intercom\"."
        },
        "months": {
          "description": "How many closed months to return, the latest first. 6 unless given.",
          "type": "integer",
          "minimum": 1,
          "maximum": 12
        },
        "segment": {
          "description": "How the companies are divided: all (unless given), size (by employees), industry, growth_stage or country. Divided, each month comes once for each segment, the 20 largest first.",
          "type": "string",
          "enum": [
            "all",
            "size",
            "industry",
            "growth_stage",
            "country"
          ]
        },
        "include_rivals_in_category": {
          "description": "true adds the technologies of the same category, ranked by companies gained net in the latest month held.",
          "type": "boolean"
        },
        "max_usd": {
          "description": "The most the person has agreed to pay for this call, in US dollars. Leave it out unless a call has returned its price and the person agreed to it.",
          "type": "number",
          "minimum": 0,
          "maximum": 100000
        }
      },
      "required": [
        "technology"
      ],
      "additionalProperties": false
    },
    "example": {
      "technology": "HubSpot",
      "months": 6,
      "segment": "size"
    }
  },
  {
    "key": "companiesLikeCustomers",
    "endpoint": "companies_like_customers",
    "title": "Companies like my customers",
    "paid": true,
    "description": "Finds the companies that look today the way the person's own customers looked when they bought. Give up to 20 customers, by website, name or id, each with the day it bought where known, and the technology they bought where there is one. The answer also says for which customers a buying moment was found, and what most of them did before buying. Results are strongest when the customers' buying dates are known or a technology is given; without either, companies are matched on how alike they are to the customers today. The customers, and companies already running the technology, are left out. At most 100 companies a call. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "customers": {
          "minItems": 1,
          "maxItems": 20,
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "company": {
                "type": "string",
                "minLength": 1,
                "maxLength": 200,
                "description": "A customer, as a website address (\"acme.com\"), a name or an id from an earlier answer."
              },
              "bought_on": {
                "description": "The day it bought, YYYY-MM-DD, where known.",
                "type": "string",
                "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
              }
            },
            "required": [
              "company"
            ],
            "additionalProperties": false
          },
          "description": "The person's own customers, 1 to 20, each with the day it bought where known."
        },
        "technology": {
          "description": "The technology the customers bought, by name, where it is one: \"HubSpot\". Companies already running it are left out.",
          "type": "string",
          "minLength": 1,
          "maxLength": 80
        },
        "country": {
          "description": "Only companies in this country, as a two-letter code. Matches the head office's country where it is known, otherwise the main market the company's website serves.",
          "type": "string",
          "pattern": "^[A-Za-z]{2}$"
        },
        "industry": {
          "description": "Only companies of this industry. One of: fashion_apparel, beauty_personal_care, health_wellness, food_beverage, home_garden, consumer_electronics, software_saas, finance_insurance, education, travel_hospitality, automotive, real_estate, entertainment_media, gaming, sports_outdoors, retail_marketplace, professional_services, telecom_utilities, nonprofit_public, pets, other.",
          "type": "string",
          "minLength": 1,
          "maxLength": 60
        },
        "limit": {
          "description": "How many companies to return. 25 unless given.",
          "type": "integer",
          "minimum": 1,
          "maximum": 100
        },
        "max_usd": {
          "description": "The most the person has agreed to pay for this call, in US dollars. Leave it out unless a call has returned its price and the person agreed to it.",
          "type": "number",
          "minimum": 0,
          "maximum": 100000
        }
      },
      "required": [
        "customers"
      ],
      "additionalProperties": false
    },
    "example": {
      "customers": [
        {
          "company": "notion.so",
          "bought_on": "2026-09-15"
        },
        {
          "company": "figma.com"
        },
        {
          "company": "linear.app"
        }
      ],
      "technology": "HubSpot",
      "limit": 25
    }
  },
  {
    "key": "companyHealth",
    "endpoint": "company_health",
    "title": "Company health",
    "paid": true,
    "description": "A weekly health reading for each of the person's companies: a band in words (signs of distress, worth watching, steady, growing, breaking out), a distress score and a breakout score from 0 to 100, the reasons in plain words, the shifts in positioning it shows (moving upmarket or downmarket, turning to AI, selling to a new buyer, prices going up or down), and the scores week by week. Use it to spot accounts at risk or taking off, and to time an approach. A company with no health reading costs nothing and is named as such. At most 100 companies a call. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "companies": {
          "minItems": 1,
          "maxItems": 1000,
          "type": "array",
          "items": {
            "type": "string",
            "minLength": 1,
            "maxLength": 200
          },
          "description": "The person's own companies, each as a website address (\"acme.com\"), a name or an id from an earlier answer."
        },
        "weeks": {
          "description": "How many weeks of scores to return, oldest first. 13 unless given.",
          "type": "integer",
          "minimum": 1,
          "maximum": 13
        },
        "max_usd": {
          "description": "The most the person has agreed to pay for this call, in US dollars. Leave it out unless a call has returned its price and the person agreed to it.",
          "type": "number",
          "minimum": 0,
          "maximum": 100000
        }
      },
      "required": [
        "companies"
      ],
      "additionalProperties": false
    },
    "example": {
      "companies": [
        "stripe.com",
        "shopify.com"
      ],
      "weeks": 13
    }
  },
  {
    "key": "likelyNext",
    "endpoint": "likely_next",
    "title": "Likely next technologies",
    "paid": true,
    "description": "What companies are likely to add next. Give the person's own companies to get, for each, the technologies it is likeliest to add in the coming weeks, each with an estimated likelihood (0 to 1), with the support counts behind it: the changes behind it in plain words, how many companies made the same change and how many of them then added the technology. A likelihood is an estimate, never a certainty. Or give a technology to get the companies likeliest to add it next, likeliest first, a page at a time, with the changes that most often come before it. Use it to reach an account before it buys, or to build a list of the next buyers of a product. At most 100 companies a call. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "companies": {
          "description": "The person's own companies, each as a website address, a name or an id: the technologies each is likeliest to add next. Give these or a technology.",
          "minItems": 1,
          "maxItems": 1000,
          "type": "array",
          "items": {
            "type": "string",
            "minLength": 1,
            "maxLength": 200
          }
        },
        "technology": {
          "description": "A technology, by name: \"HubSpot\". The companies likeliest to add it next. Give this or companies.",
          "type": "string",
          "minLength": 1,
          "maxLength": 80
        },
        "country": {
          "description": "With technology: only companies in this country. Matches the head office's country where it is known, otherwise the main market the company's website serves.",
          "type": "string",
          "pattern": "^[A-Za-z]{2}$"
        },
        "industry": {
          "description": "With technology: only companies of this industry. One of: fashion_apparel, beauty_personal_care, health_wellness, food_beverage, home_garden, consumer_electronics, software_saas, finance_insurance, education, travel_hospitality, automotive, real_estate, entertainment_media, gaming, sports_outdoors, retail_marketplace, professional_services, telecom_utilities, nonprofit_public, pets, other.",
          "type": "string",
          "minLength": 1,
          "maxLength": 60
        },
        "limit": {
          "description": "With technology: how many companies to return. 25 unless given.",
          "type": "integer",
          "minimum": 1,
          "maximum": 100
        },
        "cursor": {
          "description": "With technology: next_cursor of the answer before, to carry on where it ended.",
          "type": "string",
          "maxLength": 200
        },
        "max_usd": {
          "description": "The most the person has agreed to pay for this call, in US dollars. Leave it out unless a call has returned its price and the person agreed to it.",
          "type": "number",
          "minimum": 0,
          "maximum": 100000
        }
      },
      "additionalProperties": false
    },
    "example": {
      "technology": "Klaviyo",
      "country": "US",
      "limit": 25
    }
  },
  {
    "key": "listFilters",
    "endpoint": "list_filters",
    "title": "List filter values",
    "paid": false,
    "description": "Lists the values findCompanies and countCompanies filter by, with the number of companies under each where it is known: technologies (search by name), buying topics, industries, business models, countries (by the head office's country where it is known, otherwise the main market the company's website serves), and the types of announcement. Free.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "technologies",
            "buying_topics",
            "industries",
            "business_models",
            "countries",
            "announcement_types"
          ],
          "description": "Which list to return."
        },
        "search": {
          "description": "Text a name holds. Needed for technologies beyond the most used: there are thousands.",
          "type": "string",
          "minLength": 1,
          "maxLength": 80
        },
        "limit": {
          "description": "How many to return. 50 unless given.",
          "type": "integer",
          "minimum": 1,
          "maximum": 200
        }
      },
      "required": [
        "kind"
      ],
      "additionalProperties": false
    },
    "example": {
      "kind": "buying_topics",
      "search": "marketing",
      "limit": 20
    }
  },
  {
    "key": "accountBalance",
    "endpoint": "account_balance",
    "title": "Balance and prices",
    "paid": false,
    "description": "The person's prepaid balance and the dates it expires, what they have spent this month and on which tools, their monthly spending limit, the prices, and where to add funds. Free.",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "example": {}
  }
];
