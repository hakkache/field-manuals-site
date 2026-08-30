/* ============================================================
   DATABRICKS FIELD MANUALS — product data
   ------------------------------------------------------------
   This is the only file you edit to add a Field Manual.
   index.html renders itself from what is below.

   TO ADD A NEW MANUAL
     1. Copy an entry in MANUALS
     2. Set status:"available", the price (or free:true) and the
        Gumroad `slug`
     3. Drop preview images into assets/img/previews/ and list them
     Everything else — cards, catalogue, counts — updates itself.

   RULES ENFORCED BY app.js
     · No `slug` -> no purchase button. Never a dead checkout.
     · status:"soon" -> "Coming soon" label, no button.
   ============================================================ */

const GUMROAD_USER = "hakkache";

const gumroadURL = (slug) =>
  slug ? `https://${GUMROAD_USER}.gumroad.com/l/${slug}` : null;

/* Newsletter: leave empty until a provider is connected.
   While empty, the form does NOT pretend to store anything —
   it points people at Gumroad, which does collect an email. */
const NEWSLETTER_ENDPOINT = "";

/* ---- Available Field Manuals ------------------------------- */

const MANUALS = [
  {
    id: "auto-loader",
    category: "ingestion",
    title: "Databricks Auto Loader",
    subtitle: "The Complete Practical Guide",
    pages: 47,
    free: true,
    status: "available",
    slug: "auto-loader-field-manual",
    badge: "Free",
    idea: "Auto Loader's unit of work is a new file at a new path.",
    desc: "A practical field manual for understanding Auto Loader beyond the happy path — including discovery, schema evolution, checkpoints, silent failures, scaling, cost, troubleshooting and production design.",
    topics: [
      "Architecture & mental model",
      "Production failure modes",
      "Schema evolution",
      "Checkpoint & discovery problems",
      "Production patterns",
      "Troubleshooting checklist",
      "Cheat sheet",
    ],
    /* Deep-dive section on the homepage */
    deepTitle: "Auto Loader — from happy path to production",
    deepLead: "Auto Loader is excellent at discovering new files. Production ingestion requires understanding everything around that discovery process.",
    problems: [
      ["File discovery failures", "Files sit in storage and never reach the table. No error, no failed run."],
      ["Checkpoint problems", "What the checkpoint owns, and what happens when it is deleted or shared."],
      ["Schema evolution", "Inference, hints, and the stream restarts that catch teams out."],
      ["Rescued data", "The column that quietly fills up while everything looks green."],
      ["Small files & scaling", "Throughput limits, and why the storage bill moved."],
      ["Cost & backfills", "Listing versus notification, and recovering data you already missed."],
    ],
    previews: [
      { img: "autoloader-failure-landscape.jpg", label: "Failure modes",        alt: "Auto Loader Field Manual page mapping sixteen failure modes into four families with counts" },
      { img: "autoloader-diagnosis.jpg",         label: "Diagnosis",            alt: "Auto Loader Field Manual page showing a failure with symptom, cause and fix for rescued data" },
      { img: "autoloader-patterns.jpg",          label: "Production pattern",   alt: "Auto Loader Field Manual page showing a production pattern for CDC files into upserts" },
      { img: "autoloader-options.jpg",           label: "Options reference",    alt: "Auto Loader Field Manual reference table of the configuration options that matter" },
      { img: "autoloader-symptom-index.jpg",     label: "Symptom index",        alt: "Auto Loader Field Manual quick symptom index mapping symptoms to failure pages" },
    ],
  },

  {
    id: "lakeflow-connect",
    category: "ingestion",
    title: "Databricks Lakeflow Connect",
    subtitle: "The Complete Practical Guide",
    pages: 42,
    price: 7.99,
    status: "available",
    slug: "lakeflow-connect-field-manual",
    badge: "$7.99",
    idea: "You configure it. You do not control it.",
    desc: "A production-focused guide to managed ingestion, database CDC, gateways, staging, schema evolution, full refreshes, failure modes and operational design.",
    topics: [
      "Gateway architecture",
      "Database CDC",
      "Staging & storage",
      "Schema evolution",
      "Full-refresh scenarios",
      "Production patterns",
      "Operational troubleshooting",
    ],
    deepTitle: "Lakeflow Connect — what happens after you deploy it",
    deepLead: "Managed ingestion looks simple from the outside. Production introduces gateways, CDC retention, staging, schema evolution, refresh behaviour, source failover and operational constraints.",
    problems: [
      ["Gateway resilience", "It runs continuously on classic compute. Stopping it has a cost."],
      ["CDC retention", "The source truncates its change log on its own schedule. You are racing it."],
      ["Full refreshes", "Seven documented causes end in the same expensive operation."],
      ["Source failover", "An availability-group failover invalidates every table in the pipeline."],
      ["Schema evolution", "Automatic and opinionated — and it differs by connector."],
      ["Destination ownership", "Deleting the pipeline drops the destination tables with it."],
    ],
    previews: [
      { img: "lakeflow-connector-types.jpg",    label: "Architecture",       alt: "Lakeflow Connect Field Manual page comparing the four managed connector types" },
      { img: "lakeflow-gateway-rules.jpg",      label: "Operational rules",  alt: "Lakeflow Connect Field Manual page on gateway rules and change log retention" },
      { img: "lakeflow-failure-landscape.jpg",  label: "Failure modes",      alt: "Lakeflow Connect Field Manual page mapping sixteen failure modes into four families" },
      { img: "lakeflow-landing-schema.jpg",     label: "Production pattern", alt: "Lakeflow Connect Field Manual page on designing the bronze landing schema" },
      { img: "lakeflow-full-refresh.jpg",       label: "Decision reference", alt: "Lakeflow Connect Field Manual cheat sheet listing what forces a full refresh" },
    ],
  },
];

