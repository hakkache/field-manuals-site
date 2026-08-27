/* ============================================================
   CATALOGUE DATA
   ------------------------------------------------------------
   PRICES ARE CURRENTLY HIDDEN.
   When your Gumroad products are live, set SHOW_PRICES to true
   and every price appears across guides, bundles and tiers.

   To wire up checkout: set GUMROAD_USER, then add a `slug` to
   each product you publish. No slug = "Coming soon".
   ============================================================ */

const SHOW_PRICES  = false;
const GUMROAD_USER = "YOUR-GUMROAD-USERNAME";

const gumroadURL = (slug) =>
  slug ? `https://${GUMROAD_USER}.gumroad.com/l/${slug}` : null;

/* ---- Categories -------------------------------------------- */

const CATEGORIES = [
  { id:"ingestion",      n:"01", name:"Ingestion",      accent:"flow",
    blurb:"Getting data in, and knowing when it didn't arrive." },
  { id:"storage",        n:"02", name:"Storage",        accent:"gate",
    blurb:"Table format, layout, history and the guarantees they carry." },
  { id:"transformation", n:"03", name:"Transformation", accent:"iris",
    blurb:"Pipelines, engines, orchestration and custom logic." },
  { id:"governance",     n:"04", name:"Governance",     accent:"gold",
    blurb:"Who can see what, and how you prove it." },
  { id:"serving",        n:"05", name:"Serving & BI",   accent:"flow",
    blurb:"Warehouses, apps and dashboards on top of the lake." },
  { id:"aiml",           n:"06", name:"AI & ML",        accent:"iris",
    blurb:"Models, features, agents and serving them." },
  { id:"platform",       n:"07", name:"Platform & Ops", accent:"gate",
    blurb:"Deployment, cost, compute and staying up." },
  { id:"security",       n:"08", name:"Security",       accent:"signal",
    blurb:"Networking, identity, secrets and encryption." },
  { id:"migration",      n:"09", name:"Migration",      accent:"gold",
    blurb:"Getting off the old thing without losing the guarantees." },
];

/* ---- Guides ------------------------------------------------
   idea   — the single organising sentence
   desc   — what the guide is actually about
   covers — the topics inside
   pages  — set once written; drives the coverage board
   ------------------------------------------------------------ */

