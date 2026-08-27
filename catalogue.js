/* ============================================================
   CATALOGUE DATA
   ------------------------------------------------------------
   To wire up checkout, set GUMROAD_USER to your Gumroad
   username, then set `slug` on each product you publish.
   A product with no slug renders as "Coming soon".
   ============================================================ */

const GUMROAD_USER = "YOUR-GUMROAD-USERNAME";

const gumroadURL = (slug) =>
  slug ? `https://${GUMROAD_USER}.gumroad.com/l/${slug}` : null;

/* ---- Categories -------------------------------------------- */

const CATEGORIES = [
  { id: "ingestion",      n: "01", name: "Ingestion",            accent: "flow", blurb: "Getting data in, and knowing when it didn't arrive." },
  { id: "storage",        n: "02", name: "Storage",              accent: "gate", blurb: "Table format, layout, history and the guarantees they carry." },
  { id: "transformation", n: "03", name: "Transformation",       accent: "iris", blurb: "Pipelines, engines, orchestration and custom logic." },
  { id: "governance",     n: "04", name: "Governance",           accent: "gold", blurb: "Who can see what, and how you prove it." },
  { id: "serving",        n: "05", name: "Serving & BI",         accent: "flow", blurb: "Warehouses, apps and dashboards on top of the lake." },
  { id: "aiml",           n: "06", name: "AI & ML",              accent: "iris", blurb: "Models, features, agents and serving them." },
  { id: "platform",       n: "07", name: "Platform & Ops",       accent: "gate", blurb: "Deployment, cost, compute and staying up." },
  { id: "security",       n: "08", name: "Security",             accent: "signal", blurb: "Networking, identity, secrets and encryption." },
  { id: "migration",      n: "09", name: "Migration",            accent: "gold", blurb: "Getting off the old thing without losing the guarantees." },
];

/* ---- Guides ------------------------------------------------
   status: "free" | "ready" | "soon"
   pages:  actual page count where written
   ------------------------------------------------------------ */

