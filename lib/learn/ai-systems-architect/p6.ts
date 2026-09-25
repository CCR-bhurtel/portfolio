import type { Phase } from "../model";

export const phase6: Phase = {
  n: 6,
  title: "Security, Compliance & Cost Architecture",
  weeks: "Weeks 47–52",
  summary:
    "Security and cost are the two properties that are cheapest to design in and most expensive to bolt on. This phase covers both: how to protect data and systems when any component might be compromised, and how to keep a system affordable as usage grows.\n\nAI adds a twist to each. A model that reads untrusted text can be steered by it, and a feature that calls a large model on every request can cost more than it earns. The work here is to make these risks and costs visible while they are still design choices.",
  modules: [
    {
      id: "6.1",
      title: "Security Architecture",
      summary:
        "Security architecture decides who can do what, to which data, and what happens when one of those controls fails. It is less about any single tool than about layering controls so that one mistake does not become a breach.\n\nAI systems widen the attack surface: a model takes instructions from any text it reads, and an agent acts with whatever permissions you gave it. The central trade-off is friction against risk. Every control adds latency, cost or inconvenience, so spend it where the blast radius is largest.",
      topics: [
        {
          title: "Zero-Trust Architecture",
          summary:
            "Zero trust drops the idea of a trusted internal network. Every request, from a user or a service, is authenticated and authorized on its own merits, using identity, device state and context rather than network location (NIST SP 800-207).\n\nThe cost is more moving parts: an identity for every workload, a policy for every path and certificates to rotate. The payoff is that an attacker who gets into one component cannot move freely to the rest.",
          items: [
            {
              t: "Never trust, always verify",
              d: "No request is trusted because of where it comes from. Each one is authenticated and authorized per request, and trust is re-evaluated as context changes rather than granted once per session.",
              sub: [
                "Policy decision point: the component that weighs identity, device and context and returns allow or deny",
                "Policy enforcement point: the gateway, proxy or sidecar that applies that decision in the request path",
                "Continuous evaluation: short-lived tokens and repeated checks, so a revoked user or compromised device loses access quickly",
              ],
            },
            {
              t: "Least privilege access",
              d: "Every user, service and job gets only the permissions its task needs, for only as long as it needs them. Breaches usually get worse through over-broad permissions, not through the initial foothold.",
              sub: [
                "Scoped roles: a narrow IAM role per service instead of one shared admin credential",
                "Just-in-time access: elevated rights granted on request, time-boxed and logged",
                "Access reviews: periodically remove permissions nobody has used",
              ],
            },
            {
              t: "Micro-segmentation",
              d: "Split the network into small zones so each workload can reach only the peers it needs. It limits lateral movement after a compromise.",
              sub: [
                "Kubernetes NetworkPolicies: default-deny, then allow specific pod-to-pod flows",
                "Service mesh (Istio, Linkerd): mTLS between services plus identity-based authorization policies",
                "Cloud security groups: per-service firewall rules instead of one flat network",
              ],
            },
          ],
        },
        {
          title: "Authentication & Authorization",
          summary:
            "Authentication proves who a caller is; authorization decides what that caller may do. They are separate problems with separate standards, and mixing them up is a common design error, for example treating an OAuth access token as proof of who the user is.\n\nThe architectural choices are where identity is established (usually a central identity provider), how it travels between services (tokens), and where authorization decisions are made and enforced.",
          items: [
            {
              t: "Authentication protocols",
              d: "Standards for establishing and carrying identity. Be clear about which of them actually authenticate a user.",
              sub: [
                "OAuth 2.0: a delegated authorization framework; it issues access tokens that let a client call an API on a user's behalf, but on its own it does not tell the client who the user is",
                "OpenID Connect (OIDC): an identity layer on top of OAuth 2.0; its ID token is what proves who signed in",
                "SAML 2.0: XML-based single sign-on, still common with enterprise identity providers",
                "JWT: a signed token format, not a protocol; validate signature, issuer, audience and expiry, and keep lifetimes short because a JWT is hard to revoke before it expires",
              ],
            },
            {
              t: "Authorization models",
              d: "How permission rules are expressed and evaluated.",
              sub: [
                "RBAC (role-based): permissions attach to roles and users get roles; easy to audit, but roles multiply as rules get finer",
                "ABAC (attribute-based): policies evaluate attributes of the user, resource and context (department, data classification, time); expressive, harder to reason about",
                "ReBAC (relationship-based): access follows relationships in a graph, such as 'member of the team that owns this folder'; the model behind Google Zanzibar and tools like OpenFGA and SpiceDB",
                "Policy engines: move decisions into a service such as Open Policy Agent so rules live in one place instead of being scattered through code",
              ],
            },
            {
              t: "API security",
              d: "Protecting the edge where external callers reach your services.",
              sub: [
                "Rate limiting and quotas: per client or tenant, to contain abuse, scraping and runaway cost",
                "API keys: identify a calling application, not a user; treat them as secrets, scope them and rotate them",
                "Mutual TLS: both sides present certificates, so the server authenticates the client as well; common for service-to-service and B2B APIs",
                "Object-level checks: verify the caller may access this specific record, not only this endpoint; broken object-level authorization tops the OWASP API Security Top 10",
              ],
            },
          ],
        },
        {
          title: "Data Security",
          summary:
            "Data security covers data at rest, data in transit, and the keys and secrets that protect both. Encryption is rarely the weak point; key management, access to decrypted data and leaked credentials are.\n\nThe design questions are who holds the keys, who can use them, how they rotate, and what an attacker gets if a single credential leaks.",
          items: [
            {
              t: "Encryption at rest",
              d: "Data on disks, in databases, backups and object storage is encrypted, usually with AES-256. It protects against lost media and some infrastructure access, not against an attacker using the application's own credentials.",
              sub: [
                "Disk or volume encryption: transparent and cheap, but anyone who can query the running system sees plaintext",
                "Database TDE (transparent data encryption): encrypts data files and backups, with the same limit",
                "Field-level encryption: encrypt sensitive fields in the application before storage, so the database never sees plaintext; stronger, but you lose indexing and querying on those fields",
              ],
            },
            {
              t: "Encryption in transit",
              d: "TLS on every hop, including internal service-to-service traffic, not only at the public edge.",
              sub: [
                "TLS 1.3: a shorter handshake, and legacy ciphers and static RSA key exchange removed, so forward secrecy is the default; disable old protocol versions",
                "mTLS: mutual authentication between services, often issued and rotated automatically by a service mesh",
                "Termination points: wherever TLS is terminated (load balancer, proxy) plaintext exists; know where those points are",
              ],
            },
            {
              t: "Key management",
              d: "Keys live in a managed KMS or HSM, never next to the data they protect.",
              sub: [
                "Envelope encryption: a data key encrypts the data and a master key in the KMS encrypts the data key, so the master key can rotate without re-encrypting everything",
                "Managed KMS: AWS KMS, Google Cloud KMS, Azure Key Vault; IAM decides who may use each key, and every use is logged",
                "HashiCorp Vault: a secrets and key management server that can also issue short-lived dynamic credentials",
                "Customer-managed keys: tenants or regulators may require control of their own keys, so revoking the key revokes access to the data",
              ],
            },
            {
              t: "Secrets management",
              d: "API keys, database passwords and tokens live in a secret store and are delivered at runtime, never committed to code or baked into images.",
              sub: [
                "Secret stores: AWS Secrets Manager, Google Secret Manager, Vault; access is controlled and audited per secret",
                "Environment variables: a common way to hand a secret to a process, not a way to manage it; they leak into crash dumps, debug output and child processes",
                "Rotation: rotate on a schedule and immediately on a suspected leak; short-lived dynamic credentials make rotation automatic",
                "Secret scanning: scan repositories and CI logs, because attackers scan public code for keys continuously",
              ],
            },
          ],
        },
        {
          title: "AI-Specific Security",
          summary:
            "Models add attack surface that traditional controls don't cover. A language model cannot reliably tell instructions from data, so any text it reads, from a user, a retrieved document or a tool result, can try to steer it. The OWASP Top 10 for LLM Applications (2025) is the standard catalogue of these risks.\n\nNo filter makes prompt injection go away. The durable defences are architectural: limit what the model can see and do, treat its output as untrusted input, and require a person for consequential actions.",
          items: [
            {
              t: "Prompt injection",
              d: "Input that overrides the model's instructions. Direct injection comes from the user; indirect injection hides in content the model processes, such as a web page, an email or a document in a RAG index.",
              sub: [
                "Input filtering: classifiers and pattern checks catch known attacks but can be bypassed; one layer, not the fix",
                "Segregate untrusted content: mark retrieved and tool content clearly as data, and never let it change the system instructions",
                "Privilege separation: the model gets only the access the current user already has, so a successful injection reaches nothing more",
                "Output handling: validate model output against a schema before acting on it, and escape it before it reaches a browser, shell or SQL query",
              ],
            },
            {
              t: "Least-privilege agents",
              d: "An agent acts with whatever tools and credentials you give it, so an injected instruction becomes an action. OWASP lists this as Excessive Agency.",
              sub: [
                "Narrow tools: a specific 'look up order status' tool, not a generic SQL or shell tool",
                "User-scoped credentials: tools run with the end user's permissions, and the downstream service enforces authorization, not the model",
                "Human approval: explicit confirmation for irreversible or high-impact actions such as payments, deletions and outbound messages",
                "Egress limits: restrict which domains an agent can call, so injected instructions can't send data to an attacker's URL",
              ],
            },
            {
              t: "Data leakage",
              d: "The model reveals data the user should not see: personal data from training or fine-tuning, other users' records pulled in by retrieval, or the system prompt itself.",
              sub: [
                "PII detection: scan inputs, retrieved context and outputs with a tool such as Microsoft Presidio, then redact or block",
                "Retrieval-time access control: filter documents by the user's permissions before they reach the prompt; redacting the answer afterwards is too late",
                "No secrets in prompts: assume the system prompt will leak, so it must not hold credentials or anything you would not publish",
                "Logging hygiene: prompts and completions often contain sensitive data; give them the same retention and access rules as the source data",
              ],
            },
            {
              t: "Model theft and abuse",
              d: "Attackers copy a model's behaviour by querying it at scale (model extraction), or run up your bill with expensive requests. The 2025 OWASP list groups both under Unbounded Consumption.",
              sub: [
                "Access control: authenticate every caller, and protect weights and endpoints like any other sensitive asset",
                "Rate limits and quotas: cap requests and tokens per key or user, which slows extraction and caps runaway cost",
                "Watermarking: embed detectable signals in outputs or weights; it helps prove misuse after the fact, it does not prevent it",
                "Monitoring: flag unusual query patterns, such as systematic probing of the input space",
              ],
            },
            {
              t: "Adversarial attacks",
              d: "Inputs crafted to make a model misbehave, and poisoned data that plants the misbehaviour in advance.",
              sub: [
                "Evasion: small, deliberate changes to an input flip a classifier's decision; a real concern for fraud and moderation models",
                "Data and model poisoning: tampered training, fine-tuning or RAG data introduces backdoors or bias; control and version your data sources",
                "Robustness testing: red-team the model with adversarial inputs before release and after every retrain",
                "Input sanitization: normalise and validate inputs; it stops crude attacks, not optimised adversarial examples",
              ],
            },
          ],
        },
      ],
      mentalModels: [
        "Security is layered: defence in depth, so no single failed control becomes a breach.",
        "Assume breach: design for containment, detection and recovery, not only prevention.",
        "Compliance is a constraint: design for it from the start, because retrofitting audit trails and data residency is expensive.",
        "Treat everything a model reads as untrusted input, and everything it writes as untrusted output.",
      ],
      exercises: [
        {
          title: "Security architecture for a healthcare AI system",
          d: "Requirements: HIPAA compliance, protection of patient data (PHI) and other PII, and audit trails. A design document, not code.",
          steps: [
            "List the protected data and every place it is stored, processed, cached, logged or sent to a model",
            "Design the encryption strategy: at rest, in transit, and who controls the keys",
            "Design access control and audit logging: who can see which records, and how every access is recorded and reviewed",
            "Decide data residency: where data may live, including backups, logs and third-party model APIs",
            "Document the threat model, the mitigation for each threat, and a compliance checklist mapped to the HIPAA safeguards",
          ],
        },
        {
          title: "Threat model a RAG support assistant",
          d: "Pick a system, such as RAG-based customer support, and work through STRIDE: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege.",
          steps: [
            "Draw a data-flow diagram with trust boundaries: user, app, retriever, vector store, model API and tools",
            "For each element and flow, list threats under each STRIDE category, including indirect prompt injection through indexed documents",
            "Rank the threats by likelihood and impact",
            "Design a mitigation for each high-ranked threat, and state which risks you accept and why",
          ],
        },
      ],
      resources: [
        {
          kind: "book",
          title: "Threat Modeling: Designing for Security (Adam Shostack)",
          url: "https://www.wiley.com/en-us/Threat+Modeling:+Designing+for+Security-p-9781118809990",
          note: "The standard text on STRIDE and data-flow diagrams. A second edition focused on AI is announced for February 2027",
        },
        {
          kind: "docs",
          title: "STRIDE threat categories (Microsoft Threat Modeling Tool)",
          url: "https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats",
          free: true,
          note: "Microsoft stopped using its companion DREAD scoring because ratings were too subjective; rank by likelihood and impact instead",
        },
        {
          kind: "paper",
          title: "NIST SP 800-207: Zero Trust Architecture",
          url: "https://csrc.nist.gov/pubs/sp/800/207/final",
          free: true,
        },
        {
          kind: "docs",
          title: "OWASP Top 10 for LLM Applications (2025)",
          url: "https://genai.owasp.org/llm-top-10/",
          free: true,
          note: "Read LLM01 Prompt Injection, LLM06 Excessive Agency and LLM10 Unbounded Consumption closely",
        },
        {
          kind: "docs",
          title: "OWASP API Security Top 10 (2023)",
          url: "https://api-security.owasp.org/",
          free: true,
        },
      ],
    },
    {
      id: "6.2",
      title: "Cost Optimisation",
      summary:
        "Cost is an architectural property like latency or availability: it follows from where data lives, how often it moves and how much compute each request uses. Cloud services and model APIs bill by usage, so a design choice made once is paid for on every request.\n\nIn AI systems the per-request cost of inference often dominates. The central trade-off is cost against latency, quality and reliability, and the skill is knowing which of those a given workload can give up.",
      topics: [
        {
          title: "Cloud Cost Levers",
          summary:
            "The big line items are compute, storage, network and databases, and each has a standard set of levers. Most of them trade flexibility for price: commit to capacity for a discount, accept interruptions for a bigger one, or move data to tiers that are cheaper to keep and slower or costlier to read.\n\nKnow what each lever costs in flexibility or latency before you pull it.",
          items: [
            {
              t: "Compute pricing models",
              d: "Match how you buy compute to the shape of the workload.",
              sub: [
                "Reserved instances and savings plans: commit to one or three years of usage for a large discount; right for the steady baseline",
                "Spot or preemptible capacity: spare capacity at a deep discount that can be reclaimed at short notice (two minutes on AWS, 30 seconds on Google Cloud); right for fault-tolerant batch jobs, checkpointed training and stateless workers",
                "Auto-scaling: follow demand instead of paying for idle peak capacity; set minimums high enough that cold starts don't hurt latency",
                "Rightsizing: many instances are over-provisioned; resize from measured utilisation",
              ],
            },
            {
              t: "Storage tiers and lifecycle",
              d: "Hot, cool, cold and archive tiers trade storage price against retrieval cost and speed.",
              sub: [
                "Lifecycle policies: move objects to colder tiers by age, and delete what retention rules no longer require",
                "Retrieval costs: archive tiers are cheap to keep but charge to read, and some take hours to restore",
                "Minimum storage durations: colder tiers charge for early deletion, so short-lived data belongs in hot storage",
              ],
            },
            {
              t: "Network and data transfer",
              d: "Data leaving a region or a cloud (egress) is often the surprise on the bill, and so is traffic between availability zones.",
              sub: [
                "Locality: keep chatty services and their data in the same region, and in the same zone where availability allows",
                "CDN caching: serve static and cacheable content from the edge to cut origin egress and latency",
                "NAT gateways: they charge per GB processed, so heavy traffic to cloud services is often cheaper through VPC endpoints (gateway endpoints for S3 and DynamoDB are free)",
                "Compression and batching: shrink payloads that cross paid boundaries",
              ],
            },
            {
              t: "Database cost",
              d: "Databases are often the largest steady cost and the hardest to shrink later.",
              sub: [
                "Query optimisation and indexing: the cheapest capacity is a query you made ten times faster",
                "Read replicas: offload reads cheaply, at the price of replication lag",
                "Sharding: scales writes and storage but adds operational cost and cross-shard queries; exhaust replicas, caching and bigger instances first",
                "Serverless tiers: good for spiky or low traffic, often more expensive at steady high load",
              ],
            },
          ],
        },
        {
          title: "AI Cost Optimisation",
          summary:
            "Inference cost scales with tokens and model size, so it grows with every user and every feature that calls a model. The biggest savings usually come from not calling the largest model when a smaller one, a cache hit or no model at all would do.\n\nEach lever trades something: quality for smaller models, freshness for caching, latency for batching, some accuracy for quantization. Measure quality on your own evaluation set before and after every change.",
          items: [
            {
              t: "Model selection and routing",
              d: "Use the smallest model that meets the quality bar for each task, and route requests by difficulty.",
              sub: [
                "Tiered models: a small, cheap model for classification, extraction and simple questions; a large one only for hard reasoning",
                "Routers and cascades: try the cheap model first and escalate on low confidence or a failed check",
                "Prompt length: input tokens are billed too, so trim retrieved context and long system prompts",
              ],
            },
            {
              t: "Caching",
              d: "Avoid paying twice for the same work.",
              sub: [
                "Exact-match response cache: keyed on the normalised prompt and parameters; safe, but few hits for free-text queries",
                "Semantic cache: reuse answers for similar queries by embedding similarity; more hits, but it can return a wrong answer to a subtly different question, so keep the threshold strict",
                "Provider prompt caching: many model APIs discount repeated prompt prefixes, so put the stable part (system prompt, shared documents) first",
                "Embedding cache: don't re-embed documents that haven't changed",
              ],
            },
            {
              t: "Batching",
              d: "Group inference work to use the hardware more efficiently.",
              sub: [
                "Dynamic batching: a model server combines concurrent requests into one forward pass; more throughput for a little queueing latency",
                "Continuous batching (vLLM, SGLang): for LLMs, sequences join and leave a running batch token by token",
                "Batch APIs: many providers price asynchronous batch jobs at about half the normal rate, for work that can wait hours",
              ],
            },
            {
              t: "Quantisation",
              d: "Store and compute weights (and sometimes activations) at lower precision, such as FP32 to FP16 or BF16 to INT8 or INT4. It cuts memory and often raises throughput, usually with a small quality loss that you have to measure.",
              sub: [
                "FP16 and BF16: half precision, already the normal serving default for large models, so savings are usually counted from here",
                "INT8 and FP8: about half the memory of 16-bit; FP8 needs recent GPUs (NVIDIA Hopper, Ada or newer)",
                "INT4 weight-only (GPTQ, AWQ): fits large models on fewer GPUs; the quality loss grows on harder reasoning tasks",
                "Evaluate on your tasks: quantization error shows up unevenly, so published benchmarks aren't enough",
              ],
            },
            {
              t: "Distillation",
              d: "Train a smaller student model to imitate a larger teacher on your task. The student is cheaper and faster and can keep most of the teacher's quality on a narrow task, though rarely all of it across the board.",
              sub: [
                "Task-specific distillation: label or answer examples with the large model, then fine-tune a small one on them",
                "Licence terms: some model licences and API terms restrict using outputs to train other models; check before you start",
                "Ownership cost: you now own training, evaluation and serving of a custom model, which pays off only at enough volume",
              ],
            },
          ],
        },
        {
          title: "FinOps Practices",
          summary:
            "FinOps is the operating practice that makes cloud spend visible and owned. Engineers make most spending decisions, so they need to see what their services cost soon enough to act on it.\n\nThe FinOps Foundation frames the work as a loop of Inform, Optimize and Operate. Tagging and allocation come first, because you can't optimise or charge back what you can't attribute.",
          items: [
            {
              t: "Tagging and allocation",
              d: "Tag every resource with owner, team, project and environment, and enforce it rather than hoping for it.",
              sub: [
                "Enforce at creation: reject untagged resources in infrastructure-as-code checks or cloud policy",
                "Shared costs: decide how to split shared clusters, networking and platform services (by usage, evenly or proportionally)",
                "AI spend: attribute model API usage to features and teams, for example with separate keys or projects, or one provider invoice hides who spent what",
              ],
            },
            {
              t: "Budgets and alerts",
              d: "Set budgets per team, project and environment, and alert on forecast overspend as well as actual spend.",
              sub: [
                "Forecast alerts: warn when projected month-end spend crosses the budget, while there is still time to act",
                "Anomaly detection: flag sudden spikes against the normal pattern (for example AWS Cost Anomaly Detection)",
                "Hard limits: for sandboxes and experiments, cap spend or quota instead of only alerting",
              ],
            },
            {
              t: "Chargeback and showback",
              d: "Showback reports each team's costs to them; chargeback bills those costs to the team's budget. Showback builds awareness, chargeback changes behaviour, and both depend on accurate allocation first.",
            },
            {
              t: "Regular cost reviews",
              d: "A fixed cadence stops cost from drifting.",
              sub: [
                "Weekly review: engineering and finance look at spend by service, the biggest changes and open anomalies",
                "Optimisation sprints: batch up rightsizing, cleanup of idle resources and commitment purchases",
                "Commitment management: check how much reserved and savings-plan capacity is actually used, and adjust",
              ],
            },
          ],
        },
      ],
      mentalModels: [
        "Cost is a feature: design for it from day one, because the cheapest time to change a cost driver is before it ships.",
        "Unit economics matter: track cost per user, per tenant and per inference, not only the total bill.",
        "Cost, performance and reliability trade against each other; name which one you are spending.",
      ],
      exercises: [
        {
          title: "Cut the cost of a RAG system in half",
          d: "Today: 100K queries a day, P95 latency 500 ms, $5K a month. Goal: cut cost by 50% while P95 latency rises by no more than 20% (600 ms).",
          steps: [
            "Break the $5K down by component: model calls (input and output tokens), embeddings, vector database, compute and network",
            "Estimate the saving and the latency effect of each lever: caching, a smaller model or router, batching, and quantization if you self-host",
            "Define the quality check you will run before and after, so savings don't quietly cost answer quality",
            "Write the plan: changes in order, expected savings, risks and how you will measure each",
          ],
        },
        {
          title: "Design a FinOps dashboard",
          steps: [
            "Choose the metrics: daily spend, cost per service, cost per user, budget vs actual",
            "Set the alerts: daily spend above a threshold, and spike detection against a rolling baseline",
            "Decide who sees what: a per-team engineering view and a cross-team finance view",
            "Document the dashboard design, the alert thresholds and the review cadence",
          ],
        },
      ],
      resources: [
        {
          kind: "book",
          title: "Cloud FinOps, 2nd Edition (J.R. Storment and Mike Fuller)",
          url: "https://www.oreilly.com/library/view/cloud-finops-2nd/9781492098348/",
        },
        {
          kind: "docs",
          title: "FinOps Framework (FinOps Foundation)",
          url: "https://www.finops.org/framework/",
          free: true,
          note: "Principles, phases, domains and capabilities",
        },
        {
          kind: "article",
          title: "FinOps for AI Overview (FinOps Foundation)",
          url: "https://www.finops.org/wg/finops-for-ai-overview/",
          free: true,
          note: "Token pricing, GPU capacity and unit economics for AI workloads",
        },
        {
          kind: "docs",
          title: "AWS Well-Architected Framework: Cost Optimization Pillar",
          url: "https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html",
          free: true,
        },
        {
          kind: "docs",
          title: "AWS Cost Explorer",
          url: "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html",
          free: true,
        },
        {
          kind: "docs",
          title: "Google Cloud costs and usage management",
          url: "https://docs.cloud.google.com/docs/costs-usage",
          free: true,
          note: "Billing reports, budgets and alerts, committed use discounts",
        },
      ],
    },
  ],
};