const GUIDES = [

/* ══ 01 · INGESTION ══════════════════════════════════════ */
{ id:1, cat:"ingestion", name:"Auto Loader", price:0, status:"free", pages:47, slug:"",
  idea:"Auto Loader's unit of work is a new file at a new path.",
  desc:"Incremental file ingestion, from the first stream to the ones that fail at 3am. Covers both discovery modes, how schema inference actually behaves, and why a file that changed is a file Auto Loader will never look at again.",
  covers:["Directory listing vs file notification","Schema inference, hints and evolution","Checkpoints and RocksDB state","Sixteen failures across schema, state, discovery and scale","Backfills, rescued data and dead-letter patterns"] },

{ id:2, cat:"ingestion", name:"Lakeflow Connect", price:9.99, status:"soon", pages:42,
  idea:"You configure it; you do not control it.",
  desc:"Managed connectors for SaaS apps and databases. The guide is mostly about the seven documented events that trigger a full refresh, because that is what turns a fifteen-minute sync into a six-hour one without warning.",
  covers:["Four connector types and when each applies","Gateway and ingestion pipeline architecture","Seven full-refresh triggers","Schema evolution: what's automatic, what isn't","Table count limits and scheduling"] },

{ id:3, cat:"ingestion", name:"Structured Streaming", price:9.99, status:"soon", pages:43,
  idea:"A streaming query is a contract with its checkpoint.",
  desc:"What the checkpoint locks and what happens when you change it. Covers stateful operations, watermarking, RocksDB and changelog checkpointing, and the serverless restrictions that catch people mid-migration.",
  covers:["The four things a checkpoint locks","Watermarks, state stores and RocksDB","Trigger modes, and what serverless allows","Source evolution, and when it's irreversible","Backlog monitoring that catches silent lag"] },

{ id:4, cat:"ingestion", name:"COPY INTO", price:7.99, status:"soon", pages:42,
  idea:"It remembers filenames, not contents.",
  desc:"The SQL path to idempotent file loading, and its one dangerous property: a file modified after loading is silently skipped forever, while a renamed file is loaded again as new.",
  covers:["Filename-based idempotency and its blind spot","FILES and PATTERN, and why they don't combine","force=true, and what it disables","Schema evolution and format options","When to use streaming tables instead"] },

/* ══ 02 · STORAGE ════════════════════════════════════════ */
{ id:5, cat:"storage", name:"Delta Lake Performance & Maintenance", price:9.99, status:"soon", pages:45,
  idea:"Layout decides what you read; maintenance decides what you keep.",
  desc:"Liquid clustering, OPTIMIZE, VACUUM and predictive optimization. The central point is that enabling clustering does nothing to data you already have — and that DELETE does not free storage.",
  covers:["Liquid clustering, and why OPTIMIZE FULL is required","Clustering-on-write thresholds","Predictive optimization: what it will and won't run","DELETE, REORG PURGE and deletion vectors","Retention windows and auto time-to-live"] },

{ id:6, cat:"storage", name:"Delta Lake Internals", price:9.99, status:"soon", pages:41,
  idea:"The log is the table. The files are just storage.",
  desc:"What lives in _delta_log, how checkpoints and protocol versions work, and why turning a table feature off is not the same as removing it. For anyone who has hit a protocol error and not known what to do next.",
  covers:["Commit files, checkpoints and _last_checkpoint","Reader and writer protocol versions","Table features, and DROP FEATURE","Log retention vs file retention","RESTORE, and idempotent batch writes"] },

{ id:7, cat:"storage", name:"Change Data Feed", price:8.99, status:"soon", pages:41,
  idea:"It records what changed, not what ever changed.",
  desc:"Both feeds — the automatic one computed from row tracking, and the legacy one materialised at write. Covers the metadata columns, the retention window that quietly expires, and the schema changes that break a range read.",
  covers:["Automatic CDF vs legacy CDF","_change_type, _commit_version, _commit_timestamp","Retention, and the out-of-range error","Non-additive schema changes that break reads","The archive pattern that keeps history"] },

{ id:8, cat:"storage", name:"Iceberg on Databricks", price:9.99, status:"soon", pages:43,
  idea:"Which catalog owns the table decides everything.",
  desc:"Managed and foreign Iceberg tables, and the very different things each one can do. Covers credential vending, the Iceberg REST catalog, and every Delta feature you give up by migrating.",
  covers:["Managed vs foreign, capability by capability","Iceberg REST catalog and credential vending","What managed Iceberg does not support","Making tables visible to external engines","Delta with Iceberg reads as an alternative"] },

{ id:9, cat:"storage", name:"Clone, Constraints & Generated Columns", price:8.99, status:"soon", pages:44,
  idea:"A copy of the data is not a copy of the guarantees.",
  desc:"What a table promises and which promises survive a copy. Only two constraints are actually enforced, a primary key will never stop a duplicate, and CTAS silently drops every table specification you have.",
  covers:["Enforced vs informational constraints","RELY, and how it can return wrong answers","Generated and identity columns","Why identity columns disable concurrent writes","Shallow vs deep clone, and the VACUUM trap"] },

/* ══ 03 · TRANSFORMATION ═════════════════════════════════ */
{ id:10, cat:"transformation", name:"Lakeflow Declarative Pipelines", price:9.99, status:"soon", pages:43,
  idea:"You declare the datasets; the runtime decides how to build them.",
  desc:"Streaming tables, materialized views and views, plus AUTO CDC for change processing. Covers the sequencing rules that break pipelines and the difference between an expectation and a constraint.",
  covers:["Three dataset types, and when to use each","AUTO CDC, and SCD type 1 and 2","SEQUENCE BY, and why ordering matters","Expectations: drop, fail and quarantine","Full refresh, and what it destroys"] },

{ id:11, cat:"transformation", name:"Spark on Databricks", price:9.99, status:"soon", pages:44,
  idea:"The engine moved away from your code.",
  desc:"What Spark Connect changed, why schema analysis is now lazy, and everything serverless takes away. Written for people whose working Spark code started behaving differently after a runtime upgrade.",
  covers:["Spark Connect, and which runtimes use it","Lazy analysis, and where errors now surface","Serverless restrictions: RDDs, cache, Spark UI","ANSI SQL as the default","Adaptive query execution in practice"] },

{ id:12, cat:"transformation", name:"Lakeflow Jobs / Orchestration", price:9.99, status:"soon", pages:41,
  idea:"The job decides when and whether. The task decides what.",
  desc:"Tasks, triggers, control flow and repair. The guide exists because most configurations do not retry by default, and several Databricks features quietly assume that they do.",
  covers:["Task types, dependencies and granularity","Triggers: schedule, file arrival, table update, continuous","Run if conditions, and cleanup that always runs","Retry defaults by compute type","Repair run, and designing for it"] },

{ id:13, cat:"transformation", name:"Photon", price:9.99, status:"soon", pages:41,
  idea:"Photon is a bet, not a free upgrade.",
  desc:"What Photon accelerates, what makes it fall back, and the cost equation that decides whether it earns its DBU premium. Fallback is silent, correct, and still charges you.",
  covers:["Covered operators, expressions and data types","The native writer, and dynamic file pruning","What causes a fallback","Reading the Photon task-time percentage","The two-run test for your own workload"] },

{ id:14, cat:"transformation", name:"UDFs", price:7.99, status:"soon", pages:44,
  idea:"A UDF is a boundary crossing. The cost is how often you cross.",
  desc:"Every UDF type on Databricks and when to use which. Covers the serialization boundary that explains every performance difference, and the access-mode restrictions that only appear during a migration.",
  covers:["Scalar, batch, UDTF and UDAF","Why batched UDFs are up to 100× faster","Batch Unity Catalog Python UDFs","Service credentials and custom dependencies","Broadcast variables and access-mode limits"] },

/* ══ 04 · GOVERNANCE ═════════════════════════════════════ */
{ id:15, cat:"governance", name:"Unity Catalog", price:9.99, status:"soon", pages:40,
  idea:"Access is a chain of three grants, not a single permission.",
  desc:"The governance model, from metastore to table. Covers privilege inheritance, why owners never appear in SHOW GRANTS, and the real difference between managed and external tables when someone runs DROP.",
  covers:["USE CATALOG, USE SCHEMA, SELECT","Privilege inheritance and ALL PRIVILEGES","Managed vs external tables, and UNDROP","Storage credentials and external locations","Object quotas and naming limits"] },

{ id:16, cat:"governance", name:"Lakehouse Federation", price:12.99, status:"soon",
  idea:"Query it where it lives, and inherit its limits.",
  desc:"Reading external systems through Unity Catalog without moving data. Covers connections and foreign catalogs, what pushes down to the source, and the performance ceiling federation cannot lift.",
  covers:["Connections, foreign catalogs and supported sources","Query pushdown, and what stays local","Governance over federated objects","Caching, materialized views and freshness","When to federate, and when to ingest"] },

{ id:17, cat:"governance", name:"Delta Sharing / OpenSharing", price:9.99, status:"soon",
  idea:"Sharing is a grant on a share, not a copy of a table.",
  desc:"Open protocol and Databricks-to-Databricks sharing. Covers shares, recipients and tokens, what the recipient can actually see, and how sharing interacts with retention and change data feed.",
  covers:["Open sharing vs Databricks-to-Databricks","Shares, recipients and token lifecycle","Sharing views, volumes and models","History sharing and retention","Auditing who read what"] },

{ id:18, cat:"governance", name:"Lakehouse Monitoring & Data Quality", price:9.99, status:"soon",
  idea:"A quality rule is only real where it's enforced.",
  desc:"Monitoring profiles, drift detection and the generated metric tables. Covers where quality enforcement belongs — table constraint, pipeline expectation or monitor — and what each one can and cannot catch.",
  covers:["Snapshot, time series and inference profiles","Drift metrics and baselines","The generated profile and drift tables","Custom metrics","Alerting on quality, not just failure"] },

{ id:19, cat:"governance", name:"Audit Logs & System Tables", price:9.99, status:"soon",
  idea:"If you didn't enable it, it wasn't recorded.",
  desc:"The system tables schema and what each one answers. Covers billing and usage analysis, access auditing, and the retention limits that decide how far back a question can reach.",
  covers:["The system schemas, and what's in each","Billing, usage and cost attribution","Audit events and access history","Enabling schemas, and retention","Queries worth keeping as dashboards"] },

{ id:20, cat:"governance", name:"Catalog Federation", price:7.99, status:"soon",
  idea:"Federating a catalog changes who is authoritative.",
  desc:"Bringing an external Hive metastore or Glue catalog under Unity Catalog governance without a full migration. Covers what becomes read-only, how permissions map, and the path from federated to fully migrated.",
  covers:["Federated catalogs, and how they're registered","Read-only boundaries","Permission mapping","Coexisting with the legacy metastore","Moving from federated to migrated"] },

{ id:21, cat:"governance", name:"Clean Rooms", price:9.99, status:"soon",
  idea:"Both parties see the output; neither sees the input.",
  desc:"Privacy-preserving collaboration across organisations. Covers collaborator setup, approved notebooks, and the output constraints that make the guarantee real rather than promised.",
  covers:["Creating a clean room and adding collaborators","Approved assets and notebooks","Output rules and aggregation thresholds","What each party can observe","Auditing and lifecycle"] },

{ id:22, cat:"governance", name:"Unity Catalog Metrics", price:7.99, status:"soon",
  idea:"Define the metric once, and let every tool agree.",
  desc:"Metric views as governed, reusable definitions. Covers dimensions and measures, how metrics are queried from SQL and BI tools, and how this ends the argument about whose revenue number is right.",
  covers:["Metric views: measures and dimensions","Querying metrics from SQL and BI","Governance and permissions","Certification and discovery","Migrating metrics out of dashboards"] },

/* ══ 05 · SERVING & BI ═══════════════════════════════════ */
{ id:23, cat:"serving", name:"Lakebase", price:12.99, status:"soon", pages:46,
  idea:"Lakebase is stateless Postgres compute on top of lake storage.",
  desc:"Managed Postgres built on the lakehouse. Covers the project, branch and endpoint model, scale-to-zero behaviour, synced tables, and every documented quota — the ones that shape architecture decisions.",
  covers:["Projects, branches and endpoints","Scale-to-zero and autoscaling","Synced tables and change data feed","OAuth, roles and connection limits","Storage, branch and concurrency quotas"] },

{ id:24, cat:"serving", name:"Databricks SQL Warehouses", price:12.99, status:"soon",
  idea:"The warehouse decides latency; the table decides cost.",
  desc:"Sizing, scaling and cost control for SQL warehouses. Covers classic, pro and serverless, the difference between scaling up and out, and how caching and result reuse actually behave under concurrency.",
  covers:["Classic, pro and serverless compared","Cluster size vs scaling for concurrency","Auto-stop, warm starts and cold latency","Result cache, disk cache and query profile","Query queuing, and diagnosing slow dashboards"] },

{ id:25, cat:"serving", name:"Databricks Apps", price:9.99, status:"soon",
  idea:"The app runs as an identity, not as the person using it.",
  desc:"Building and deploying interactive apps on the platform. Covers the supported frameworks, the authorisation model that decides what a user actually sees, and the resource limits apps run inside.",
  covers:["Supported frameworks and app structure","App identity vs user identity","Granting access to data and warehouses","Environment, secrets and dependencies","Deployment, logs and resource limits"] },

{ id:26, cat:"serving", name:"AI/BI Dashboards", price:9.99, status:"soon",
  idea:"A dashboard is a set of queries with a refresh policy.",
  desc:"Building dashboards that stay fast and stay correct. Covers datasets and parameters, scheduled refresh, and the credential question — whose permissions a shared dashboard actually runs under.",
  covers:["Datasets, parameters and filters","Publishing with or without embedded credentials","Scheduled refresh and subscriptions","Performance: what to push into the table","Migrating from legacy dashboards"] },

{ id:27, cat:"serving", name:"AI/BI Genie", price:9.99, status:"soon",
  idea:"Genie is only as good as the context you give it.",
  desc:"Natural-language analytics over your tables. Covers what makes a Genie space accurate — instructions, example queries, trusted assets — and how to evaluate answers rather than trusting them.",
  covers:["Genie spaces and their scope","Instructions, sample queries and trusted assets","Metric views and certified data","Evaluating and correcting answers","Where Genie is a poor fit"] },

/* ══ 06 · AI & ML ════════════════════════════════════════ */
{ id:28, cat:"aiml", name:"MLflow 3 & Model Lifecycle", price:12.99, status:"soon",
  idea:"A model in Unity Catalog is a governed object, not a file.",
  desc:"Experiment tracking through to registered, versioned models. Covers what changed in MLflow 3, aliases replacing stages, and how model governance inherits the same grant chain as tables.",
  covers:["Tracking, runs and experiments","Models in Unity Catalog","Aliases and versions, not stages","Lineage and reproducibility","Promotion across workspaces"] },

{ id:29, cat:"aiml", name:"Model Serving", price:9.99, status:"soon",
  idea:"Serving cost is provisioned concurrency, not requests.",
  desc:"Deploying models behind endpoints. Covers scale-to-zero and its cold-start cost, traffic splitting for safe rollouts, and inference tables for monitoring what production actually sends you.",
  covers:["Endpoints, entities and traffic splitting","Scale-to-zero and cold starts","CPU, GPU and provisioned throughput","Inference tables and monitoring","External models behind one gateway"] },

{ id:30, cat:"aiml", name:"Feature Engineering", price:9.99, status:"soon",
  idea:"Training and serving must read the same feature, the same way.",
  desc:"Feature tables in Unity Catalog, and the skew they exist to prevent. Covers point-in-time lookups, online stores for low-latency serving, and how a feature specification travels with the model.",
  covers:["Feature tables and primary keys","Point-in-time lookups and training sets","Online tables for serving","Feature specs packaged with models","Lineage from feature to prediction"] },

{ id:31, cat:"aiml", name:"Vector Search", price:9.99, status:"soon",
  idea:"The index is a copy with a refresh policy.",
  desc:"Vector indexes for retrieval. Covers delta-sync versus direct-access indexes, embedding model choices, hybrid search, and the staleness question every RAG system eventually runs into.",
  covers:["Delta sync vs direct access indexes","Managed vs self-managed embeddings","Hybrid keyword and vector search","Filters, permissions and row-level access","Sync latency and index freshness"] },

{ id:32, cat:"aiml", name:"Mosaic AI Agent Framework", price:12.99, status:"soon",
  idea:"An agent is a model with tools and a permission problem.",
  desc:"Building, evaluating and deploying agents. Covers tool definition through Unity Catalog functions, the authoring and tracing model, and evaluation — the part teams skip and later regret.",
  covers:["Agent authoring and tracing","Unity Catalog functions as tools","Retrieval and grounding","Agent evaluation and review apps","Deployment, and what the agent runs as"] },

{ id:33, cat:"aiml", name:"Foundation Model APIs", price:9.99, status:"soon",
  idea:"Pay-per-token and provisioned throughput are different products.",
  desc:"Calling foundation models on the platform. Covers the two consumption models and when each makes sense, rate limits, batch inference over a table, and routing external providers through one governed gateway.",
  covers:["Pay-per-token vs provisioned throughput","Available models and endpoints","Rate limits and quotas","Batch inference with ai_query","External models and the AI Gateway"] },

{ id:34, cat:"aiml", name:"Agent Bricks / Unity AI Gateway", price:9.99, status:"soon",
  idea:"One gateway, so every model call is governed the same way.",
  desc:"Centralised control over AI usage. Covers rate limiting, payload logging, guardrails and cost attribution across providers — the layer that makes AI spend auditable instead of surprising.",
  covers:["Gateway configuration and routing","Rate limits and usage tracking","Payload logging and inference tables","Guardrails and safety filters","Cost attribution by team"] },

/* ══ 07 · PLATFORM & OPS ═════════════════════════════════ */
{ id:35, cat:"platform", name:"Databricks Asset Bundles / CI-CD", price:12.99, status:"soon",
  idea:"If it isn't in the bundle, it isn't deployed.",
  desc:"Defining jobs, pipelines and compute as code. Covers bundle structure, targets and variable substitution, and the CI/CD patterns that let one definition run in dev, staging and production.",
  covers:["Bundle structure and databricks.yml","Targets, variables and overrides","Deploying jobs, pipelines and models","CI/CD with GitHub Actions or Azure DevOps","Service principals and deployment identity"] },

{ id:36, cat:"platform", name:"Cost Management & FinOps", price:12.99, status:"soon",
  idea:"You cannot attribute what you did not tag.",
  desc:"Understanding and controlling platform spend. Covers the billing system tables, budget policies, tagging strategy, and the compute decisions that quietly account for most of the bill.",
  covers:["Billing system tables and usage queries","Tagging strategy and cost attribution","Budgets, alerts and policies","All-purpose vs job vs serverless compute","Photon, auto-stop and rightsizing"] },

{ id:37, cat:"platform", name:"Compute Configuration", price:9.99, status:"soon",
  idea:"Access mode decides more than size ever will.",
  desc:"Choosing and configuring compute. Covers access modes and what each one forbids, autoscaling and spot instances, pools for start-up latency, and cluster policies as governance rather than suggestion.",
  covers:["Standard, dedicated and no-isolation access modes","Autoscaling, spot instances and pools","Instance families and rightsizing","Cluster policies and enforcement","Init scripts and libraries"] },

{ id:38, cat:"platform", name:"Observability & Monitoring", price:9.99, status:"soon",
  idea:"Success and failure are not the only two states.",
  desc:"Knowing what your platform is doing. Covers the query profile, Spark UI, job run history and system tables — and the degradation that a pass/fail alert will never surface.",
  covers:["Query profile and Spark UI in practice","Job run history and duration thresholds","Streaming backlog and lag metrics","System tables as an observability source","Alerting on trends, not just failures"] },

{ id:39, cat:"platform", name:"Disaster Recovery", price:12.99, status:"soon",
  idea:"A backup that references its source is not a backup.",
  desc:"Designing for regional failure. Covers RPO and RTO decisions, deep clone as an incremental DR target, replicating metastore and workspace configuration, and testing the plan before you need it.",
  covers:["RPO, RTO and realistic targets","Deep clone and incremental sync","Replicating Unity Catalog and workspace config","Active-passive vs active-active","Failover testing and runbooks"] },

{ id:40, cat:"platform", name:"Terraform Provider", price:9.99, status:"soon",
  idea:"State drift is the real failure mode.",
  desc:"Managing Databricks with Terraform. Covers provider authentication, account versus workspace resources, module structure for multiple environments, and importing infrastructure created by hand.",
  covers:["Provider setup and authentication","Account-level vs workspace-level resources","Modules and multi-environment layout","Importing existing resources","Drift, and what not to manage in Terraform"] },

{ id:41, cat:"platform", name:"Serverless Compute", price:9.99, status:"soon",
  idea:"Versionless means you don't choose when it changes.",
  desc:"What serverless gives you and what it takes away. Covers the restrictions across workload types, environment versions, networking constraints, and a cost model that behaves nothing like a cluster.",
  covers:["Serverless for notebooks, jobs, pipelines and SQL","What's unsupported, by workload","Environment versions and dependencies","Networking and egress control","Cost model and budget policies"] },

{ id:42, cat:"platform", name:"CLI / SDK / REST API", price:9.99, status:"soon",
  idea:"The API is the product; the UI is one client.",
  desc:"Automating the platform. Covers CLI configuration and profiles, the Python and Go SDKs, authentication including OAuth and service principals, and the pagination and rate limits that break naive scripts.",
  covers:["CLI setup, profiles and authentication","Python and Go SDK basics","OAuth, tokens and service principals","Rate limits, pagination and retries","Scripting common operations safely"] },

{ id:43, cat:"platform", name:"Git Folders & Dev Workflow", price:7.99, status:"soon",
  idea:"A notebook in a repo is still a notebook.",
  desc:"Source control for Databricks work. Covers Git folders and their limits, notebook formats and diffing, branching for teams sharing a workspace, and the path from an interactive notebook to a deployed asset.",
  covers:["Git folders, and what they can't do","Notebook source formats and diffs","Branching strategy in a shared workspace","Testing notebooks and Python modules","From notebook to bundle to production"] },

/* ══ 08 · SECURITY ═══════════════════════════════════════ */
{ id:44, cat:"security", name:"Networking", price:12.99, status:"soon",
  idea:"Every connection has two ends, and both need a rule.",
  desc:"Securing traffic in and out. Covers VPC and VNet injection, private connectivity to the control plane, egress control, and the serverless networking model that works differently from classic compute.",
  covers:["VPC/VNet injection and customer-managed networks","Private Link and private endpoints","IP access lists and front-end controls","Egress control and firewall rules","Serverless network connectivity"] },

{ id:45, cat:"security", name:"Identity & Access", price:12.99, status:"soon",
  idea:"Identity is account-level; entitlement is workspace-level.",
  desc:"Users, groups and service principals across account and workspace. Covers SCIM provisioning, SSO, group inheritance, and why production workloads should never run as a person.",
  covers:["Account vs workspace identity","SCIM provisioning and SSO","Groups, nesting and inheritance","Service principals and OAuth","Entitlements and admin roles"] },

{ id:46, cat:"security", name:"Secrets Management", price:9.99, status:"soon",
  idea:"A secret in a notebook is not a secret.",
  desc:"Storing and using credentials properly. Covers secret scopes, redaction and its limits, the difference between secrets and service credentials, and rotation without breaking running jobs.",
  covers:["Secret scopes: Databricks and key-vault backed","Reading secrets, and redaction behaviour","Secrets vs service credentials","Rotation without downtime","Auditing secret access"] },

{ id:47, cat:"security", name:"Encryption & CMK", price:9.99, status:"soon",
  idea:"Customer-managed keys move the risk, not the responsibility.",
  desc:"Encryption at rest and in transit. Covers customer-managed keys for managed services and storage, key rotation and revocation, and what actually happens to running workloads when access to a key is lost.",
  covers:["Encryption at rest and in transit by default","CMK for managed services and workspace storage","Key rotation and revocation","Impact on running workloads","Compliance evidence and auditing"] },

{ id:48, cat:"security", name:"Compliance Profiles", price:7.99, status:"soon",
  idea:"A compliance profile constrains the platform, not just the paperwork.",
  desc:"Enabling HIPAA, PCI-DSS, FedRAMP and similar profiles. Covers what each enforces, the features they restrict, and the operational changes teams have to make once a profile is switched on.",
  covers:["Available profiles, and where they're supported","Enhanced security monitoring","Features restricted under each profile","Operational impact on teams","Evidence and audit reporting"] },

/* ══ 09 · MIGRATION ══════════════════════════════════════ */
{ id:49, cat:"migration", name:"Hive Metastore → Unity Catalog", price:12.99, status:"soon",
  idea:"Migrate the governance model, not just the tables.",
  desc:"The migration most Databricks estates still owe. Covers UCX assessment, managed and external table strategies, rewriting three-level namespaces, and running both metastores while you cut over.",
  covers:["Assessment with UCX","Managed vs external table migration paths","Two-level to three-level namespaces","Migrating permissions and ownership","Coexistence, and cutting over safely"] },

{ id:50, cat:"migration", name:"DBFS Mounts → Volumes", price:9.99, status:"soon",
  idea:"A mount is a workspace-wide credential with no owner.",
  desc:"Replacing mounts with governed Volumes. Covers why mounts are a governance hole, mapping mounts to external locations and volumes, rewriting paths, and finding every reference before you remove one.",
  covers:["Why mounts can't be governed","External locations and storage credentials","Managed vs external volumes","Rewriting dbfs: paths safely","Finding every reference before removal"] },

{ id:51, cat:"migration", name:"Snowflake / Synapse / Hadoop Migration", price:12.99, status:"soon",
  idea:"Port the workload, not the architecture.",
  desc:"Moving from another platform without importing its assumptions. Covers SQL dialect differences, warehouse-to-lakehouse modelling, what does and doesn't translate from Hadoop, and validating that results match.",
  covers:["SQL dialect and function mapping","Warehouse modelling vs lakehouse layout","Hadoop, Hive and HDFS equivalents","Migrating orchestration and security","Parallel running and result validation"] },
];