const GUIDES = [
  // 01 · Ingestion
  { id: 1,  cat: "ingestion", name: "Auto Loader", price: 0, status: "free", pages: 47,
    slug: "", idea: "Auto Loader's unit of work is a new file at a new path.",
    hook: "16 failure modes across schema, state, discovery and scale." },
  { id: 2,  cat: "ingestion", name: "Lakeflow Connect", price: 9.99, status: "soon", pages: 42,
    idea: "You configure it; you do not control it.",
    hook: "Seven documented full-refresh triggers, and how to avoid them." },
  { id: 3,  cat: "ingestion", name: "Structured Streaming", price: 9.99, status: "soon", pages: 43,
    idea: "A streaming query is a contract with its checkpoint.",
    hook: "The four things a checkpoint locks, and what breaks when they change." },
  { id: 4,  cat: "ingestion", name: "COPY INTO", price: 7.99, status: "soon", pages: 42,
    idea: "It remembers filenames, not contents.",
    hook: "Why a modified file is silently skipped forever." },

  // 02 · Storage
  { id: 5,  cat: "storage", name: "Delta Lake Performance & Maintenance", price: 9.99, status: "soon", pages: 45,
    idea: "Layout decides what you read; maintenance decides what you keep.",
    hook: "Why enabling clustering does nothing to data you already have." },
  { id: 6,  cat: "storage", name: "Delta Lake Internals", price: 9.99, status: "soon", pages: 41,
    idea: "The log is the table. The files are just storage.",
    hook: "Table features, protocol versions, and why you can't simply turn one off." },
  { id: 7,  cat: "storage", name: "Change Data Feed", price: 8.99, status: "soon", pages: 41,
    idea: "It records what changed, not what ever changed.",
    hook: "Automatic vs legacy CDF, and the retention window that quietly expires." },
  { id: 8,  cat: "storage", name: "Iceberg on Databricks", price: 9.99, status: "soon", pages: 43,
    idea: "Which catalog owns the table decides everything.",
    hook: "Managed vs foreign, and everything you give up either way." },
  { id: 9,  cat: "storage", name: "Clone, Constraints & Generated Columns", price: 8.99, status: "soon", pages: 44,
    idea: "A copy of the data is not a copy of the guarantees.",
    hook: "Why CTAS silently drops every constraint on the table." },

  // 03 · Transformation
  { id: 10, cat: "transformation", name: "Lakeflow Declarative Pipelines", price: 9.99, status: "soon", pages: 43,
    idea: "You declare the datasets; the runtime decides how to build them.",
    hook: "AUTO CDC, SCD2, and the sequencing rule that breaks pipelines." },
  { id: 11, cat: "transformation", name: "Spark on Databricks", price: 9.99, status: "soon", pages: 44,
    idea: "The engine moved away from your code.",
    hook: "Spark Connect, lazy analysis, and what serverless takes away." },
  { id: 12, cat: "transformation", name: "Lakeflow Jobs / Orchestration", price: 9.99, status: "soon", pages: 41,
    idea: "The job decides when and whether. The task decides what.",
    hook: "Most configurations don't retry by default. Some features assume they do." },
  { id: 13, cat: "transformation", name: "Photon", price: 9.99, status: "soon", pages: 41,
    idea: "Photon is a bet, not a free upgrade.",
    hook: "Fallback is silent, correct, and still charges the premium." },
  { id: 14, cat: "transformation", name: "UDFs", price: 7.99, status: "soon", pages: 44,
    idea: "A UDF is a boundary crossing. The cost is how often you cross.",
    hook: "Row-at-a-time vs batched: up to 100× on the same logic." },

  // 04 · Governance
  { id: 15, cat: "governance", name: "Unity Catalog", price: 9.99, status: "soon", pages: 40,
    idea: "Access is a chain of three grants, not a single permission.",
    hook: "Why owners never appear in SHOW GRANTS." },
  { id: 16, cat: "governance", name: "Lakehouse Federation", price: 12.99, status: "soon" },
  { id: 17, cat: "governance", name: "Delta Sharing / OpenSharing", price: 9.99, status: "soon" },
  { id: 18, cat: "governance", name: "Lakehouse Monitoring & Data Quality", price: 9.99, status: "soon" },
  { id: 19, cat: "governance", name: "Audit Logs & System Tables", price: 9.99, status: "soon" },
  { id: 20, cat: "governance", name: "Catalog Federation", price: 7.99, status: "soon" },
  { id: 21, cat: "governance", name: "Clean Rooms", price: 9.99, status: "soon" },
  { id: 22, cat: "governance", name: "Unity Catalog Metrics", price: 7.99, status: "soon" },

  // 05 · Serving & BI
  { id: 23, cat: "serving", name: "Lakebase", price: 12.99, status: "soon", pages: 46,
    idea: "Lakebase is stateless Postgres compute on top of lake storage.",
    hook: "Branches, endpoints, scale-to-zero, and every documented quota." },
  { id: 24, cat: "serving", name: "Databricks SQL Warehouses", price: 12.99, status: "soon" },
  { id: 25, cat: "serving", name: "Databricks Apps", price: 9.99, status: "soon" },
  { id: 26, cat: "serving", name: "AI/BI Dashboards", price: 9.99, status: "soon" },
  { id: 27, cat: "serving", name: "AI/BI Genie", price: 9.99, status: "soon" },

  // 06 · AI & ML
  { id: 28, cat: "aiml", name: "MLflow 3 & Model Lifecycle", price: 12.99, status: "soon" },
  { id: 29, cat: "aiml", name: "Model Serving", price: 9.99, status: "soon" },
  { id: 30, cat: "aiml", name: "Feature Engineering", price: 9.99, status: "soon" },
  { id: 31, cat: "aiml", name: "Vector Search", price: 9.99, status: "soon" },
  { id: 32, cat: "aiml", name: "Mosaic AI Agent Framework", price: 12.99, status: "soon" },
  { id: 33, cat: "aiml", name: "Foundation Model APIs", price: 9.99, status: "soon" },
  { id: 34, cat: "aiml", name: "Agent Bricks / Unity AI Gateway", price: 9.99, status: "soon" },

  // 07 · Platform & Ops
  { id: 35, cat: "platform", name: "Databricks Asset Bundles / CI-CD", price: 12.99, status: "soon" },
  { id: 36, cat: "platform", name: "Cost Management & FinOps", price: 12.99, status: "soon" },
  { id: 37, cat: "platform", name: "Compute Configuration", price: 9.99, status: "soon" },
  { id: 38, cat: "platform", name: "Observability & Monitoring", price: 9.99, status: "soon" },
  { id: 39, cat: "platform", name: "Disaster Recovery", price: 12.99, status: "soon" },
  { id: 40, cat: "platform", name: "Terraform Provider", price: 9.99, status: "soon" },
  { id: 41, cat: "platform", name: "Serverless Compute", price: 9.99, status: "soon" },
  { id: 42, cat: "platform", name: "CLI / SDK / REST API", price: 9.99, status: "soon" },
  { id: 43, cat: "platform", name: "Git Folders & Dev Workflow", price: 7.99, status: "soon" },

  // 08 · Security
  { id: 44, cat: "security", name: "Networking", price: 12.99, status: "soon" },
  { id: 45, cat: "security", name: "Identity & Access", price: 12.99, status: "soon" },
  { id: 46, cat: "security", name: "Secrets Management", price: 9.99, status: "soon" },
  { id: 47, cat: "security", name: "Encryption & CMK", price: 9.99, status: "soon" },
  { id: 48, cat: "security", name: "Compliance Profiles", price: 7.99, status: "soon" },

  // 09 · Migration
  { id: 49, cat: "migration", name: "Hive Metastore → Unity Catalog", price: 12.99, status: "soon" },
  { id: 50, cat: "migration", name: "DBFS Mounts → Volumes", price: 9.99, status: "soon" },
  { id: 51, cat: "migration", name: "Snowflake / Synapse / Hadoop Migration", price: 12.99, status: "soon" },
];

