import type { Exercise, Phase } from "../model";

/** The four deliverables every capstone produces */
export const deliverables: Exercise[] = [
  {
    title: "Architecture diagram",
    d: "Use Excalidraw, Lucidchart or a similar tool.",
    steps: [
      "Show every component, data store and external system",
      "Mark data flows, sync vs async calls and trust boundaries",
      "Highlight the latency-critical path",
    ],
  },
  {
    title: "Design document",
    d: "10–15 pages that an architecture review could sign off on.",
    steps: [
      "Requirements, including the non-functional ones: latency, throughput, availability and compliance",
      "Data model and API design",
      "Scaling strategy, with rough capacity numbers",
      "Failure modes: what breaks, what the user sees and how the system recovers",
      "Security and cost: the threat model and a monthly cost estimate",
    ],
  },
  {
    title: "Trade-off analysis",
    d: "Why you chose X over Y for each key decision.",
    steps: [
      "For each key decision, list the options you considered",
      "Name the criteria that decided it and what you gave up",
      "State what would have to change for you to choose differently",
    ],
  },
  {
    title: "Recorded walkthrough",
    d: "A 15-minute recording that explains the design.",
    steps: [
      "Follow one request or event through the system end to end",
      "Explain the three most important trade-offs",
      "Close with the biggest open risk and how you would reduce it",
    ],
  },
];

