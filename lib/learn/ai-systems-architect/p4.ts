import type { Phase } from "../model";

export const phase4: Phase = {
  n: 4,
  title: "Event-Driven & Microservices Architecture",
  weeks: "Weeks 31–38",
  summary:
    "Most systems an architect designs are several services that have to agree on what happened without sharing a database or a transaction. This phase covers both halves of that problem: events as the way services communicate and record facts, and microservice patterns for drawing service boundaries and managing data across them.\n\nThe recurring lesson is that distribution is a price you pay for independence. Learn to say what each boundary buys (independent deployment, scaling, ownership) and what it costs (eventual consistency, duplicate messages, partial failure, harder debugging), because AI platforms, with their ingestion pipelines, model services and agents, inherit all of it.",
  modules: [
    {
      id: "4.1",
      title: "Event-Driven Architecture Deep Dive",
      summary:
        "Event-driven architecture lets services react to facts (an order was placed, a payment failed) instead of calling each other directly. Producers publish events without knowing who consumes them, which makes it cheap to add consumers and lets each side scale and fail on its own.\n\nThe price is that no single place holds the current state of a business process. Data becomes eventually consistent, messages arrive twice or out of order, and a failure halfway through a workflow has to be undone by explicit compensation rather than a rollback. This module is about designing for those costs from the start.",
      topics: [
        {
          title: "Event-Driven Patterns",
          summary:
            "Two shapes cover most event-driven systems. In publish-subscribe, a broker hands each event to every interested subscriber and usually forgets it once delivered. In event streaming, events are appended to a durable, ordered log that consumers read at their own pace and can re-read later.\n\nThe choice decides whether history is kept, how ordering works and how a new consumer catches up. Separately, decide how much data each event carries, because that sets how tightly consumers depend on the producer.",
          items: [
            {
              t: "Publish-subscribe",
              d: "Producers publish events to a topic and the broker delivers a copy to each subscription. Producers don't know who consumes, so adding a consumer needs no change to the producer.",
              sub: [
                "Fan-out: one event triggers many independent reactions (email, analytics, search indexing)",
                "Decoupling has limits: producer and consumers still share the event schema, which becomes a public contract",
                "Retention: most pub/sub services keep a message only until each subscription acknowledges it or a retention period expires, so a new subscriber doesn't see older events",
              ],
            },
            {
              t: "Event streaming",
              d: "Events are appended to a durable, ordered log (Kafka, Pulsar, Kinesis). Each consumer tracks its own position (offset), so consumers read at their own pace and a slow one doesn't hold up the others.",
              sub: [
                "Retention: events stay for a configured time or size, or indefinitely",
                "Replay: reset a consumer's offset to reprocess history, for example to rebuild a read model or backfill a new service",
                "Log compaction: keep at least the latest event per key, turning the log into a table of current values",
              ],
            },
            {
              t: "Partitions and ordering",
              d: "Logs scale by splitting a topic into partitions, and order is guaranteed only within a partition, not across the topic. Events that must stay in order (everything for one order id) need the same partition key.",
              sub: [
                "Consumer groups: in a Kafka consumer group each partition is read by one member at a time, so the partition count caps the group's parallelism",
                "Hot keys: one very busy key overloads one partition; choose keys with enough spread",
                "Repartitioning: adding partitions changes which partition a key maps to, which breaks per-key ordering across the change",
              ],
            },
            {
              t: "Event payload design",
              d: "How much data an event carries sets how coupled consumers are to the producer (Martin Fowler's distinction).",
              sub: [
                "Event notification: a thin event (OrderPlaced, id 42); consumers call back for details, which brings back coupling and load on the producer",
                "Event-carried state transfer: the event carries the data consumers need, so they keep a local copy and keep working while the producer is down, at the cost of duplicated data",
                "Naming: events are past-tense facts (OrderPlaced); commands are requests that can be refused (PlaceOrder)",
              ],
            },
            {
              t: "Schema evolution",
              d: "Events outlive the code that wrote them, so their schema has to change without breaking consumers. A schema registry (Avro, Protobuf or JSON Schema) can reject incompatible changes at publish time.",
              sub: [
                "Backward compatible: consumers on the new schema can read old events (for example, add a field with a default)",
                "Forward compatible: consumers on the old schema can read new events (they ignore fields they don't know)",
                "Breaking changes: publish a new event version or topic and run both until every consumer has migrated",
              ],
            },
          ],
        },
        {
          title: "Event Sourcing & CQRS",
          summary:
            "Event sourcing stores the history of changes instead of the current state: the append-only list of events is the source of truth, and current state is derived by replaying it. CQRS separates the model that handles writes from the models that serve reads, so each can be shaped for its job.\n\nThey fit together naturally, since events from the write side feed the read models, but each is a significant commitment. Use them where history or very different read patterns really matter, not as a default.",
          items: [
            {
              t: "Events as source of truth",
              d: "Every change is stored as an immutable event (Deposited, Withdrawn) in an append-only event store; current state is never updated in place. Writes append to one stream per entity, usually with an expected-version check to catch concurrent writers.",
            },
            {
              t: "Rebuilding state",
              d: "Current state is computed by replaying an entity's events in order. Long streams make that slow, so systems save periodic snapshots and replay only the events written after the latest one.",
            },
            {
              t: "Projections",
              d: "Read models built by consuming the event stream, each shaped for one kind of query (current balance, monthly statement). A projection can be dropped and rebuilt from the events at any time, but it always lags a little behind the write side.",
            },
            {
              t: "What event sourcing buys",
              d: "Capabilities that are hard to add to a state-based system later.",
              sub: [
                "Audit trail: every change is recorded, with when and why",
                "Temporal queries: reconstruct the state as it was at any past moment",
                "Debugging: replay production events to reproduce a bug",
                "New read models: build a view nobody planned for from existing history",
              ],
            },
            {
              t: "What event sourcing costs",
              d: "Most of the costs arrive after launch, so plan for them up front.",
              sub: [
                "Event versioning: old events must stay readable forever; convert them when read (upcasting) or migrate the store",
                "Querying: the event store answers 'what happened to X', not ad hoc questions; every other query needs a projection",
                "Eventual consistency: projections lag, so a user may not see their own write straight away",
                "Deleting personal data: an immutable log conflicts with erasure requests; common answers are keeping personal data outside the events, or encrypting it per person and deleting the key (crypto-shredding)",
              ],
            },
            {
              t: "CQRS",
              d: "Command Query Responsibility Segregation: commands go to a write model that enforces the business rules, and queries go to one or more read models denormalised for fast reads. It is often combined with event sourcing but works without it, for example a relational write model feeding a search index.",
              sub: [
                "Benefit: scale and optimise reads and writes independently",
                "Cost: two models to keep in sync, and reads that lag writes",
                "Scope: Martin Fowler warns to apply it only to the parts of a system that need it, not to the whole system",
              ],
            },
          ],
        },
        {
          title: "Saga Patterns",
          summary:
            "A business transaction that spans several services (reserve stock, take payment, book shipping) can't use one database transaction, and two-phase commit across services is usually too slow and too fragile. A saga replaces it with a sequence of local transactions, each committed in its own service and triggering the next.\n\nIf a later step fails, earlier steps are not rolled back; they are undone by compensating transactions that you design. The main decision is who drives the sequence: the services themselves (choreography) or a coordinator (orchestration).",
          items: [
            {
              t: "Choreography",
              d: "Each service listens for events and publishes its own, with no central coordinator. The flow emerges from who subscribes to what.",
              sub: [
                "Pros: simple for short flows, loosely coupled, no extra component to run",
                "Cons: the overall flow isn't written down anywhere, so it is hard to trace, test and change",
                "Risk: cyclic dependencies when services subscribe to each other's events",
              ],
            },
            {
              t: "Orchestration",
              d: "A central orchestrator, often a state machine, sends commands to each service, listens for their reply events and decides the next step or compensation.",
              sub: [
                "Pros: the flow lives in one place, so it is easy to trace, test and change",
                "Cons: another component to build and run, and a risk of business logic drifting into the orchestrator",
                "Availability: the orchestrator is critical, so persist its state and run it replicated; a restarted instance then resumes in-flight sagas and it is not a single point of failure",
                "Tools: workflow engines such as Temporal or AWS Step Functions provide durable orchestration",
              ],
            },
            {
              t: "Compensating transactions",
              d: "A step that semantically undoes an earlier one: cancel the order, refund the payment, release the reserved stock. It is not a rollback: other transactions may already have seen the intermediate state, and some actions (an email already sent) can only be followed up, not undone.",
              sub: [
                "Order: compensate the completed steps in reverse order",
                "Reliability: compensations must be idempotent and safe to retry until they succeed",
                "Pivot step: the go/no-go step after which the saga only moves forward; steps that can't be compensated belong at or after it, and must be retryable",
              ],
            },
            {
              t: "Isolation anomalies",
              d: "Sagas give atomicity through compensation but no isolation, so concurrent sagas can see each other's unfinished work. Countermeasures restore as much isolation as the business case needs.",
              sub: [
                "Semantic lock: mark records as pending (ORDER_PENDING) so other sagas treat them with care",
                "Commutative updates: design operations that give the same result in any order, such as debits and credits",
                "Reread value: check that data hasn't changed before overwriting it (optimistic locking)",
              ],
            },
          ],
        },
        {
          title: "Reliable Messaging",
          summary:
            "Brokers, networks and consumers fail between steps, so every event-driven system has to answer three questions: can a message be lost, can it arrive twice, and what happens to one that can never be processed? In practice the answer is at-least-once delivery plus consumers that tolerate duplicates.\n\nThe transactional outbox closes the remaining gap: making sure an event is published if, and only if, the database change that caused it was committed.",
          items: [
            {
              t: "Delivery guarantees",
              d: "What a broker and its clients promise about loss and duplication.",
              sub: [
                "At-most-once: acknowledge before processing; no duplicates, but a crash loses the message",
                "At-least-once: acknowledge after processing; nothing is lost, but a crash between processing and acknowledging causes a redelivery. The usual default",
                "Exactly-once: holds only inside a closed system (for example Kafka to Kafka with transactions); end to end, it means at-least-once delivery plus idempotent processing",
              ],
            },
            {
              t: "Idempotent consumers",
              d: "Handling the same message twice must have the same effect as handling it once. Give every event a unique id and make each handler safe to repeat.",
              sub: [
                "Dedup table: record processed event ids in the same database transaction as the state change",
                "Natural idempotency: prefer 'set status to shipped' over 'increment shipped count'",
                "Idempotency keys: pass a key to downstream APIs (payments especially) so a retried call isn't executed twice",
              ],
            },
            {
              t: "Transactional outbox",
              d: "Writing to the database and then publishing to the broker is a dual write: a crash between the two either loses the event or publishes one for a change that was rolled back. Instead, write the event to an outbox table in the same transaction as the change, and let a separate relay publish it.",
              sub: [
                "Polling relay: a process reads unpublished rows, publishes them and marks them sent",
                "Change data capture: a CDC tool such as Debezium tails the database log and publishes the outbox rows",
                "Result: at-least-once publishing, so consumers still need to be idempotent",
              ],
            },
            {
              t: "Retries and dead-letter queues",
              d: "Retry transient errors with backoff, but don't let a message that always fails (a poison message) block the queue. After a set number of attempts, move it to a dead-letter queue, alert on it, and have a way to inspect and replay it.",
            },
            {
              t: "Consumer lag",
              d: "The gap between the newest event and a consumer's position. It is the main health signal of an event-driven system: rising lag means consumers can't keep up and the data they serve is getting staler.",
            },
          ],
        },
        {
          title: "Message Brokers",
          summary:
            "Brokers fall into two families. Log-based systems (Kafka, Pulsar, Kinesis) keep events after they are read, so many consumers can read and replay them independently. Queue-based systems (RabbitMQ, SQS) remove a message once a consumer acknowledges it and are built for distributing work.\n\nManaged services trade control for less operational work. Read the fine print on each: delivery and ordering guarantees usually hold only under specific settings.",
          items: [
            {
              t: "Log vs queue",
              d: "A log retains events and lets each consumer group keep its own position, which suits event streaming, replay and many independent readers. A queue hands each message to one of several competing workers and deletes it on acknowledgement, which suits task distribution and per-message retries.",
            },
            {
              t: "Apache Kafka",
              d: "A partitioned, replicated log built for high throughput and long retention. Ordering holds within a partition, not across a topic.",
              sub: [
                "Exactly-once: idempotent producers stop duplicates caused by producer retries, and transactions make a read-process-write step between Kafka topics atomic (consumers read with read_committed); side effects in external systems still need idempotent handling",
                "Ecosystem: Kafka Connect for integrations, Kafka Streams or Flink for stream processing",
                "Operations: partitions, retention and replication need capacity planning; managed options include Confluent Cloud and Amazon MSK",
              ],
            },
            {
              t: "RabbitMQ",
              d: "A message broker with flexible routing: producers publish to exchanges, which route messages to queues through bindings. It usually has lower throughput than Kafka, but it suits task queues, complex routing and per-message acknowledgement.",
              sub: [
                "Exchange types: direct, topic (pattern match on the routing key), fanout (broadcast) and headers",
                "Durability: quorum queues replicate messages across nodes using Raft",
                "Streams: since version 3.9, RabbitMQ also offers append-only, replayable streams that behave more like a log",
              ],
            },
            {
              t: "AWS SNS and SQS",
              d: "Managed building blocks that are often combined: an SNS topic fans out to several SQS queues, and each queue feeds its own pool of workers.",
              sub: [
                "Standard queues and topics: at-least-once delivery, best-effort ordering, very high throughput",
                "FIFO queues and topics: ordering within a message group and deduplication within a 5-minute window, with lower throughput limits",
                "EventBridge: an event bus with content-based routing rules and a schema registry, for AWS service and SaaS events",
              ],
            },
            {
              t: "Google Cloud Pub/Sub",
              d: "A managed pub/sub service with push, pull and export subscriptions (to BigQuery or Cloud Storage). Delivery is at-least-once by default.",
              sub: [
                "Exactly-once delivery: available on pull subscriptions when subscribers connect from the same region; push and export subscriptions don't support it",
                "Ordering keys: messages with the same key arrive in order if the subscription has ordering enabled and they were published in the same region",
                "Replay: seek a subscription back to a timestamp or snapshot within the retention window",
              ],
            },
          ],
        },
      ],
      mentalModels: [
        "Events are facts: immutable, timestamped, append-only, and named in the past tense.",
        "Eventual consistency is the norm: design the user experience and business rules for it rather than fighting it.",
        "Idempotency is mandatory: every consumer will eventually receive a duplicate.",
      ],
      exercises: [
        {
          title: "Design an e-commerce order saga",
          d: "Services: Order, Payment, Inventory, Shipping and Notification, coordinated by an orchestrator.",
          steps: [
            "Define the event and command schemas (OrderCreated, PaymentProcessed, InventoryReserved, OrderShipped and their failure events), including ids and versions",
            "Draw the saga as a state machine and mark the pivot step",
            "Write the compensating transaction for each step, and what happens if a compensation itself fails",
            "Choose an idempotency strategy for each consumer and decide where a transactional outbox is needed",
            "Walk through two failures: the payment is declined, and the orchestrator crashes mid-saga",
          ],
        },
        {
          title: "Design an event-sourced bank account",
          d: "Deposits, withdrawals and transfers between accounts.",
          steps: [
            "List the event types and their fields, and how each will be versioned",
            "Show how the balance is reconstructed from events and when snapshots are taken",
            "Design projections for the current balance and a monthly statement",
            "Answer a temporal query: what was the balance at the end of last month?",
            "Decide how a transfer between two accounts stays consistent: one stream, or a saga across two",
          ],
        },
      ],
      resources: [
        {
          kind: "article",
          title: "What Is Event-Driven Architecture? (IBM)",
          url: "https://www.ibm.com/think/topics/event-driven-architecture",
          free: true,
        },
        {
          kind: "article",
          title: "What is an Event-Driven Architecture? (AWS)",
          url: "https://aws.amazon.com/event-driven-architecture/",
          free: true,
          note: "Producers, routers and consumers, with common patterns",
        },
        {
          kind: "article",
          title: "What do you mean by \"Event-Driven\"? (Martin Fowler)",
          url: "https://martinfowler.com/articles/201701-event-driven.html",
          free: true,
          note: "Four patterns that often get confused",
        },
        {
          kind: "article",
          title: "Event Sourcing (Martin Fowler)",
          url: "https://martinfowler.com/eaaDev/EventSourcing.html",
          free: true,
        },
        {
          kind: "article",
          title: "Pattern: Saga (microservices.io)",
          url: "https://microservices.io/patterns/data/saga.html",
          free: true,
          note: "Follow the links to the transactional outbox pattern",
        },
        {
          kind: "docs",
          title: "Kafka Message Delivery Guarantees (Confluent)",
          url: "https://docs.confluent.io/kafka/design/delivery-semantics.html",
          free: true,
          note: "What exactly-once does and doesn't cover",
        },
      ],
    },
    {
      id: "4.2",
      title: "Microservices Architecture Patterns",
      summary:
        "Microservices split a system into independently deployable services, each owning its data and one slice of the business. The payoff is organisational as much as technical: a team can change, deploy and scale its service without coordinating with everyone else.\n\nThe cost is that every call between services becomes a network call that can be slow or fail, and data that used to be joined in one query is spread across databases. Most of the architect's work is drawing boundaries so that things that change together live together, then choosing how services communicate and stay consistent.",
      topics: [
        {
          title: "Domain-Driven Design",
          summary:
            "Domain-driven design (DDD) gives you the vocabulary for finding service boundaries in the business domain rather than in the database schema. Its strategic side (bounded contexts) says where boundaries go; its tactical side (aggregates, entities, value objects) says what must stay consistent inside them.\n\nGood boundaries keep most changes inside one service. Bad ones produce services that always have to be changed and deployed together.",
          items: [
            {
              t: "Bounded contexts",
              d: "A boundary within which a model and its terms have one meaning: 'customer' can mean different things to billing and to support. A bounded context is a strong candidate for a service boundary; a service shouldn't span several contexts, though one context may be split into several services.",
            },
            {
              t: "Ubiquitous language",
              d: "The shared vocabulary that developers and domain experts use inside one bounded context, in conversation and in code. When the same word needs two definitions, you have probably found a context boundary.",
            },
            {
              t: "Context mapping",
              d: "Describes how bounded contexts relate and translate between each other.",
              sub: [
                "Anti-corruption layer: a translation layer that keeps another context's (or a legacy system's) model out of yours",
                "Customer-supplier: the downstream team's needs shape the upstream team's plans",
                "Shared kernel: two contexts deliberately share a small model, at the cost of coordinating every change to it",
              ],
            },
            {
              t: "Aggregates",
              d: "A cluster of objects changed as one unit, with a single root entity as the only entry point. The aggregate is the consistency boundary: its invariants hold after every transaction.",
              sub: [
                "Keep them small: large aggregates cause write contention and slow loads",
                "Reference other aggregates by id, not by object",
                "Change one aggregate per transaction; coordinate across aggregates with events",
              ],
            },
            {
              t: "Entities vs value objects",
              d: "An entity has an identity that persists while its attributes change (a customer, an order). A value object is defined only by its attributes and is immutable (money, an address, a date range): replace it, don't modify it.",
            },
          ],
        },
        {
          title: "Decomposition Strategies",
          summary:
            "Decomposition decides which responsibilities go into which service. The goal is high cohesion inside each service and loose coupling between them, so that a typical feature touches only one.\n\nMost teams also decompose incrementally, carving services out of an existing monolith, which is far safer than a rewrite.",
          items: [
            {
              t: "By business capability",
              d: "One service per thing the business does: order management, payments, shipping. Capabilities change slowly, so boundaries drawn around them tend to last.",
            },
            {
              t: "By subdomain",
              d: "Use DDD subdomains (for example user, product catalogue, checkout) and classify them by strategic value.",
              sub: [
                "Core: what differentiates the business; build it and invest here",
                "Supporting: needed but not a differentiator; keep it simple",
                "Generic: already solved problems (authentication, email); buy or use open source",
              ],
            },
            {
              t: "Anti-patterns to avoid",
              d: "Boundaries that make every change span several services.",
              sub: [
                "Per-table services: a service per database table turns every business operation into a chain of network calls",
                "Per-layer services: splitting by technical layer (UI, logic, data) means every feature crosses all of them",
                "Distributed monolith: services that share a database or must deploy together, with all the costs of distribution and none of the independence",
              ],
            },
            {
              t: "Strangler fig migration",
              d: "Replace a monolith gradually: route traffic through a facade, extract one capability at a time into a service, and retire the old code as it is replaced. The system keeps running and delivering value throughout, unlike a big-bang rewrite.",
            },
            {
              t: "When not to split",
              d: "Microservices pay off when teams, release cadences or scaling needs diverge. For a small team or a domain you don't yet understand, a well-structured modular monolith is usually the better start, and it can be split later along boundaries you have learned.",
            },
          ],
        },
        {
          title: "Service Communication",
          summary:
            "Services talk either synchronously (a request that waits for a response) or asynchronously (a message that someone handles later). Synchronous calls are simpler to write and reason about, but they tie the caller's latency and availability to every service it calls.\n\nAsynchronous messaging removes that runtime coupling at the price of eventual consistency. Most systems use both: synchronous for queries a user is waiting on, asynchronous for work that can happen after the response.",
          items: [
            {
              t: "Synchronous: REST and gRPC",
              d: "Simple request-response that is easy to debug, but the caller waits and fails if the callee is down. Availability multiplies: a request that needs five services at 99.9% each is at best about 99.5% available.",
              sub: [
                "REST over HTTP and JSON: universal and easy to inspect; good for public and browser-facing APIs",
                "gRPC: Protobuf contracts over HTTP/2 with generated clients and streaming; efficient for internal calls",
                "Protect every call: timeouts, retries with backoff and circuit breakers",
              ],
            },
            {
              t: "Asynchronous: events and queues",
              d: "The sender publishes and moves on, and consumers process when they can. Services keep working when a peer is down and queues absorb load spikes, but results are eventually consistent and flows are harder to trace.",
            },
            {
              t: "API gateway",
              d: "A single entry point between clients and internal services that handles cross-cutting concerns once, instead of in every service.",
              sub: [
                "Routing: map external paths and versions to internal services",
                "Edge concerns: authentication (OAuth 2.0, JWT validation), rate limiting, TLS termination",
                "Transformation: adapt requests and responses, for example REST outside and gRPC inside",
                "Aggregation: compose several service calls into one response to cut client round trips",
                "Backends for frontends (BFF): a separate gateway per client type (web, mobile) so each gets an API shaped for it",
              ],
            },
            {
              t: "Service discovery",
              d: "How a caller finds healthy instances of a service whose addresses change as it scales and redeploys. In Kubernetes a Service provides a stable DNS name and virtual IP; elsewhere a registry such as Consul tracks instances.",
            },
          ],
        },
        {
          title: "Service Mesh",
          summary:
            "A service mesh moves networking concerns (encryption, retries, traffic shifting, telemetry) out of application code and into infrastructure. A data plane of proxies handles every request between services, and a control plane configures those proxies from central policy.\n\nIt gives uniform security and visibility across services written in different languages, but it adds latency, resource cost and a complex system to operate. It tends to pay off with many services and teams, not with a handful.",
          items: [
            {
              t: "Data plane",
              d: "Proxies that intercept all service-to-service traffic.",
              sub: [
                "Sidecar model: a proxy next to every service instance; Istio and Consul use Envoy, while Linkerd uses its own lightweight Rust proxy",
                "Sidecarless model: Istio's ambient mode uses a shared per-node proxy (ztunnel) for mTLS and layer-4 traffic, and adds Envoy-based waypoint proxies only where layer-7 features are needed",
              ],
            },
            {
              t: "Control plane",
              d: "Turns high-level policy (routing rules, security policy) into proxy configuration and pushes it to the data plane. It usually also acts as the certificate authority for mTLS. Examples: istiod in Istio, the Linkerd control plane, Consul servers.",
            },
            {
              t: "Mesh capabilities",
              d: "What the proxies provide without changes to application code.",
              sub: [
                "mTLS: encrypted, mutually authenticated traffic between services, with automatic certificate rotation",
                "Traffic management: retries, timeouts, canary and weighted routing, fault injection",
                "Observability: uniform request metrics and spans for every hop (applications must still forward trace headers)",
                "Policy: which service is allowed to call which",
              ],
            },
            {
              t: "When a mesh is worth it",
              d: "Adopt one when you need consistent mTLS, traffic control and telemetry across many services and languages. With only a few services, libraries and the platform's built-in features are usually cheaper to run and easier to debug.",
            },
          ],
        },
        {
          title: "Data Management",
          summary:
            "Once each service owns its database, the joins and transactions you took for granted in a monolith have to be rebuilt at the application level. The patterns here are the standard answers: sagas for updates that span services, and API composition or CQRS for queries that span them.\n\nEach one trades some consistency or simplicity for service autonomy, so choose per use case rather than system-wide.",
          items: [
            {
              t: "Database per service",
              d: "Each service's data is private and reachable only through its API, so a service can change its schema or storage technology without breaking others. The cost: no cross-service joins or ACID transactions.",
              sub: [
                "Cheaper variant: private tables or schemas on a shared database server, as long as no service touches another's tables",
                "Shared database anti-pattern: services reading each other's tables couple their schemas and their deployments",
              ],
            },
            {
              t: "Sagas for updates",
              d: "Business transactions that span services use a saga of local transactions with compensations (see 4.1), not distributed transactions.",
            },
            {
              t: "API composition",
              d: "A composer (the gateway or a dedicated service) queries each owning service and joins the results in memory. It is simple, but latency follows the slowest service, availability drops with each service involved, and large joins are inefficient.",
            },
            {
              t: "CQRS read models",
              d: "For queries that span services or need a different shape, subscribe to other services' events and maintain a local, denormalised view (see 4.1). Reads are fast and independent, at the cost of eventual consistency and another store to run.",
            },
            {
              t: "Reliable event publishing",
              d: "Every pattern above depends on services publishing events whenever their data changes. Use a transactional outbox or change data capture so the state change and the event can't diverge.",
            },
          ],
        },
      ],
      mentalModels: [
        "Services are autonomous: they own their data and deploy independently. If two services must always deploy together, they are one service.",
        "Network calls are expensive: minimise, batch and cache them, and give every one a timeout.",
        "Services fail independently: design every caller for partial failure.",
      ],
      exercises: [
        {
          title: "Decompose a travel platform",
          d: "Domains: User, Search, Booking, Payment, Review and Recommendation.",
          steps: [
            "Define the bounded context and key terms for each domain",
            "Assign data ownership: which service is the source of truth for each entity",
            "List each service's API and the events it publishes and consumes",
            "Choose synchronous or asynchronous communication for each interaction and justify it",
            "Describe the consistency strategy for a booking that spans Booking, Payment and an external supplier",
          ],
        },
        {
          title: "Design an API gateway",
          d: "Requirements: per-user rate limiting, OAuth/JWT authentication and request aggregation.",
          steps: [
            "Choose the topology: one shared gateway, or a backend for each client type",
            "Design per-user rate limiting and decide where its counters live",
            "Define how tokens are validated and what identity is passed to internal services",
            "Design the caching strategy for aggregated responses",
            "Define fallbacks when a downstream service is slow or down: partial responses, cached data or an error",
          ],
        },
      ],
      resources: [
        {
          kind: "book",
          title: "Building Microservices, 2nd Edition (Sam Newman)",
          url: "https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/",
        },
        {
          kind: "article",
          title: "A pattern language for microservices (Chris Richardson)",
          url: "https://microservices.io/patterns/index.html",
          free: true,
          note: "Decomposition, data, communication and gateway patterns",
        },
        {
          kind: "article",
          title: "Microservices (James Lewis and Martin Fowler)",
          url: "https://martinfowler.com/articles/microservices.html",
          free: true,
          note: "The 2014 article that defined the style",
        },
        {
          kind: "article",
          title: "Bounded Context (Martin Fowler)",
          url: "https://martinfowler.com/bliki/BoundedContext.html",
          free: true,
        },
        {
          kind: "article",
          title: "What is a service mesh? (Linkerd)",
          url: "https://linkerd.io/what-is-a-service-mesh/",
          free: true,
        },
      ],
    },
  ],
};
