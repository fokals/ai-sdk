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
export const TOOL_NAMES = ["findCompanies","countCompanies","enrichCompanies","companyProfile","companyChanges","searchJobPostings","similarCompanies","companyConnections","identifyCompany","marketBreakdown","vendorScorecard","companiesLikeCustomers","companyHealth","likelyNext","intentHistory","salesTeam","fundingFilings","headcountHistory","trafficHistory","signalFeed","announcementFeed","changeFeed","listedSecurities","marketTrends","marketMovers","salesPayBenchmarks","listFilters","accountBalance"] as const;
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
    "key": "intentHistory",
    "endpoint": "intent_history",
    "title": "Buying intent week by week",
    "paid": true,
    "description": "The buying topics each of the person's companies has shown signs of, week by week for up to 12 weeks: for each week, each topic with its score from 0 to 100, whether it was surging (rising sharply against the company's own recent weeks) and how many signals were behind it, with the company's latest signals by date and kind. Give a topic to follow just that one. Use it to see whether interest is building or fading, to time an approach, or to explain a score. A company with no intent held costs nothing and is named as such. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
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
          "description": "The person's own companies, each as a website address (\"acme.com\"), a name or an id from an earlier answer. At most 25 a call."
        },
        "weeks": {
          "description": "How many weeks to return, oldest first. 12 unless given.",
          "type": "integer",
          "minimum": 1,
          "maximum": 12
        },
        "topic": {
          "description": "One buying topic to follow, by name or id: \"Marketing automation\". listFilters with kind buying_topics has them all.",
          "type": "string",
          "minLength": 1,
          "maxLength": 80
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
      "weeks": 8
    }
  },
  {
    "key": "salesTeam",
    "endpoint": "sales_team",
    "title": "Sales team from job ads",
    "paid": true,
    "description": "The sales team each of the person's companies is building, as its own job ads show it: open sales roles now by role (SDR or BDR, account executive, account manager, sales engineer, sales leadership, sales operations, partnerships), by the customer segment they sell to and by country; the median base and on-target pay the ads state, by role; the sales tools the ads name; the last twelve closed weeks; and the latest open sales postings with what each states (base, on-target pay, quota, ramp, where leads come from). Pay is what an ad offers, not what is paid. Use it to size a sales team, see where it is expanding or moving upmarket, or benchmark an offer. A company with no sales postings costs nothing and is named as such. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
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
          "description": "The person's own companies, each as a website address (\"acme.com\"), a name or an id from an earlier answer. At most 25 a call."
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
        "hubspot.com"
      ]
    }
  },
  {
    "key": "fundingFilings",
    "endpoint": "funding_filings",
    "title": "Funding filings",
    "paid": true,
    "description": "The notices of a private fundraise each of the person's companies has filed with the US securities regulator (Form D), newest first: when it was filed, the amount offered and the amount sold so far, the date of the first sale, the company's industry and place as filed, and whether it amends an earlier notice. A company that has not raised money this way has none. Use it to see how much a company raised and when, beyond what it announced. A company with no filing costs nothing and is named as such. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
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
          "description": "The person's own companies, each as a website address (\"acme.com\"), a name or an id from an earlier answer. At most 25 a call."
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
        "stripe.com"
      ]
    }
  },
  {
    "key": "headcountHistory",
    "endpoint": "headcount_history",
    "title": "Headcount over time",
    "paid": true,
    "description": "How many people each of the person's companies employed over the years, oldest first, each figure with the date it is as of and whether it comes from the company's annual report or a public record. Use it to see whether a company is growing or shrinking. A company with no headcount held costs nothing and is named as such. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
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
          "description": "The person's own companies, each as a website address (\"acme.com\"), a name or an id from an earlier answer. At most 25 a call."
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
        "shopify.com"
      ]
    }
  },
  {
    "key": "trafficHistory",
    "endpoint": "traffic_history",
    "title": "Website traffic month by month",
    "paid": true,
    "description": "How popular each of the person's companies' websites has been, month by month for up to 13 months: each month, the smallest group of the most visited websites in the world it was in (top 1,000, 5,000, 10,000, 50,000, 100,000, 500,000, 1 million, 5 million, 10 million or 50 million), with the latest month and the trend. A smaller group is more traffic. Use it to see whether a company's audience is growing. A company whose website is not ranked costs nothing and is named as such. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
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
          "description": "The person's own companies, each as a website address (\"acme.com\"), a name or an id from an earlier answer. At most 25 a call."
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
    "key": "signalFeed",
    "endpoint": "signal_feed",
    "title": "Buying signals across companies",
    "paid": true,
    "description": "Every buying signal seen across all companies from a day on, oldest first, a page at a time: the day, the company, where it was seen (its website, domain records, job ads, filings or announcements), what kind of signal it is and the buying topics it points to. Narrow it to one buying topic or one kind of source. Use it to watch a topic for new interest as it appears, or to build a list from fresh signals. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "since": {
          "description": "From this day on, YYYY-MM-DD. 7 days ago unless given; at most 90 days back.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "topic": {
          "description": "Only signals of this buying topic, by name or id: \"Marketing automation\".",
          "type": "string",
          "minLength": 1,
          "maxLength": 80
        },
        "source": {
          "description": "Only signals of this kind: site (the website), dns (the domain records), careers (job ads), filing (regulatory filings), news (announcements).",
          "type": "string",
          "enum": [
            "site",
            "dns",
            "careers",
            "filing",
            "news"
          ]
        },
        "limit": {
          "description": "How many signals to return. 50 unless given, 100 at most.",
          "type": "integer",
          "minimum": 1,
          "maximum": 100
        },
        "cursor": {
          "description": "next_cursor of the answer before, to carry on where it ended.",
          "type": "string",
          "maxLength": 500
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
      "since": "2026-10-20",
      "topic": "Marketing automation",
      "limit": 50
    }
  },
  {
    "key": "announcementFeed",
    "endpoint": "announcement_feed",
    "title": "Announcements across companies",
    "paid": true,
    "description": "Every announcement companies made about themselves from a day on, newest first, a page at a time: the day, the company, the title, its types (funding, a launch, a partnership, an acquisition, a leadership change, an expansion and more), what a funding announcement states of the round, the leadership roles named, and a link. Narrow it to one type. Use it to catch every funding round or leadership change in a week. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "since": {
          "description": "From this day on, YYYY-MM-DD. 7 days ago unless given; at most 90 days back.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "type": {
          "description": "Only announcements of this type. listFilters with kind announcement_types has them all.",
          "type": "string",
          "enum": [
            "product_launch",
            "partnership",
            "acquisition_made",
            "acquired_or_merged",
            "funding_round",
            "leadership_change",
            "layoffs_restructuring",
            "expansion",
            "incident",
            "financial_results",
            "award_or_recognition",
            "regulatory_or_legal"
          ]
        },
        "limit": {
          "description": "How many announcements to return. 50 unless given, 100 at most.",
          "type": "integer",
          "minimum": 1,
          "maximum": 100
        },
        "cursor": {
          "description": "next_cursor of the answer before, to carry on where it ended.",
          "type": "string",
          "maxLength": 500
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
      "since": "2026-10-20",
      "type": "funding_round",
      "limit": 50
    }
  },
  {
    "key": "changeFeed",
    "endpoint": "change_feed",
    "title": "Website changes across companies",
    "paid": true,
    "description": "Every change seen on company websites from a day on, oldest first, a page at a time, each in plain words: a technology added or dropped, a new market, language, currency, page or app, a price raised or cut, a plan or free plan added or dropped, a change in how the company describes itself. Narrow it to one kind of change. Use it to catch every company that adopted or dropped a tool, or changed its prices, this week. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "since": {
          "description": "From this day on, YYYY-MM-DD. 7 days ago unless given; at most 90 days back.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "category": {
          "description": "Only changes of this kind: technology (a tool added or dropped), market, language, currency, social, app, page, promo, dns, platform, pricing (a price or plan changed), label (how the company describes itself), identity.",
          "type": "string",
          "enum": [
            "technology",
            "technology_id",
            "market",
            "language",
            "currency",
            "social",
            "app",
            "page",
            "promo",
            "dns",
            "platform",
            "pricing",
            "label",
            "identity"
          ]
        },
        "limit": {
          "description": "How many changes to return. 50 unless given, 100 at most.",
          "type": "integer",
          "minimum": 1,
          "maximum": 100
        },
        "cursor": {
          "description": "next_cursor of the answer before, to carry on where it ended.",
          "type": "string",
          "maxLength": 500
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
      "since": "2026-10-20",
      "category": "pricing",
      "limit": 50
    }
  },
  {
    "key": "listedSecurities",
    "endpoint": "listed_securities",
    "title": "Stock listings",
    "paid": true,
    "description": "The equity listings held, a page at a time: each with its name, ticker, exchange and market code, its global identifiers (FIGI and share class FIGI, ISIN, LEI), the issuer's country, the type of security, whether it is active or delisted, and the company it belongs to where one is held. Narrow it by exchange, country or status. Use it to map a portfolio or an index to companies. Listings that match no company cost nothing. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "exchange": {
          "description": "Only listings on this exchange, by its code: \"US\", \"LN\", or a market code such as \"XNAS\".",
          "type": "string",
          "minLength": 1,
          "maxLength": 10
        },
        "country": {
          "description": "Only listings of issuers from this country, as a two-letter code.",
          "type": "string",
          "pattern": "^[A-Za-z]{2}$"
        },
        "status": {
          "description": "active or delisted. Both unless given.",
          "type": "string",
          "enum": [
            "active",
            "delisted"
          ]
        },
        "limit": {
          "description": "How many listings to return. 50 unless given, 100 at most.",
          "type": "integer",
          "minimum": 1,
          "maximum": 100
        },
        "cursor": {
          "description": "next_cursor of the answer before, to carry on where it ended.",
          "type": "string",
          "maxLength": 500
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
      "exchange": "US",
      "status": "active",
      "limit": 50
    }
  },
  {
    "key": "marketTrends",
    "endpoint": "market_trends",
    "title": "Market trends over time",
    "paid": true,
    "description": "How a measure of the market has moved over time, newest first: hiring (new, closed and open roles, pay, seniority, work mode, functions, AI roles), sales hiring and pay, technologies taken up, dropped and in use, pages, markets and languages added, website moves, announcements, buying topics surging, traffic, headcount and stock listings. Each figure is a count, the number of companies it is out of, the rate, the rate the window before, the growth between them, and an index. Cut it by industry, sector, country, company size or exchange, and follow one subject such as a technology. Use it to see what is growing in a market and where. It returns figures, not companies. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "measure": {
          "type": "string",
          "enum": [
            "hiring_new",
            "hiring_closed",
            "hiring_open",
            "hiring_net",
            "pay_median",
            "seniority_share",
            "work_mode_share",
            "function_share",
            "ai_role_share",
            "sales_share",
            "sales_segment_share",
            "sales_lead_source_share",
            "sales_ote_median",
            "sales_base_median",
            "tech_added",
            "tech_removed",
            "tech_prevalence",
            "gtm_page_added",
            "market_added",
            "language_added",
            "replatformed",
            "news_event",
            "intent_surge",
            "traffic_up",
            "traffic_down",
            "headcount_change_median",
            "listings_new",
            "listings_delisted"
          ],
          "description": "What is measured. listFilters with kind market_measures lists them with what each counts."
        },
        "subject": {
          "description": "For a measure with subjects, which one: a technology (\"HubSpot\"), a seniority, a work mode, a job function, a type of announcement, a buying topic, a customer segment, a lead source or a page, by name. Every subject unless given.",
          "type": "string",
          "minLength": 1,
          "maxLength": 80
        },
        "by": {
          "description": "How the market is cut: all (the whole index, unless given), industry, sector, country, size (by employees) or market (a stock exchange, listed companies only).",
          "type": "string",
          "enum": [
            "all",
            "industry",
            "sector",
            "country",
            "size",
            "market"
          ]
        },
        "value": {
          "description": "With by, one value of it: an industry id, a sector, a two-letter country code, a size band (1-10, 11-50, 51-200, 201-1000, 1001-5000, 5000+) or an exchange code. Every value unless given.",
          "type": "string",
          "minLength": 1,
          "maxLength": 60
        },
        "window": {
          "description": "The window each figure is counted over, in days: 7, 30, 180 or 365. 30 unless given.",
          "type": "integer",
          "minimum": 7,
          "maximum": 365
        },
        "since": {
          "description": "Only figures as of this day or later, YYYY-MM-DD.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "until": {
          "description": "Only figures as of this day or earlier, YYYY-MM-DD.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "limit": {
          "description": "How many figures to return. 50 unless given, 200 at most.",
          "type": "integer",
          "minimum": 1,
          "maximum": 200
        },
        "cursor": {
          "description": "next_cursor of the answer before, to carry on where it ended.",
          "type": "string",
          "maxLength": 500
        },
        "max_usd": {
          "description": "The most the person has agreed to pay for this call, in US dollars. Leave it out unless a call has returned its price and the person agreed to it.",
          "type": "number",
          "minimum": 0,
          "maximum": 100000
        }
      },
      "required": [
        "measure"
      ],
      "additionalProperties": false
    },
    "example": {
      "measure": "tech_added",
      "subject": "HubSpot",
      "by": "industry",
      "window": 30,
      "limit": 20
    }
  },
  {
    "key": "marketMovers",
    "endpoint": "market_movers",
    "title": "Biggest market movers",
    "paid": true,
    "description": "The market figures that moved most on one day, largest growth first, up or down: which industries, countries, company sizes or exchanges saw the biggest change in hiring, technologies taken up or dropped, buying topics surging, traffic and the rest. Keep to one measure or see every one. Use it to spot what is changing fastest in the market right now. It returns figures, not companies. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "measure": {
          "description": "Only this measure. Every measure unless given.",
          "type": "string",
          "enum": [
            "hiring_new",
            "hiring_closed",
            "hiring_open",
            "hiring_net",
            "pay_median",
            "seniority_share",
            "work_mode_share",
            "function_share",
            "ai_role_share",
            "sales_share",
            "sales_segment_share",
            "sales_lead_source_share",
            "sales_ote_median",
            "sales_base_median",
            "tech_added",
            "tech_removed",
            "tech_prevalence",
            "gtm_page_added",
            "market_added",
            "language_added",
            "replatformed",
            "news_event",
            "intent_surge",
            "traffic_up",
            "traffic_down",
            "headcount_change_median",
            "listings_new",
            "listings_delisted"
          ]
        },
        "by": {
          "description": "How the market is cut: industry (unless given), sector, country, size, market or all.",
          "type": "string",
          "enum": [
            "all",
            "industry",
            "sector",
            "country",
            "size",
            "market"
          ]
        },
        "window": {
          "description": "The window each figure is counted over, in days: 7, 30, 180 or 365. 30 unless given.",
          "type": "integer",
          "minimum": 7,
          "maximum": 365
        },
        "as_of": {
          "description": "The day of the figures, YYYY-MM-DD. The latest unless given.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "limit": {
          "description": "How many figures to return. 25 unless given, 100 at most.",
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
      "additionalProperties": false
    },
    "example": {
      "measure": "hiring_new",
      "by": "country",
      "window": 30,
      "limit": 10
    }
  },
  {
    "key": "salesPayBenchmarks",
    "endpoint": "sales_pay_benchmarks",
    "title": "Sales pay benchmarks",
    "paid": true,
    "description": "Advertised sales pay across every company's open sales job ads for one closed week, by role and country: the 25th percentile, median and 75th percentile of the stated base and of the stated on-target pay, in yearly US dollars, with how many ads each is over. Pay is what the ads offer, not what is paid. Use it to benchmark an offer or a sales budget. It returns figures, not companies. Paid from the Fokals balance at the prices on https://api.fokals.com/v1/prices. A call that costs more than the account lets run unasked returns its price instead: tell the person, then call again with max_usd once they agree.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "role": {
          "description": "Only this sales role. listFilters with kind sales_roles has them all. Every role unless given.",
          "type": "string",
          "enum": [
            "sdr_bdr",
            "account_executive",
            "account_manager",
            "sales_engineer",
            "sales_leadership",
            "sales_operations",
            "partnerships_channel"
          ]
        },
        "country": {
          "description": "Only this country, as a two-letter code, or ALL for every country together. Every country unless given.",
          "type": "string",
          "pattern": "^([A-Za-z]{2}|ALL|all)$"
        },
        "week": {
          "description": "The week, by its Monday as YYYY-MM-DD. The latest closed week unless given.",
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        "limit": {
          "description": "How many rows to return. 50 unless given, 200 at most.",
          "type": "integer",
          "minimum": 1,
          "maximum": 200
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
      "role": "account_executive",
      "country": "US"
    }
  },
  {
    "key": "listFilters",
    "endpoint": "list_filters",
    "title": "List filter values",
    "paid": false,
    "description": "Lists the values findCompanies and countCompanies filter by, with the number of companies under each where it is known: technologies (search by name), buying topics, industries, business models, countries (by the head office's country where it is known, otherwise the main market the company's website serves), and the types of announcement. Also what marketTrends and marketMovers can measure, with how each can be cut and its subjects, and the sales roles. Free.",
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
            "announcement_types",
            "market_measures",
            "sales_roles"
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
