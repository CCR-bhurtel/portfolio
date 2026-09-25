import type { Phase } from "../model";

export const phase5: Phase = {
  n: 5,
  title: "Cloud & Infrastructure Architecture",
  weeks: "Weeks 39–46",
  summary:
    "This phase covers where systems actually run: cloud-native application design, infrastructure defined as code, Kubernetes as the common platform, and the observability you need to know whether any of it is working.\n\nAn architect doesn't have to operate clusters, but does have to make sound decisions about them: which failures to design for, how infrastructure changes are reviewed and rolled back, and how reliability is defined and measured. AI workloads raise the stakes with GPUs, large models and costs that grow with every request.",
  modules: [
    {
      id: "5.1",
      title: "Cloud Architecture Patterns",
      summary:
        "Cloud-native design assumes that any machine can disappear at any moment and that capacity is rented by the minute. Applications are built to be stateless and disposable, infrastructure is described in code and changed through review, and a platform like Kubernetes keeps the running system matched to what was declared.\n\nThe central trade-off is control against operational effort. Managed and serverless services remove work but add limits and lock-in; running your own platform gives flexibility that you pay for in people and time.",
      topics: [
        {
          title: "Cloud-Native Design",
          summary:
            "Cloud-native applications are built for elastic, unreliable infrastructure: instances start and stop all the time, so no single instance may hold state that matters. The 12-factor methodology captures the habits that make this work.\n\nServerless takes the idea further by hiding servers entirely. It suits spiky, event-triggered work well and steady high load less well.",
          items: [
            {
              t: "12-factor app",
              d: "A methodology written by Heroku engineers in 2011 for building portable, scalable services. Most of it is now standard practice on any container platform.",
              sub: [
                "Codebase: one codebase in version control, many deploys",
                "Dependencies: declare and isolate them explicitly; never rely on system-wide packages",
                "Config: keep config that varies between deploys in the environment, not in code",
                "Backing services: treat databases, queues and caches as attached resources, swappable by config",
                "Build, release, run: strictly separate the build, the release (build plus config) and the running process",
                "Processes: run as stateless processes and keep state in backing services",
                "Port binding: the app is self-contained and exports its service by binding to a port",
                "Concurrency: scale out by running more processes",
                "Disposability: fast startup and graceful shutdown, so instances can be added or killed at any time",
                "Dev/prod parity: keep development, staging and production as similar as possible",
                "Logs: treat logs as event streams written to stdout and let the platform collect them",
                "Admin processes: run one-off tasks such as migrations as separate processes with the same code and config",
              ],
            },
            {
              t: "Function-as-a-Service",
              d: "You deploy functions and the provider runs them on demand, scales them (to zero when idle) and bills per invocation and duration. Examples: AWS Lambda, Azure Functions, Google Cloud Run functions (formerly Cloud Functions).",
            },
            {
              t: "Event-driven triggers",
              d: "Functions run in response to events rather than as long-lived servers.",
              sub: [
                "Storage events: a file lands in an S3 or Cloud Storage bucket",
                "HTTP: requests arriving through an API gateway or a function URL",
                "Queues and streams: messages from SQS, Kinesis or Pub/Sub",
                "Schedules: cron-style jobs",
              ],
            },
            {
              t: "Serverless trade-offs",
              d: "Little operational work and pay-per-use pricing, with limits that shape the design.",
              sub: [
                "Cold starts: the first request to a new instance waits for it to initialise; mitigate with provisioned concurrency or lighter runtimes",
                "Limits: maximum run time (15 minutes on AWS Lambda), memory and payload caps rule out long or heavy jobs",
                "Vendor lock-in: triggers, permissions and tooling are provider-specific",
                "Cost at scale: per-request pricing is cheap for spiky traffic but often dearer than containers under steady high load",
              ],
            },
          ],
        },
        {
          title: "Container Patterns",
          summary:
            "These multi-container patterns, named in Brendan Burns and David Oppenheimer's 2016 paper, run a helper container next to the main application in the same pod, sharing its network and storage. The helper handles a cross-cutting concern so the application, written in any language, doesn't have to.\n\nThey let you reuse one well-tested component across many services, at the cost of an extra container per pod to run and monitor.",
          items: [
            {
              t: "Sidecar",
              d: "Extends or enhances the main container: log shipping, config reloading, a service mesh proxy. Kubernetes has native sidecars (init containers with restartPolicy: Always, stable since v1.33) that start before the app and keep running alongside it.",
            },
            {
              t: "Ambassador",
              d: "Proxies the application's connections to the outside world. The app talks to localhost, and the ambassador handles discovery, sharding or retries for the external service.",
            },
            {
              t: "Adapter",
              d: "Presents the application's output in a standard form, for example translating an app's own metrics format into Prometheus format so every service can be monitored the same way.",
            },
          ],
        },
        {
          title: "Infrastructure as Code & GitOps",
          summary:
            "Infrastructure as code (IaC) describes servers, networks and managed services in files that are versioned, reviewed and applied by tools rather than by hand. The tool compares the declared state with what exists and changes only the difference.\n\nGitOps applies the same idea to deployment: Git holds the desired state of the system, and an agent in the cluster continuously pulls and applies it. The hard parts are state, secrets and keeping environments apart.",
          items: [
            {
              t: "Declarative IaC tools",
              d: "Terraform and OpenTofu use HCL; Pulumi uses general-purpose languages (TypeScript, Python, Go). All of them plan a change as a diff against the current state before applying it.",
              sub: [
                "OpenTofu: the open-source fork created after Terraform moved to the Business Source License in 2023",
                "Plan review: treat the plan like a code diff; it shows what will be created, changed or destroyed",
              ],
            },
            {
              t: "State management",
              d: "The tool records what it manages in a state file that maps code to real resources. It has to be shared, protected and never written by two runs at once.",
              sub: [
                "Remote state: keep it in a backend (S3, Google Cloud Storage, HCP Terraform), not on a laptop",
                "Locking: prevent concurrent applies; Terraform's S3 backend now supports native lock files, and DynamoDB-based locking is deprecated",
                "Secrets: state can hold sensitive values, so encrypt it and restrict access",
                "Drift: changes made outside the tool show up in the next plan; detect and reconcile them regularly",
              ],
            },
            {
              t: "Modules",
              d: "Reusable, versioned components (a network, a Kubernetes cluster, a database with backups) with defined inputs and outputs. They encode your standards once, but modules that try to cover every case become hard to change.",
            },
            {
              t: "Environment separation",
              d: "Dev, staging and production need isolated state and credentials.",
              sub: [
                "Terraform CLI workspaces: separate state for the same configuration in one backend; HashiCorp says they are not a suitable isolation mechanism when environments need different credentials or access controls",
                "Separate root configurations and backends per environment: the usual approach for production",
                "Pulumi stacks: one stack per environment, each with its own config and state",
              ],
            },
            {
              t: "GitOps",
              d: "Git is the single source of truth for the desired state, and every change is a commit. The OpenGitOps principles: declarative, versioned and immutable, pulled automatically, continuously reconciled.",
              sub: [
                "Pull-based agents: Argo CD or Flux run in the cluster, watch the repository and apply changes, so CI doesn't need cluster credentials",
                "Drift correction: the agent reverts manual changes that don't match Git",
                "Rollback: revert the commit and the agent converges back",
                "Secrets: never store them in Git in plain text; use encrypted secrets or an external secrets manager",
              ],
            },
          ],
        },
        {
          title: "Kubernetes Architecture",
          summary:
            "Kubernetes is a set of control loops: you declare the desired state of your workloads through its API, and controllers keep working to make the cluster match it. Knowing its components tells you what breaks when each one fails and which resource fits each kind of workload.\n\nIt is also the default platform for AI serving and training, so GPU scheduling and autoscaling decisions end up here.",
          items: [
            {
              t: "Control plane",
              d: "The components that store the cluster's desired state and act on it.",
              sub: [
                "API server: the front door; every component and user talks to the cluster through it",
                "etcd: a consistent key-value store (using Raft) that holds all cluster state; back it up",
                "Scheduler: assigns new pods to nodes based on resource requests, affinity rules and taints",
                "Controller manager: runs the control loops that reconcile Deployments, nodes, Jobs and more",
                "Cloud controller manager: integrates with the cloud provider for load balancers and nodes",
              ],
            },
            {
              t: "Worker nodes",
              d: "The machines that run the workloads.",
              sub: [
                "Kubelet: the node agent; starts pods and reports their status to the API server",
                "Container runtime: runs the containers (containerd or CRI-O)",
                "kube-proxy: programs Service routing on each node; some network plugins, such as Cilium, can replace it",
              ],
            },
            {
              t: "Workload resources",
              d: "Controllers that manage pods, the smallest unit Kubernetes schedules.",
              sub: [
                "Pod: one or more containers that share network and storage and are scheduled together",
                "Deployment: stateless replicas with rolling updates and rollback",
                "StatefulSet: stable names and per-pod storage, for databases and brokers",
                "DaemonSet: one pod per node, for agents such as log collectors and GPU device plugins",
                "Job and CronJob: run to completion, once or on a schedule",
              ],
            },
            {
              t: "Networking",
              d: "Every pod gets its own IP address; higher-level resources give stable addresses and control traffic.",
              sub: [
                "Service: a stable virtual IP and DNS name in front of a changing set of pods",
                "Ingress and Gateway API: route external HTTP traffic into the cluster; the Ingress API is frozen and new features go into Gateway API, and the widely used ingress-nginx controller was retired in March 2026",
                "NetworkPolicy: allow or deny traffic between pods; only enforced if the network plugin supports it",
                "Service mesh: an add-on, not part of Kubernetes itself (see 4.2)",
              ],
            },
            {
              t: "Storage",
              d: "How pods get storage that outlives them.",
              sub: [
                "PersistentVolume (PV): a piece of storage in the cluster, such as a cloud disk",
                "PersistentVolumeClaim (PVC): a pod's request for storage of a given size and access mode",
                "StorageClass: describes a type of storage and lets the cluster provision volumes on demand",
              ],
            },
            {
              t: "Autoscaling",
              d: "Three layers that work together.",
              sub: [
                "Horizontal Pod Autoscaler (HPA): changes the number of replicas based on CPU, memory, custom or external metrics",
                "Vertical Pod Autoscaler (VPA): an add-on that adjusts pods' CPU and memory requests from observed usage; don't let HPA and VPA act on the same CPU or memory metric",
                "Cluster Autoscaler: adds nodes when pods can't be scheduled and removes underused ones; Karpenter is a common alternative",
              ],
            },
          ],
        },
      ],
      mentalModels: [
        "Infrastructure is code: version it, review it and test it like software.",
        "Immutable infrastructure: replace servers and images rather than changing them in place.",
        "Everything fails: design for node failures, network partitions and whole-region outages.",
      ],
      exercises: [
        {
          title: "Design a multi-region deployment",
          d: "Requirements: 99.99% availability (about 52 minutes of downtime a year), RTO under 1 hour, RPO under 5 minutes.",
          steps: [
            "Choose active-active or active-passive and justify it against the RTO, RPO and cost",
            "Design the DNS and traffic strategy: health checks, TTLs and how clients fail over",
            "Design replication for each data store (synchronous or asynchronous) and show how it meets the 5-minute RPO",
            "Automate failover and decide who or what triggers it",
            "Write a testing plan: regular failover drills and a game day that takes a whole region out",
          ],
        },
        {
          title: "Kubernetes architecture for ML workloads",
          d: "Requirements: train models on GPU nodes and serve them with autoscaling.",
          steps: [
            "Design node pools (CPU, GPU for training, GPU for inference) with taints and tolerations so only GPU workloads land on GPU nodes",
            "Choose the scaling signal for serving: GPU utilisation isn't a built-in HPA metric, so expose it through the NVIDIA DCGM exporter and a metrics adapter, and compare it with request queue depth",
            "Design model caching so new replicas don't download large weights on every start (a node-local cache or a shared volume)",
            "Decide how training jobs are scheduled and preempted without starving inference",
            "Estimate cost: idle GPU time, scale-to-zero options and spot capacity for training",
          ],
        },
      ],
      resources: [
        {
          kind: "book",
          title: "Cloud Native Patterns (Cornelia Davis)",
          url: "https://www.manning.com/books/cloud-native-patterns",
        },
        {
          kind: "article",
          title: "The Twelve-Factor App",
          url: "https://12factor.net/",
          free: true,
        },
        {
          kind: "course",
          title: "Introduction to Kubernetes, LFS158 (Linux Foundation)",
          url: "https://training.linuxfoundation.org/training/introduction-to-kubernetes/",
          free: true,
          note: "Architecture and core building blocks, with labs",
        },
        {
          kind: "docs",
          title: "Kubernetes Documentation: Concepts",
          url: "https://kubernetes.io/docs/concepts/",
          free: true,
          note: "Start with Cluster Architecture and Workloads",
        },
        {
          kind: "docs",
          title: "Terraform Documentation (HashiCorp)",
          url: "https://developer.hashicorp.com/terraform/docs",
          free: true,
          note: "Read the sections on state, backends and modules",
        },
        {
          kind: "paper",
          title: "Design Patterns for Container-based Distributed Systems (Burns and Oppenheimer)",
          url: "https://www.usenix.org/conference/hotcloud16/workshop-program/presentation/burns",
          free: true,
          note: "Where the sidecar, ambassador and adapter patterns come from",
        },
      ],
    },
    {
      id: "5.2",
      title: "Observability & Monitoring",
      summary:
        "Monitoring tells you when something you anticipated goes wrong; observability lets you ask new questions of a running system and find out why. Both rest on telemetry that is usually described as three pillars (logs, metrics and traces), best correlated by a shared trace id and emitted through a standard such as OpenTelemetry. The Observability Engineering authors push further, towards wide structured events that can be sliced any way you need.\n\nFor an architect the key decisions are what to measure (indicators that reflect what users experience), what to promise (SLOs), and when to wake someone up. AI systems add model quality, data drift and token cost to that list.",
      topics: [
        {
          title: "Logs",
          summary:
            "Logs are timestamped records of discrete events: the most detailed signal, and the most expensive to store and search. Structured logs, with fields instead of free text, make them queryable and let you join them with traces.\n\nDecide up front what to log, how long to keep it and what must never be logged.",
          items: [
            {
              t: "Structured logging",
              d: "Emit logs as JSON or key-value pairs with consistent field names (service, request id, duration), so you can filter and aggregate without regular expressions. Include the trace id so you can jump from a log line to the whole request.",
            },
            {
              t: "Log aggregation",
              d: "Ship logs from every instance to a central store for search and retention.",
              sub: [
                "ELK (Elastic Stack): Elasticsearch, Logstash or Beats, and Kibana; full-text indexing and powerful search, but costly at high volume",
                "Grafana Loki: indexes only labels and stores log lines compressed; much cheaper, but queries scan more data",
                "Splunk: commercial, mature search and analytics, priced by volume",
              ],
            },
            {
              t: "Log levels",
              d: "DEBUG for development detail, INFO for normal events, WARN for unexpected but handled situations, ERROR for failures that need attention. Run production at INFO and make the level changeable at runtime.",
            },
            {
              t: "Cost, retention and privacy",
              d: "Log volume grows with traffic, so sample noisy logs, set retention by how useful each log type is, and redact personal data and secrets before logs leave the service.",
            },
          ],
        },
        {
          title: "Metrics",
          summary:
            "Metrics are numeric measurements aggregated over time: cheap to store, fast to query and the natural basis for dashboards and alerts. The trade-off is that aggregation throws detail away, so metrics tell you that something changed but rarely which request or user caused it.\n\nThe main design constraint is cardinality, because every unique combination of labels is a separate time series.",
          items: [
            {
              t: "Time-series databases",
              d: "Stores built for timestamped numeric samples.",
              sub: [
                "Prometheus: pulls (scrapes) metrics from targets, stores them locally and queries them with PromQL; Thanos, Cortex or Mimir add long-term storage",
                "InfluxDB: a purpose-built time-series database that applications push data into",
                "TimescaleDB: a time-series extension for PostgreSQL, useful when you want plain SQL",
              ],
            },
            {
              t: "Metric types",
              d: "The four Prometheus metric types.",
              sub: [
                "Counter: only goes up (requests served, errors); you query its rate",
                "Gauge: goes up and down (memory in use, queue depth)",
                "Histogram: counts observations in buckets; percentiles are computed at query time and can be aggregated across instances",
                "Summary: computes quantiles in the client; cheap to query, but they can't be aggregated across instances",
              ],
            },
            {
              t: "Cardinality",
              d: "Every unique label combination creates a new series, so a label such as user id or request id can multiply storage and memory by millions. Keep label values bounded and put high-cardinality detail in logs or traces.",
            },
            {
              t: "Alerting rules",
              d: "Prometheus evaluates alerting rules (a PromQL condition that must hold for a set duration) and fires alerts. Alertmanager then deduplicates, groups, silences and routes them to email, chat or on-call tools.",
            },
          ],
        },
        {
          title: "Traces",
          summary:
            "A distributed trace follows one request through every service it touches, as a tree of timed spans. It is the signal that answers 'where did the time go?' and 'which dependency failed?' in a microservice system or a RAG pipeline.\n\nTracing only works if every hop propagates the trace context, and at scale you have to decide which traces are worth keeping.",
          items: [
            {
              t: "Distributed tracing",
              d: "Each unit of work is a span with a start time, duration, attributes and status, and spans that share a trace id form one trace. Backends store and visualise them.",
              sub: [
                "Jaeger: open-source tracing backend, originally built at Uber",
                "Grafana Tempo: stores traces cheaply in object storage and looks them up by trace id",
                "Zipkin: the earlier open-source tracer, originally built at Twitter",
              ],
            },
            {
              t: "Context propagation",
              d: "Trace and span ids travel with each request, in HTTP headers or message metadata, so the next service attaches its spans to the same trace.",
              sub: [
                "W3C Trace Context: the standard traceparent and tracestate headers, and the default in OpenTelemetry",
                "B3: Zipkin's older header format, still common in existing systems",
                "Async hops: put the context in message headers so traces continue through queues",
              ],
            },
            {
              t: "Span relationships",
              d: "How spans connect to each other.",
              sub: [
                "Parent-child: a span created inside another span's work, such as a database call inside a request handler",
                "Span links: connect causally related spans that aren't parent and child, such as a batch job processing messages from many traces",
                "Service graph: not a span relationship itself, but a map of which services call which, built by aggregating parent-child spans",
              ],
            },
            {
              t: "Sampling",
              d: "Keeping every trace is expensive at scale, so choose which ones to store.",
              sub: [
                "Head sampling: decide when the request starts (keep 1%); cheap, but misses most rare errors",
                "Tail sampling: decide after the trace completes, so you can keep every error and slow request; needs a collector that buffers whole traces",
              ],
            },
            {
              t: "OpenTelemetry",
              d: "The vendor-neutral CNCF standard for producing and exporting traces, metrics and logs: APIs and SDKs for instrumentation, plus a Collector that processes and routes telemetry. Instrument once and switch backends without touching application code.",
            },
          ],
        },
        {
          title: "Monitoring Strategies",
          summary:
            "Service level objectives turn 'is it reliable enough?' into a number that product and engineering agree on. An SLI measures what users experience, an SLO sets the target, and the gap between the target and 100% is an error budget you can spend on releases and experiments.\n\nAlerting on how fast that budget is burning, rather than on every symptom, gives fewer and more meaningful pages.",
          items: [
            {
              t: "SLI, SLO and SLA",
              d: "Three layers of reliability promise.",
              sub: [
                "SLI (service level indicator): a measure of user experience, best written as good events over valid events (the share of requests served successfully in under 300 ms)",
                "SLO (service level objective): the target for an SLI over a time window (99.9% of requests succeed over 30 days)",
                "SLA (service level agreement): a contract with customers, with consequences if it is missed; set it looser than the internal SLO",
              ],
            },
            {
              t: "Error budgets",
              d: "The unreliability an SLO allows, 1 minus the target. A 99.9% availability SLO over 30 days allows 0.1% of requests to fail, or about 43 minutes of complete outage.",
            },
            {
              t: "Error budget policy",
              d: "An agreed policy for what happens as the budget runs out, typically freezing feature releases except reliability fixes until the service is back within its SLO. It turns the SLO into a decision tool rather than a report.",
            },
            {
              t: "Burn-rate alerts",
              d: "Alert on how fast the error budget is being used up, not on every error spike. The SRE Workbook recommends multiwindow, multi-burn-rate alerts, for example paging when 2% of a 30-day budget is spent in one hour (a burn rate of 14.4).",
            },
            {
              t: "Four golden signals",
              d: "Google SRE's minimal set of signals for any user-facing service.",
              sub: [
                "Latency: time to serve a request; track successful and failed requests separately",
                "Traffic: demand on the system, such as requests per second",
                "Errors: the rate of failed requests, including wrong answers served with a success code",
                "Saturation: how full the most constrained resource is (CPU, memory, queue depth, GPU memory)",
              ],
            },
            {
              t: "RED and USE methods",
              d: "Two checklists for applying those signals.",
              sub: [
                "RED (Tom Wilkie): Rate, Errors and Duration for every service",
                "USE (Brendan Gregg): Utilization, Saturation and Errors for every resource",
              ],
            },
          ],
        },
        {
          title: "AI-Specific Monitoring",
          summary:
            "AI systems can fail silently: the service is up, latency is fine, and the answers are getting worse. Monitoring has to cover model and retrieval quality and the data feeding them, alongside the usual infrastructure signals.\n\nGround truth often arrives late or never in production, so much of AI monitoring relies on proxies: drift in inputs and outputs, sampled human review and automated evaluators.",
          items: [
            {
              t: "Model quality metrics",
              d: "Accuracy, precision, recall and F1, measured against labelled data. In production, labels often arrive late or not at all, so compute these on delayed or sampled labels and watch proxy signals in the meantime.",
            },
            {
              t: "Drift detection",
              d: "Notice when production data stops looking like the data the model was built on.",
              sub: [
                "Data drift: input distributions shift (new user segments, new document types)",
                "Concept drift: the relationship between inputs and the right answer changes",
                "Methods: compare distributions with statistics such as the population stability index or the Kolmogorov-Smirnov test, and watch the distribution of predictions",
              ],
            },
            {
              t: "Inference metrics",
              d: "Serving health and cost per request.",
              sub: [
                "Latency: p50, p95 and p99; for LLMs, also time to first token and output tokens per second",
                "Throughput: requests or tokens per second, per replica or per GPU",
                "Cost: input and output tokens and cost per request, broken down by feature or tenant",
              ],
            },
            {
              t: "Data quality checks",
              d: "Validate data at pipeline boundaries, before it reaches training or an index: missing values, schema violations, out-of-range values and outliers, duplicates and freshness.",
            },
            {
              t: "RAG metrics",
              d: "Measure each stage separately so you can tell which one failed.",
              sub: [
                "Retrieval recall@k: did the relevant chunks make it into the top k?",
                "Re-ranking precision: are the chunks passed to the model actually relevant?",
                "Faithfulness: is the answer supported by the retrieved context?",
                "Answer relevance: does it address the question? Often scored by an LLM judge, which should itself be checked against human labels",
                "Tracing: OpenTelemetry's GenAI semantic conventions (still evolving) define spans and attributes for model calls and token usage",
              ],
            },
          ],
        },
      ],
      mentalModels: [
        "Observability over monitoring: understand why something happened, not just that it did.",
        "Alerts should be actionable: if nobody can act on it, it shouldn't page anyone.",
        "Dashboards should answer questions: design each one for a specific use case and audience.",
      ],
      exercises: [
        {
          title: "Design observability for a RAG system",
          d: "Cover retrieval, re-ranking and generation end to end.",
          steps: [
            "Metrics: retrieval, re-ranking and LLM latency, time to first token, token usage and cost per request",
            "Logs: query, retrieved and re-ranked chunk ids, prompt and response, with a redaction policy for personal data and a retention period",
            "Traces: one end-to-end trace across retrieval, re-ranking and generation, with the trace id in every log line",
            "Alerts: retrieval p95 above 500 ms, error rate above 1% and a token cost spike; express the latency and error alerts as SLO burn rates",
            "Quality: sample responses for offline faithfulness evaluation and track the score over time",
          ],
        },
        {
          title: "Define SLOs for three services",
          d: "An API, an ML model and a data pipeline.",
          steps: [
            "Define one or two SLIs per service from the user's point of view (for a pipeline this is usually freshness or completeness, not latency)",
            "Set an SLO and window for each and compute the error budget",
            "Write an error budget policy: what happens at 50% and at 100% of the budget spent",
            "Design burn-rate alerts, and one dashboard per service that answers 'are we within SLO, and if not, why?'",
          ],
        },
      ],
      resources: [
        {
          kind: "book",
          title: "Site Reliability Engineering (Google)",
          url: "https://sre.google/sre-book/table-of-contents/",
          free: true,
          note: "Start with chapters 4 (Service Level Objectives) and 6 (Monitoring Distributed Systems)",
        },
        {
          kind: "book",
          title: "Implementing SLOs (The Site Reliability Workbook)",
          url: "https://sre.google/workbook/implementing-slos/",
          free: true,
          note: "Chapter 2: choosing SLIs and writing an error budget policy",
        },
        {
          kind: "book",
          title: "Alerting on SLOs (The Site Reliability Workbook)",
          url: "https://sre.google/workbook/alerting-on-slos/",
          free: true,
          note: "Chapter 5: multiwindow, multi-burn-rate alerts",
        },
        {
          kind: "book",
          title: "Observability Engineering, 2nd Edition (Charity Majors, Liz Fong-Jones, George Miranda)",
          url: "https://www.oreilly.com/library/view/observability-engineering-2nd/9781098179915/",
          note: "2026 edition, with a chapter on observability for LLMs; Honeycomb offers a complimentary copy",
        },
        {
          kind: "docs",
          title: "OpenTelemetry: Observability Primer",
          url: "https://opentelemetry.io/docs/concepts/observability-primer/",
          free: true,
          note: "Then read the Signals pages on traces, metrics and logs",
        },
        {
          kind: "docs",
          title: "Prometheus: Metric Types",
          url: "https://prometheus.io/docs/concepts/metric_types/",
          free: true,
        },
      ],
    },
  ],
};