/* ---- Bundles ----------------------------------------------- */

const BUNDLES = [
  { id:"b-ingestion",      cat:"ingestion",      name:"Ingestion Bundle",             count:4, price:24.99, status:"soon",
    desc:"Everything about getting data in — and every way it fails quietly." },
  { id:"b-storage",        cat:"storage",        name:"Storage Bundle",               count:5, price:34.99, status:"soon",
    desc:"The table format, its log, its layout, and the guarantees it carries." },
  { id:"b-transformation", cat:"transformation", name:"Transformation Bundle",        count:5, price:34.99, status:"soon",
    desc:"Pipelines, the engine underneath them, and what orchestrates it all." },
  { id:"b-governance",     cat:"governance",     name:"Governance Bundle",            count:8, price:49.99, status:"soon",
    desc:"Access, sharing, monitoring and audit — the whole control surface." },
  { id:"b-serving",        cat:"serving",        name:"Serving / BI Bundle",          count:5, price:39.99, status:"soon",
    desc:"Warehouses, apps and dashboards, and making them fast." },
  { id:"b-aiml",           cat:"aiml",           name:"AI / ML Bundle",               count:7, price:54.99, status:"soon",
    desc:"Models, features, vectors and agents, from tracking to serving." },
  { id:"b-platform",       cat:"platform",       name:"Platform / Operations Bundle", count:9, price:59.99, status:"soon",
    desc:"Deployment, cost, compute, and staying up when a region doesn't." },
  { id:"b-security",       cat:"security",       name:"Security / Networking Bundle", count:5, price:39.99, status:"soon",
    desc:"Networking, identity, secrets and encryption, configured properly." },
  { id:"b-migration",      cat:"migration",      name:"Migration Bundle",             count:3, price:29.99, status:"soon",
    desc:"Getting off the old thing without losing what protected you." },
];

/* ---- Collections ------------------------------------------- */

const COLLECTIONS = [
  { id:"c-free", tier:"free", name:"Auto Loader", kicker:"Start here",
    price:0, priceLabel:"Free", status:"free", slug:"",
    contents:"One complete 47-page guide",
    points:["The full field manual, not a sample",
            "16 failure modes with symptom, cause and fix",
            "Eight production patterns and a cheat sheet",
            "Read it before you consider anything else"] },

  { id:"c-de", tier:"collection", name:"Data Engineering Collection", kicker:"The core path",
    price:69.99, priceLabel:"$69.99", status:"soon",
    contents:"Ingestion + Storage + Transformation · 14 guides",
    points:["The complete data path, end to end",
            "Ingest, store, transform, orchestrate",
            "Over 500 pages",
            "Cheaper than the three bundles separately"] },

  { id:"c-lib", tier:"library", name:"Complete Library", kicker:"Everything",
    price:89.99, priceLabel:"$89.99", status:"soon",
    contents:"Everything available now, plus every future guide",
    points:["All 51 guides as they ship",
            "Early-access price locked for life",
            "Free updates when guides are revised",
            "One purchase, no subscription"] },
];