/* ---- Categories, for the growing catalogue ------------------ */

const CATEGORIES = [
  { id: "ingestion",  name: "Ingestion",         note: "Auto Loader, Lakeflow Connect, and more to come" },
  { id: "spark",      name: "Spark Performance", note: "Query execution, shuffle, skew, memory, Photon" },
  { id: "storage",    name: "Delta Lake",        note: "Optimization, maintenance, concurrency" },
  { id: "governance", name: "Unity Catalog",     note: "Governance, access control, production design" },
  { id: "streaming",  name: "Structured Streaming", note: "State, checkpoints, recovery, failure modes" },
  { id: "jobs",       name: "Databricks Jobs",   note: "Scheduling, retries, dependencies, operations" },
];

/* ---- In development ---------------------------------------- */

const UPCOMING = [
  { name: "Spark Performance",      desc: "Query execution, shuffle, skew, memory, Photon and performance diagnosis." },
  { name: "Delta Lake",             desc: "Optimization, maintenance, concurrency and production patterns." },
  { name: "Unity Catalog",          desc: "Governance, access control and production design." },
  { name: "Structured Streaming",   desc: "State, checkpoints, recovery and operational failure modes." },
  { name: "Databricks Jobs",        desc: "Scheduling, retries, dependencies and production operations." },
];

/* ---- Bundles (not yet priced) ------------------------------- */

const BUNDLES = [
  { name: "Ingestion Bundle",  desc: "Auto Loader + Lakeflow Connect + future ingestion manuals." },
  { name: "Production Bundle", desc: "A broader collection focused on production architecture, reliability, performance and operations." },
];

/* ---- The questions the manuals answer ----------------------- */

const QUESTIONS = [
  "Why did Auto Loader stop discovering files?",
  "Why is the stream green but data is missing?",
  "What happens if the checkpoint disappears?",
  "Why did a schema change break the stream?",
  "What happens when the CDC gateway is offline?",
  "When does Lakeflow Connect require a full refresh?",
  "What happens when source retention expires?",
  "How should ingestion be designed for production?",
  "What should I check before calling a pipeline healthy?",
];

/* ---- Who they are for --------------------------------------- */

const AUDIENCE = [
  ["Building",     "You're implementing Databricks workloads and want to understand production implications."],
  ["Debugging",    "Your pipeline is running, but the data doesn't look right."],
  ["Reviewing",    "You're reviewing a Databricks architecture or production implementation."],
  ["Preparing for production", "You want to understand failure modes before they become incidents."],
  ["Troubleshooting", "You need a practical diagnostic reference instead of searching documentation for hours."],
];