export const phase7: Phase = {
  n: 7,
  title: "Capstone: Design Complete Systems",
  weeks: "Weeks 53–60",
  summary:
    "Four end-to-end designs that pull the earlier phases together: streaming data, feature stores, model serving, RAG, agents, multi-tenancy, security, compliance and cost. Each one is a design exercise, not a build, and produces the documents an architecture review would ask for: a diagram, a 10–15 page design document, a trade-off analysis and a recorded 15-minute walkthrough.\n\nThe hard part is rarely a single component. It is the seams between them: consistency across services, what fails and who notices, and which requirement gives way when two of them conflict.",
  modules: [
    {
      id: "7.1",
      title: "Enterprise Fraud Detection System",
      summary:
        "Score every payment for fraud within a tight latency budget, and explain each decision to an analyst and an auditor. It pulls together data pipelines and data mesh (Phase 2), feature stores, model serving and RAG (Phase 3), event-driven ingestion (Phase 4), and audit and security (Phase 6).\n\nThe hard part is the latency budget and the feature freshness it forces. At 100K transactions a second, every enrichment lookup and every explanation must fit inside 100 ms, and the features used at scoring time must match the ones the model was trained on.",
      topics: [
        {
          title: "Requirements",
          summary:
            "A throughput target, a latency budget, and an explainability and audit bar. Read them as constraints on each other: the latency budget limits which enrichments and which explanation methods are possible at all.",
          items: [
            {
              t: "100K transactions per second",
              d: "Ingest from several sources (card network, web, mobile, partners) at a sustained 100K events a second, with headroom for peaks such as sale days.",
              sub: [
                "Partitioning: key by account or card so each account's state stays on one worker",
                "Back-pressure: decide what happens when scoring falls behind: queue, degrade to rules, or approve by default",
              ],
            },
            {
              t: "Real-time enrichment",
              d: "Join each transaction with the customer profile, device telemetry and geolocation before scoring. Every lookup sits on the hot path, so it needs a low-latency store or precomputed features, not a warehouse query.",
            },
            {
              t: "Sub-100 ms detection",
              d: "Score each transaction within 100 ms end to end, so the payment can be approved, declined or held in time. Split the budget across ingestion, enrichment, scoring and response, and measure each part.",
            },
            {
              t: "Explainable decisions",
              d: "Every flag carries reasons an analyst can act on and a customer or regulator can be given, such as the top contributing factors. Store the explanation with the decision rather than recomputing it later against a newer model.",
            },
            {
              t: "Audit and retention",
              d: "Keep an immutable record of each decision: input features, model version, score, threshold and outcome. Retention periods come from financial regulation, and personal data must still be removed once they expire.",
            },
          ],
        },
        {
          title: "Architecture components",
          summary:
            "A streaming backbone, a stream processor that computes features, a feature store that serves them, a model server on the scoring path and analyst tools off it. For each component, keep asking whether it sits on the 100 ms path.",
          items: [
            {
              t: "Event-driven ingestion",
              d: "Kafka or Kinesis as the durable backbone. Every transaction is an event, partitioned by account so ordering holds per account.",
            },
            {
              t: "Stream processing",
              d: "Flink or Spark Structured Streaming computes rolling features (spend in the last hour, new device, distance from the last transaction) using keyed state and checkpoints. Flink handles each event as it arrives, while Spark's default micro-batches add latency, which matters on a 100 ms budget.",
            },
            {
              t: "Feature store",
              d: "Feast or Tecton keeps an online store for millisecond lookups at scoring time and an offline store with point-in-time correct history for training, so the model sees the same features in both.",
            },
            {
              t: "Model serving",
              d: "Serve the fraud models, usually gradient-boosted trees or small neural networks, with NVIDIA Triton or a similar model server. vLLM is built for large language models and doesn't belong on this path.",
              sub: [
                "Tree models: Triton's FIL backend serves XGBoost and LightGBM models on GPU or CPU",
                "Dynamic batching: group concurrent requests without breaking the latency budget",
                "Shadow and canary: run a new model on live traffic alongside the current one before it makes decisions",
              ],
            },
            {
              t: "RAG for historical patterns",
              d: "Vector search over confirmed past fraud cases finds similar patterns, and an LLM can summarise them for an analyst. This belongs in the investigation workflow, off the 100 ms path; similarity scores can still feed the model as precomputed features.",
            },
            {
              t: "Analyst dashboard",
              d: "Superset or Metabase for fraud trends, alert queues and model performance, reading from an analytical store rather than the operational one.",
            },
          ],
        },
        {
          title: "Key decisions",
          summary:
            "Each decision has more than one defensible answer. What the review looks for is the options you weighed, the criteria that decided it and what you gave up.",
          items: [
            {
              t: "Batch vs stream processing",
              d: "Streaming gives fresh features at scoring time but costs more to build and run; batch is simpler and cheaper but features lag by hours. Most designs mix both, so the question is which features must be fresh and how much fraud slips through while a feature is stale.",
            },
            {
              t: "Consistency model",
              d: "Strong consistency on values like a card's running spend stops two concurrent transactions from both seeing the same unspent limit, but adds coordination latency. Eventual consistency is faster but leaves a short window to exploit; the choice hinges on which values an attacker can race and what that window costs.",
            },
            {
              t: "Data mesh vs data lake",
              d: "A data mesh lets each source domain (cards, payments, identity) own and publish its data as a product; a central lake gives one team control of quality and one place to build training sets. It hinges on how many source teams there are, how mature they are, and how much cross-domain joining the models need.",
            },
            {
              t: "Explainability strategy",
              d: "SHAP gives consistent per-feature attributions and has a fast exact algorithm for tree models; LIME works with any model but is slower and less stable; hand-built reason codes are fast and readable but must be maintained. It hinges on the model type, whether explanations are computed inside the latency budget or afterwards, and who reads them.",
            },
          ],
        },
      ],
      mentalModels: [
        "Draw the 100 ms path first. Everything off it can be slower, cheaper and more elaborate.",
        "A fraud model is only as good as the match between its training features and its serving features.",
      ],
      exercises: [...deliverables],
      resources: [
        {
          kind: "docs",
          title: "Feast documentation",
          url: "https://docs.feast.dev/",
          free: true,
          note: "Online and offline stores, point-in-time correct training data",
        },
        {
          kind: "docs",
          title: "Apache Flink: Stateful Stream Processing",
          url: "https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/stateful-stream-processing/",
          free: true,
          note: "Keyed state, checkpoints and exactly-once state consistency",
        },
        {
          kind: "docs",
          title: "NVIDIA Triton Inference Server",
          url: "https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/index.html",
          free: true,
        },
        {
          kind: "docs",
          title: "SHAP documentation",
          url: "https://shap.readthedocs.io/en/latest/",
          free: true,
        },
      ],
    },
    {
      id: "7.2",
      title: "Multi-Tenant CRM with AI Lead Scoring",
      summary:
        "A SaaS CRM where many companies share one platform, each with its own data, custom fields and AI features. It exercises multi-tenant data design (Phase 2), ML features and RAG (Phase 3), event-driven integration (Phase 4), multi-region deployment (Phase 5), and tenant-level security and cost allocation (Phase 6).\n\nThe hard part is that isolation has to hold everywhere at once: database, caches, search and vector indexes, logs, models and the bill. One tenant's deal appearing in another tenant's AI answer is the failure that ends a SaaS business, and each shortcut that saves cost makes it a little more likely.",
      topics: [
        {
          title: "Requirements",
          summary:
            "SaaS basics (isolation, customisation, global reach) combined with AI features that must respect the same boundaries. Note where they pull against each other: per-tenant custom fields complicate both shared schemas and shared models.",
          items: [
            {
              t: "Tenant isolation",
              d: "No tenant can read, change or infer another tenant's data, configuration or performance. Isolation covers data, compute (noisy neighbours) and configuration.",
            },
            {
              t: "Custom fields per tenant",
              d: "Tenants add their own fields and objects without a schema migration for each one.",
              sub: [
                "JSONB column: flexible and indexable in Postgres, with weaker typing and validation",
                "Entity-attribute-value tables: fully dynamic, but queries become slow and awkward",
                "Pre-allocated generic columns: fast, but capped in number and opaque to read",
              ],
            },
            {
              t: "AI lead scoring",
              d: "Predict each lead's probability of converting. Small tenants may not have enough history for a model of their own, which shapes whether you train one global model, one per tenant, or a shared model adjusted per tenant.",
            },
            {
              t: "RAG for deal insights",
              d: "Retrieve similar historical deals to explain a score or suggest next steps. Retrieval must only ever return the requesting tenant's deals and, within that tenant, only deals the user may see.",
            },
            {
              t: "Multi-region deployment",
              d: "Serve global customers with acceptable latency and, for tenants that need it, keep their data in a chosen region.",
            },
          ],
        },
        {
          title: "Architecture components",
          summary:
            "The components are ordinary; what makes the design is where tenant context is attached and enforced. Trace a request from the gateway to the database and the vector index, and check the tenant boundary at every hop.",
          items: [
            {
              t: "Multi-tenant database design",
              d: "Choose among a database per tenant, a schema per tenant, or shared tables with a tenant id enforced by row-level security.",
              sub: [
                "Row-level security: Postgres policies filter every query by tenant; table owners and roles with BYPASSRLS skip the policies unless the table uses FORCE ROW LEVEL SECURITY",
                "Tenant context: set the tenant id per connection or transaction in one place in the data access layer, never in individual queries",
              ],
            },
            {
              t: "Event-driven updates",
              d: "Change data capture (for example Debezium) streams database changes to scoring, search and analytics, and outbound webhooks notify tenants' own systems. Every event carries its tenant id.",
            },
            {
              t: "Per-tenant vector isolation",
              d: "The vector database for RAG enforces tenant boundaries, either with a namespace, collection or index per tenant or with a mandatory tenant filter on every query.",
            },
            {
              t: "Lead scoring feature store",
              d: "Features such as engagement, firmographics and activity recency, computed per tenant and served online at scoring time, with tenant-specific custom fields mapped into model features.",
            },
            {
              t: "Tenant-aware API gateway",
              d: "Authenticates the tenant, attaches tenant context to each request, and applies per-tenant rate limits and quotas so one tenant's bulk import can't starve the others.",
            },
          ],
        },
        {
          title: "Key decisions",
          summary:
            "Most of these are the same question asked at different layers: how much isolation to buy, and with what. Keep the answers consistent, or document why a layer differs.",
          items: [
            {
              t: "Tenant isolation strategy",
              d: "A database per tenant isolates most strongly and makes per-tenant backup and residency easy, but costs the most and slows fleet-wide migrations; shared tables with row-level security are cheapest to run but depend on every path enforcing the tenant filter; schemas sit in between. It hinges on tenant count and size, compliance demands, and whether large tenants will pay for dedicated resources in a tiered model.",
            },
            {
              t: "Data governance",
              d: "Global policies are consistent and easy to audit; per-tenant policies let enterprise customers set their own retention, residency and access rules but multiply the configurations you must test. It hinges on how many tenants need custom terms and whether the product can express them as settings.",
            },
            {
              t: "Cost allocation",
              d: "Chargeback per tenant needs costs attributed to tenants, which is easy for dedicated resources and hard for shared ones such as a pooled database or a shared model endpoint. It hinges on whether pricing tiers must track real cost and how much metering you are willing to build.",
            },
            {
              t: "RAG isolation",
              d: "Separate indexes or namespaces per tenant give physical isolation and trivial offboarding, but many small indexes can cost more to run; one shared index with a tenant filter is cheaper, but a single missing filter leaks data, and filtered search can be slower. It hinges on tenant count, index sizes, and whether the filter is enforced in one service or trusted to every caller.",
            },
          ],
        },
      ],
      mentalModels: [
        "Every table, cache key, index, event and log line needs a tenant id. The one that doesn't is where the leak happens.",
      ],
      exercises: [...deliverables],
      resources: [
        {
          kind: "paper",
          title: "SaaS Tenant Isolation Strategies (AWS whitepaper)",
          url: "https://docs.aws.amazon.com/whitepapers/latest/saas-tenant-isolation-strategies/saas-tenant-isolation-strategies.html",
          free: true,
          note: "AWS now marks it as historical reference, but the silo, pool and bridge models still apply",
        },
        {
          kind: "docs",
          title: "PostgreSQL: Row Security Policies",
          url: "https://www.postgresql.org/docs/current/ddl-rowsecurity.html",
          free: true,
        },
        {
          kind: "docs",
          title: "Implement multitenancy (Pinecone)",
          url: "https://docs.pinecone.io/guides/index-data/implement-multitenancy",
          free: true,
          note: "Namespace per tenant vs metadata filtering, with the isolation and cost trade-offs",
        },
      ],
    },
    {
      id: "7.3",
      title: "Agentic Travel Planning System",
      summary:
        "A set of cooperating agents that plans a trip, researches options, books it and keeps it within budget, with the traveller approving the decisions that matter. It exercises agentic patterns and RAG (Phase 3), integration with external services (Phase 4), and least-privilege design for AI (Phase 6).\n\nThe hard part is that agents take real, costly actions against third-party APIs that fail, time out and change prices. You have to decide what an agent may do alone, how a half-finished booking is undone, and how a plan that runs for days keeps its state consistent across agents.",
      topics: [
        {
          title: "Requirements",
          summary:
            "Planning, research, booking and budgeting, with a person in the loop. The requirements that involve money and irreversible actions deserve most of the design effort.",
          items: [
            {
              t: "Multi-agent itinerary planning",
              d: "Specialised agents cooperate to turn a request ('ten days in Japan in April, mid-range budget') into a day-by-day plan. Justify each agent, since one agent with good tools is often simpler and more reliable.",
            },
            {
              t: "RAG for destination content",
              d: "Retrieve destination guides, hotel details and activities from curated sources. Prices and availability change by the minute, so they come from live APIs, not the index.",
            },
            {
              t: "Booking integrations",
              d: "Book flights, hotels and activities through partner APIs. A trip is several bookings that can fail partway, so each needs a compensating action (cancel or refund) for when a later step fails.",
            },
            {
              t: "Human-in-the-loop",
              d: "The traveller approves expensive, irreversible or ambiguous decisions before the system acts, with enough context to decide quickly.",
            },
            {
              t: "Budget tracking",
              d: "Track committed and planned spend against the budget, including exchange rates and fees, and optimise the plan within it.",
            },
          ],
        },
        {
          title: "Architecture components",
          summary:
            "An orchestrator with durable state, retrieval over curated content, narrow tools around external APIs, memory and approval checkpoints. Most failures happen at the tool boundary, so design it like any other integration layer.",
          items: [
            {
              t: "Multi-agent orchestration",
              d: "Planner, researcher, booker and budget manager roles, coordinated by a supervisor or a defined graph (for example LangGraph) with persisted state, so a plan survives restarts and can wait days for approval.",
            },
            {
              t: "RAG with a vector database",
              d: "Destination, hotel and activity content indexed with metadata (location, season, price band) for filtered retrieval. Treat third-party content as untrusted: a hotel description can carry an indirect prompt injection.",
            },
            {
              t: "Tool integration",
              d: "Flight, hotel, weather and payment APIs wrapped as narrow tools with typed inputs, timeouts and retries.",
              sub: [
                "Idempotency: every booking call carries an idempotency key, or checks for an existing booking before retrying, so a retry never double-books",
                "Payments: use the payment provider's tokenization so card data never passes through the model or your logs, which keeps PCI DSS scope small",
                "Partner limits: each API has its own rate limits and quotas that the orchestrator must respect",
              ],
            },
            {
              t: "Memory management",
              d: "Short-term memory for the current planning session and long-term memory of preferences and past trips. Long-term memory holds personal data, so it needs consent, retention limits and a way to delete it.",
            },
            {
              t: "Human-in-the-loop checkpoints",
              d: "The workflow pauses at defined points, persists its state, presents a proposal and resumes on approve, edit or reject. The checkpoint must show the exact action and cost that will run.",
            },
          ],
        },
        {
          title: "Key decisions",
          summary:
            "Most of these decisions are about control: how much autonomy each agent gets, and where a person or a hard rule takes over. Frame each one by the cost of a wrong action.",
          items: [
            {
              t: "Agent coordination pattern",
              d: "A central orchestrator is easier to trace, test and constrain; decentralised agents that hand off to each other are more flexible but harder to debug and can loop. It hinges on how predictable the workflow is: a mostly fixed flow suits a defined graph, open-ended research suits more autonomy.",
            },
            {
              t: "Memory strategy",
              d: "Shared memory keeps agents consistent but lets one agent's mistake or injected content spread to the rest; per-agent memory contains errors but needs explicit hand-offs. It hinges on how much context agents really need to share and who is allowed to write to shared state.",
            },
            {
              t: "Tool permissioning",
              d: "Decide what each agent may do alone, for example search and hold freely, book within limits, and pay only with approval. It hinges on reversibility, the money at stake, cancellation terms, and how quickly you can detect a wrong action.",
            },
            {
              t: "Human escalation criteria",
              d: "Escalate too often and people stop reading the approvals; too rarely and the system spends money it shouldn't. Criteria can combine cost thresholds, irreversibility, low confidence and conflicts with stated preferences, and they hinge on the cost of a wrong action against the cost of an interruption.",
            },
          ],
        },
      ],
      mentalModels: [
        "Give each agent the smallest set of tools that does its job. The model's judgement is not an access control.",
      ],
      exercises: [...deliverables],
      resources: [
        {
          kind: "docs",
          title: "LangGraph: Interrupts",
          url: "https://docs.langchain.com/oss/python/langgraph/interrupts",
          free: true,
          note: "Pausing for human approval, checkpointed state and resuming",
        },
        {
          kind: "article",
          title: "Building Effective Agents (Anthropic)",
          url: "https://www.anthropic.com/engineering/building-effective-agents",
          free: true,
          note: "Workflows vs agents, and when orchestrator-workers is worth it",
        },
        {
          kind: "docs",
          title: "OWASP LLM06:2025 Excessive Agency",
          url: "https://genai.owasp.org/llmrisk/llm062025-excessive-agency/",
          free: true,
          note: "Excessive functionality, permissions and autonomy, and how to limit each",
        },
      ],
    },
    {
      id: "7.4",
      title: "Healthcare Patient Record Integration & Risk Prediction",
      summary:
        "Bring patient records from several hospital systems into one normalised view, and predict readmission risk for clinicians. It exercises data integration and data mesh (Phase 2), ML system design and RAG (Phase 3), and security, compliance and data residency (Phase 6).\n\nThe hard parts are messy, inconsistent source data and a regulatory bar that applies to every copy of it. A risk model is only useful if clinicians trust it, and trust depends on clear explanations and on knowing how the model performs for patients like theirs.",
      topics: [
        {
          title: "Requirements",
          summary:
            "Regulatory safeguards, integration across heterogeneous sources, standard vocabularies, a prediction and explanations for clinicians. Compliance applies to every requirement below, not only the first.",
          items: [
            {
              t: "HIPAA compliance",
              d: "Protect electronic protected health information (ePHI) with the Security Rule's administrative, physical and technical safeguards, including access control, audit controls and transmission security.",
              sub: [
                "Encryption: an 'addressable' specification under the current Security Rule, meaning you implement it or document why an equivalent control is reasonable; a rule proposed in January 2025 would make it required, so design for encryption everywhere",
                "Business associate agreements: every vendor that handles PHI, including cloud and model API providers, needs a BAA",
                "Minimum necessary: users and services see only the PHI their task requires (a Privacy Rule standard)",
                "Audit trails: record who accessed which record and when, and actually review the logs",
              ],
            },
            {
              t: "EHR integration",
              d: "Ingest from several hospital systems (Epic, Oracle Health and others) that use different formats: HL7 v2 messages, FHIR APIs, C-CDA documents and flat-file exports.",
            },
            {
              t: "Code normalisation",
              d: "Map local codes to standard vocabularies so records from different hospitals mean the same thing.",
              sub: [
                "ICD-10-CM: diagnoses; the US clinical modification of the WHO's ICD-10, maintained by the CDC's National Center for Health Statistics",
                "LOINC: lab tests and other clinical observations",
                "Unmapped codes: route them to a terminology review queue instead of dropping them silently",
                "Others you will meet: SNOMED CT for clinical terms, RxNorm for medications",
              ],
            },
            {
              t: "Readmission risk prediction",
              d: "Predict the risk that a patient returns to hospital soon after discharge (commonly within 30 days) so care teams can intervene. Validate across hospitals and patient subgroups, since a model trained on one population can underperform on another.",
            },
            {
              t: "Clinician-facing explanations",
              d: "Show the factors behind each score in clinical terms (recent admissions, lab trends, missed follow-ups), not raw feature names, and make clear the score supports a decision rather than making it.",
            },
          ],
        },
        {
          title: "Architecture components",
          summary:
            "Secure ingestion, a terminology layer, versioned models, retrieval and continuous compliance checks. Count the copies of patient data each component creates (logs, caches, embeddings, prompts, backups), because every one of them is in scope.",
          items: [
            {
              t: "Secure data pipelines",
              d: "Encrypted transport from each hospital, encrypted storage, and an audit record for every read and transformation of PHI. Keep raw feeds separate from normalised data and restrict who can see each.",
            },
            {
              t: "Data normalisation",
              d: "A terminology service maps local codes to ICD-10-CM and LOINC, versions its mappings, and records which mapping produced each normalised value.",
            },
            {
              t: "Model registry with versioning",
              d: "Each model version is stored with its training data snapshot, validation results by hospital and subgroup, and approval record, so any past prediction can be traced to the exact model that made it.",
            },
            {
              t: "RAG over similar patient histories",
              d: "Retrieve comparable cases to give clinicians context. The retrieved records are PHI about other patients, so decide whether to de-identify them, limit them to the clinician's own organisation, or show only aggregates.",
            },
            {
              t: "Compliance monitoring",
              d: "Continuously check access logs for unusual patterns (one user opening many records, access with no care relationship), verify data stays in approved regions, and alert on violations.",
            },
          ],
        },
        {
          title: "Key decisions",
          summary:
            "In healthcare, compliance and trust are design inputs, not reviews at the end. Each decision below changes who holds the data, who is accountable for it, or what a clinician sees.",
          items: [
            {
              t: "Compliance architecture",
              d: "Options range from one hardened platform with central controls to per-hospital enclaves with their own keys and access policies. It hinges on how much control each hospital demands, who holds the encryption keys, and how audit evidence is produced for each organisation.",
            },
            {
              t: "Data mesh by hospital",
              d: "Treating each hospital as a domain that publishes normalised data products keeps ownership close to the source and fits separate legal entities; a central integration team gives consistent quality and faster cross-hospital models. It hinges on each hospital's data maturity and on who is accountable for mapping quality.",
            },
            {
              t: "Clinician-friendly explainability",
              d: "Options include feature attributions such as SHAP translated into clinical language, simpler models that are interpretable by design, and similar-patient examples. It hinges on how much accuracy you would trade for interpretability, how explanations are validated with clinicians, and whether they fit the clinical workflow.",
            },
            {
              t: "Data residency",
              d: "A requirement to keep patient data in-region usually comes from state law, hospital contracts or non-US regulation rather than from HIPAA itself. Options range from a separate deployment per jurisdiction to a global control plane with regional data planes; it hinges on which obligations apply and whether models may be trained across regions, for example on de-identified data.",
            },
          ],
        },
      ],
      mentalModels: [
        "Every copy of patient data is in scope for compliance, including logs, caches, embeddings and prompts. Count the copies.",
      ],
      exercises: [...deliverables],
      resources: [
        {
          kind: "docs",
          title: "Summary of the HIPAA Security Rule (HHS)",
          url: "https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html",
          free: true,
        },
        {
          kind: "docs",
          title: "HL7 FHIR Overview",
          url: "https://hl7.org/fhir/overview.html",
          free: true,
        },
        {
          kind: "docs",
          title: "About LOINC",
          url: "https://loinc.org/about/",
          free: true,
        },
        {
          kind: "docs",
          title: "ICD-10-CM (CDC National Center for Health Statistics)",
          url: "https://www.cdc.gov/nchs/icd/icd-10-cm/index.html",
          free: true,
        },
      ],
    },
  ],
};