/* ---- Bundles ----------------------------------------------- */

const BUNDLES = [
  { id: "b-ingestion",      cat: "ingestion",      name: "Ingestion Bundle",             count: 4, price: 24.99, status: "soon" },
  { id: "b-storage",        cat: "storage",        name: "Storage Bundle",               count: 5, price: 34.99, status: "soon" },
  { id: "b-transformation", cat: "transformation", name: "Transformation Bundle",        count: 5, price: 34.99, status: "soon" },
  { id: "b-governance",     cat: "governance",     name: "Governance Bundle",            count: 8, price: 49.99, status: "soon" },
  { id: "b-serving",        cat: "serving",        name: "Serving / BI Bundle",          count: 5, price: 39.99, status: "soon" },
  { id: "b-aiml",           cat: "aiml",           name: "AI / ML Bundle",               count: 7, price: 54.99, status: "soon" },
  { id: "b-platform",       cat: "platform",       name: "Platform / Operations Bundle", count: 9, price: 59.99, status: "soon" },
  { id: "b-security",       cat: "security",       name: "Security / Networking Bundle", count: 5, price: 39.99, status: "soon" },
  { id: "b-migration",      cat: "migration",      name: "Migration Bundle",             count: 3, price: 29.99, status: "soon" },
];

/* ---- Collections (the headline tiers) ---------------------- */

const COLLECTIONS = [
  {
    id: "c-free", tier: "free", name: "Auto Loader",
    kicker: "Start here", price: 0, priceLabel: "Free",
    contents: "One complete 47-page guide",
    status: "free", slug: "",
    points: [
      "The full field manual, not a sample",
      "16 failure modes with symptom, cause and fix",
      "Eight production patterns and a cheat sheet",
      "Read it before you buy anything else",
    ],
  },
  {
    id: "c-de", tier: "collection", name: "Data Engineering Collection",
    kicker: "Most popular", price: 69.99, priceLabel: "$69.99",
    contents: "Ingestion + Storage + Transformation · 14 guides",
    status: "soon",
    points: [
      "The complete data path, end to end",
      "Ingest, store, transform, orchestrate",
      "Over 500 pages",
      "Saves $25 against the three bundles",
    ],
  },
  {
    id: "c-lib", tier: "library", name: "Complete Library",
    kicker: "Early access", price: 89.99, priceLabel: "$89.99",
    contents: "Everything available now, plus every future guide",
    status: "soon",
    points: [
      "All 51 guides as they ship",
      "Price rises as the catalogue grows",
      "Early-access price locked for life",
      "Free updates when guides are revised",
    ],
  },
];
