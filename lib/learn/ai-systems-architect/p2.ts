import type { Phase } from "../model";

export const phase2: Phase = {
  n: 2,
  title: "Data Architecture & Pipeline Design",
  weeks: "Weeks 7–16",
  summary:
    "Before a model can learn from data or a RAG system can retrieve it, the data has to be moved, cleaned, versioned and served reliably. This phase covers how pipelines are built to survive failure, how batch and streaming differ, how large organisations divide ownership of data, and how to make SQL fast.\n\nData work is where many AI systems quietly break: duplicate records, silent schema changes, stale features. The goal is to design pipelines and data platforms whose failure modes are known, recoverable and owned by someone.",
  modules: [
    {
      id: "2.1",
      title: "Data Pipeline Architecture Patterns",
      summary:
        "A data pipeline moves data from where it is produced to where it is used, and sooner or later every step in it will fail, be retried or need rerunning over last month's data. The patterns in this module make that safe: idempotent writes, dead letter queues, backfills, schema contracts and change data capture.\n\nThe second half covers processing models. Batch is simple and efficient but slow; streaming is fresh but has to deal with time, late data and state. Lambda and Kappa are two answers to running both.",
      topics: [
        {
          title: "Pipeline Design Patterns",
          summary:
            "These patterns make pipelines safe to retry, rerun and change. The core idea is idempotency: if running a step twice gives the same result as running it once, retries and backfills stop being dangerous.\n\nThe rest deals with bad records, reprocessing history, and changes to upstream schemas and databases.",
          items: [
            {
              t: "Idempotency",
              d: "Design each step so it can be retried safely without creating duplicates. This is what turns retries, restarts and backfills into routine operations.",
              sub: [
                "Staging-merge: load into a staging table, deduplicate there, then MERGE into the target in one transaction",
                "Partition overwrite: write each run's output to a partition keyed by its logical date, so a retry replaces that partition instead of appending to it",
                "Upsert on a unique key: insert or update by a natural key such as transaction_id or event_id, so a replay updates rows instead of adding them",
              ],
            },
            {
              t: "Exactly-once semantics",
              d: "Delivery guarantees come as at-most-once, at-least-once or exactly-once. True exactly-once only holds inside systems built for it; end to end, you usually get at-least-once delivery plus idempotent processing.",
              sub: [
                "Kafka EOS: idempotent producers stop retries from writing duplicates, and transactions commit output records atomically together with the consumer offsets; downstream consumers read with isolation.level=read_committed",
                "Practical approach: design for idempotence rather than rely on exactly-once; it also covers the sinks, such as databases and APIs, that Kafka's transactions cannot reach",
              ],
            },
            {
              t: "Dead letter queues",
              d: "Route records that keep failing (malformed, unexpected schema, failed lookup) to a separate queue with the error attached, so one poison message doesn't block the pipeline. A DLQ needs an owner, an alert on its size and a way to replay records once the fix ships.",
            },
            {
              t: "Backfilling",
              d: "Plan for reprocessing history from day one: parameterise jobs by date or partition, keep raw input immutable and make every step idempotent. A backfill then becomes the same job run over older partitions, throttled so it doesn't starve the live runs.",
            },
            {
              t: "Schema evolution",
              d: "Upstream schemas will change; compatibility rules decide who breaks. Formats such as Avro and Protobuf, combined with a schema registry, let you check compatibility before a change ships.",
              sub: [
                "Backward compatible: consumers on the new schema can read data written with the old one; upgrade consumers first",
                "Forward compatible: consumers still on the old schema can read data written with the new one; upgrade producers first",
                "Full: both at once, so producers and consumers can upgrade in any order; adding or removing optional fields (with defaults) keeps it",
              ],
            },
            {
              t: "Change data capture",
              d: "Stream every insert, update and delete from a database as events instead of repeatedly querying it. Common tools are Debezium and AWS Database Migration Service (DMS).",
              sub: [
                "Log-based: read the database's own change log (the PostgreSQL WAL, the MySQL binlog); captures deletes and every intermediate state with little load on the source",
                "Query-based: poll for rows with a newer updated_at; simpler, but misses hard deletes and any change overwritten between polls",
                "Snapshot then stream: take a consistent initial snapshot, then apply changes from the log position at which it was taken",
              ],
            },
          ],
        },
        {
          title: "Processing Models",
          summary:
            "Batch processing works on bounded datasets on a schedule, which makes it simple, efficient and easy to rerun, but results are only as fresh as the last run. Stream processing handles unbounded data as it arrives, which buys freshness at the cost of reasoning about time, ordering and state.\n\nLambda and Kappa are two architectures for serving both historical and real-time views.",
          items: [
            {
              t: "Batch processing",
              d: "Process a bounded dataset in one job, using the MapReduce model of map, shuffle and reduce, today mostly run on Spark. It maximises throughput and is easy to rerun, at the cost of latency measured in minutes or hours.",
            },
            {
              t: "Stream processing",
              d: "Process events continuously as they arrive, with latency from milliseconds to seconds. Common engines are Apache Flink, Kafka Streams and Spark Structured Streaming.",
            },
            {
              t: "Lambda architecture",
              d: "Run a batch layer that periodically recomputes accurate views alongside a speed layer that covers recent data, and merge the two at query time. It has fallen out of favour because the same logic must be written, tested and kept in sync in two different systems.",
            },
            {
              t: "Kappa architecture",
              d: "Use one streaming system for everything. To reprocess, replay the retained log through a new version of the job into a new output, then switch readers over. Proposed by Jay Kreps in 2014, it depends on the log keeping enough history.",
            },
          ],
        },
        {
          title: "Streaming Concepts",
          summary:
            "Streaming gets hard because events carry their own timestamps and arrive late or out of order. Windows cut an endless stream into finite groups, watermarks decide when a window is complete enough to emit, and state lets a job remember what it has already seen.\n\nEach of these trades latency against completeness and cost.",
          items: [
            {
              t: "Event time vs processing time",
              d: "Event time is when something happened; processing time is when the system sees it. The two can differ by seconds or by days (a phone that was offline), and correct results usually need event time.",
            },
            {
              t: "Windowing strategies",
              d: "How an unbounded stream is grouped for aggregation.",
              sub: [
                "Tumbling: fixed-size windows that don't overlap, such as totals per minute",
                "Sliding (hopping): fixed-size windows that overlap, such as a 10-minute window every minute; each event lands in several windows",
                "Session: per-key windows that close after a gap of inactivity, so their length follows user behaviour",
              ],
            },
            {
              t: "Watermarks",
              d: "A watermark is the system's estimate that no more events older than time T will arrive, which lets a window close and emit its result. Events that arrive behind the watermark are late: drop them, send them to a side output, or update the result within an allowed-lateness period.",
            },
            {
              t: "State management",
              d: "Joins, aggregations and deduplication need a job to remember past events. Engines keep state in memory for speed or in RocksDB on local disk when it is large, and snapshot it to durable storage (Flink checkpoints, Kafka Streams changelog topics) so a restarted job resumes where it stopped.",
            },
          ],
        },
      ],
      mentalModels: [
        "Pipelines will fail: design for retries, partial failures and reprocessing.",
        "Data quality is a pipeline concern: validate, monitor and alert as you would for a service.",
        "A schema is a contract: treat it like an API, version it and enforce compatibility.",
      ],
      exercises: [
        {
          title: "Design a fraud detection pipeline",
          d: "Requirements: ingest 100K transactions per second, enrich each with customer data and flag anomalies in under 100 ms. Suggested shape: Kafka → stream processing (Flink) → feature store → model serving → alerts.",
          steps: [
            "Size the Kafka topics: partition count, partition key and retention for 100K events per second",
            "Design enrichment: where customer data lives and how the stream job reads it inside the latency budget (local state or remote lookups)",
            "Document the idempotency strategy: what happens when a transaction is processed twice",
            "Write the schema evolution plan for the transaction event",
            "Define monitoring: consumer lag, latency percentiles, DLQ rate and data quality checks",
          ],
        },
        {
          title: "Pipeline failure analysis",
          d: "Learn from other people's outages.",
          steps: [
            "Find three public post-mortems of data pipeline failures on engineering blogs",
            "For each, write a one-page analysis: root cause, time to detect, recovery strategy",
            "Name the pattern from this module that would have prevented or contained the failure",
          ],
        },
      ],
      resources: [
        {
          kind: "article",
          title: "Data Pipeline Design Patterns: Idempotency, DLQ, CDC and 5 More (dataskew.io)",
          url: "https://dataskew.io/blog/data-pipeline-design-patterns/",
          free: true,
        },
        {
          kind: "article",
          title: "Functional Data Engineering (Maxime Beauchemin)",
          url: "https://maximebeauchemin.medium.com/functional-data-engineering-a-modern-paradigm-for-batch-data-processing-2327ec32c42a",
          free: true,
          note: "Idempotent, partition-overwrite batch jobs and backfills",
        },
        {
          kind: "article",
          title: "Exactly-Once Semantics Is Possible: Here's How Apache Kafka Does It (Confluent)",
          url: "https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/",
          free: true,
        },
        {
          kind: "article",
          title: "Streaming 101: The World Beyond Batch (Tyler Akidau)",
          url: "https://www.oreilly.com/radar/the-world-beyond-batch-streaming-101/",
          free: true,
          note: "Event time and windows; follow with Streaming 102 for watermarks",
        },
        {
          kind: "article",
          title: "Questioning the Lambda Architecture (Jay Kreps)",
          url: "https://www.oreilly.com/radar/questioning-the-lambda-architecture/",
          free: true,
          note: "Where the Kappa architecture comes from",
        },
      ],
    },
    {
      id: "2.2",
      title: "Data Mesh vs Data Fabric",
      summary:
        "Data mesh and data fabric address the same situation: an organisation's data is spread across many systems and teams, and one central data team can't keep up. Data mesh is mainly an organisational model that moves ownership to domain teams. Data fabric is mainly a technical layer that connects scattered sources through shared metadata and unified access.\n\nAn architect needs to tell which problem an organisation actually has. The two are often sold as rivals, but they answer different questions: who owns the data, and how it is connected.",
      topics: [
        {
          title: "Data Mesh Principles",
          summary:
            "Data mesh, defined by Zhamak Dehghani, applies domain-driven design to analytical data. It rests on four principles that only work together: ownership moves to domains, data is treated as a product, a platform makes that practical, and governance is shared and automated.\n\nThe trade-off is organisational. Domains gain autonomy and speed, but every domain now needs data engineering skills, and consistency across domains has to be designed in.",
          items: [
            {
              t: "Domain-oriented ownership",
              d: "The teams closest to the data, such as bookings or payments, own it and serve it to the rest of the organisation, instead of handing it to a central data team that becomes a bottleneck.",
            },
            {
              t: "Data as a product",
              d: "Each shared dataset has an owner, known consumers, documentation and service levels, and is run like a product rather than left as a by-product of a pipeline. Dehghani lists the qualities it needs: discoverable, addressable, trustworthy, self-describing, interoperable and secure.",
            },
            {
              t: "Self-serve data platform",
              d: "A central platform team provides storage, pipelines, a catalogue and access control as self-service tools, so domain teams can build data products without being infrastructure specialists.",
            },
            {
              t: "Federated computational governance",
              d: "Representatives of the domains and the platform agree on global rules (identifiers, interoperability, privacy), and the platform enforces them automatically as policy in code rather than by manual review. Everything else stays with the domains.",
            },
          ],
        },
        {
          title: "Data Fabric Concepts",
          summary:
            "Data fabric, a term popularised by Gartner, is an integration layer across existing systems. It uses metadata about the data (schemas, lineage, usage, quality) to automate discovery, integration and governance, and gives consumers one way to find and reach data wherever it lives.\n\nIt leaves ownership as it is, which makes it easier to adopt, but it concentrates responsibility in the team that runs the fabric.",
          items: [
            {
              t: "Active metadata",
              d: "Metadata that is collected continuously and acted on: lineage, usage and quality signals drive automated discovery, recommendations and policy enforcement, instead of sitting in a static catalogue.",
            },
            {
              t: "Unified data access layer",
              d: "One logical access point across many sources, often built on data virtualisation, which queries data where it lives instead of copying it. Virtualisation avoids copies but pushes query load and latency onto the source systems, so heavily used data is often still replicated.",
            },
            {
              t: "Knowledge graph",
              d: "A semantic layer that models business entities and how datasets relate to them, so people and tools can find and join data by meaning rather than by table names.",
            },
            {
              t: "Augmented data management",
              d: "Machine learning applied to data management itself: classifying and tagging sensitive data, suggesting joins and mappings, and flagging quality anomalies.",
            },
          ],
        },
        {
          title: "When to Choose Which",
          summary:
            "The choice follows from the bottleneck. If it is people, with a central team that can't keep up with many domains, data mesh addresses it. If it is technology, with data scattered across systems that nobody can find or join, data fabric addresses it.\n\nMany organisations have both problems and end up with a mix.",
          items: [
            {
              t: "When data mesh fits",
              d: "Large organisations with many distinct domains, where a central data team is the bottleneck and domain teams can take on real data engineering work. It is an organisational change first; without that capacity it stalls.",
            },
            {
              t: "When data fabric fits",
              d: "The main problem is heterogeneous, scattered sources that need unified discovery, access and governance, and a central team can own the integration. It doesn't require reorganising teams, which suits organisations that aren't ready for a mesh.",
            },
            {
              t: "Hybrid approach",
              d: "Use mesh for ownership and accountability, and fabric techniques (active metadata, a catalogue, unified access) inside the self-serve platform. The two answer different questions, so they combine rather than compete.",
            },
          ],
        },
      ],
      mentalModels: [
        "Organisational structure drives architecture: Conway's Law applies to data.",
        "Governance is a spectrum: centralised, federated, decentralised.",
        "Data products have customers: think about discoverability, usability and SLAs.",
      ],
      exercises: [
        {
          title: "Data mesh for a travel company",
          d: "Domains: bookings, customer profiles, destinations, payments and reviews.",
          steps: [
            "For each domain, define one or two data products and who consumes them",
            "Set SLAs for each product (freshness, availability, quality) and name its owner",
            "Describe the access patterns and interfaces: tables, event streams or APIs",
            "Design the governance model: which standards are global (shared ids, PII handling, formats) and what stays with each domain",
          ],
        },
        {
          title: "Design a data fabric",
          d: "Scenario: about ten disparate sources, such as Salesforce, HubSpot, PostgreSQL, MongoDB, S3 and internal APIs.",
          steps: [
            "Design the metadata layer: what is harvested, from which sources and how often",
            "Choose a virtualisation strategy: what is queried in place, what is copied, and why",
            "Design access control across sources, including column- and row-level rules for personal data",
            "Design lineage tracking from each source through to reports and models",
          ],
        },
      ],
      resources: [
        {
          kind: "article",
          title: "Data Mesh Principles and Logical Architecture (Zhamak Dehghani)",
          url: "https://martinfowler.com/articles/data-mesh-principles.html",
          free: true,
          note: "The primary source for the four principles",
        },
        {
          kind: "article",
          title: "What is data mesh? (Google Cloud)",
          url: "https://cloud.google.com/discover/what-is-data-mesh",
          free: true,
        },
        {
          kind: "article",
          title: "Data Fabric vs. Data Mesh (SAP)",
          url: "https://www.sap.com/resources/data-fabric-vs-data-mesh",
          free: true,
        },
        {
          kind: "article",
          title: "Data Mesh vs. Data Fabric (Databricks)",
          url: "https://www.databricks.com/blog/data-mesh-vs-data-fabric",
          free: true,
          note: "Vendor view: argues one lakehouse can serve both",
        },
        {
          kind: "article",
          title: "Data mesh vs. data fabric vs. data virtualization (InfoWorld)",
          url: "https://www.infoworld.com/article/3963138/data-mesh-vs-data-fabric-vs-data-virtualization-theres-a-difference.html",
          free: true,
        },
      ],
    },
    {
      id: "2.3",
      title: "Advanced SQL for Architects",
      summary:
        "SQL is still the language most data platforms share, from PostgreSQL to cloud warehouses to lakehouse engines. An architect doesn't write every query, but must be able to model data, read an execution plan and judge whether a slow query needs an index, a rewrite or a different design.\n\nThis module goes past everyday SQL: window functions, recursive queries, how the optimiser chooses a plan, and the index and join choices behind it. Examples use PostgreSQL; other engines differ in the details.",
      topics: [
        {
          title: "Window Functions Deep Dive",
          summary:
            "Window functions compute across a set of rows related to the current row without collapsing them, as GROUP BY would. They replace many self-joins and correlated subqueries: rankings, running totals, comparisons with the previous row.\n\nThe subtle part is the frame, meaning which rows each calculation actually sees.",
          items: [
            {
              t: "Ranking functions",
              d: "ROW_NUMBER, RANK and DENSE_RANK number the rows within a partition; they differ only in how they treat ties.",
              sub: [
                "ROW_NUMBER: always unique (1, 2, 3), with ties broken arbitrarily unless the ORDER BY is unique; use it for deduplication and top-N per group",
                "RANK: ties share a rank and leave a gap after them (1, 1, 3)",
                "DENSE_RANK: ties share a rank with no gap (1, 1, 2)",
              ],
            },
            {
              t: "Navigation functions",
              d: "LAG and LEAD read a value from an earlier or later row; FIRST_VALUE, LAST_VALUE and NTH_VALUE read from a position within the frame. With the default frame, LAST_VALUE stops at the current row and its ties, not at the end of the partition, which surprises almost everyone once.",
            },
            {
              t: "Window aggregates",
              d: "SUM, AVG, COUNT and other aggregates with OVER (PARTITION BY ... ORDER BY ...) give running totals, moving averages and each row's share of its group while keeping every row.",
            },
            {
              t: "Frame specifications",
              d: "The frame decides which rows an aggregate or navigation function sees.",
              sub: [
                "ROWS BETWEEN: counts physical rows, e.g. ROWS BETWEEN 6 PRECEDING AND CURRENT ROW for a 7-row moving average",
                "RANGE BETWEEN: works on the ORDER BY value, so rows with equal values (peers) are always included together; with ORDER BY and no frame clause, the default is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW",
                "Performance: write ROWS when you mean rows; some engines, SQL Server among them, run ROWS frames noticeably faster than the default RANGE frame",
              ],
            },
          ],
        },
        {
          title: "CTEs & Recursive Queries",
          summary:
            "Common table expressions (WITH clauses) name intermediate results so a long query reads as a series of steps. Recursive CTEs go further and walk hierarchies and graphs of unknown depth in a single query.\n\nThe trade-off is performance: depending on the engine and version, a CTE is either inlined into the main query or computed once and stored, and that choice can change the plan dramatically.",
          items: [
            {
              t: "CTEs for modularity",
              d: "Break a complex query into named, readable steps, each building on the one before. A CTE can also be referenced more than once in the same query.",
            },
            {
              t: "Recursive CTEs",
              d: "A base query plus a recursive part that joins back to the CTE, repeated until no new rows appear. Use them for org charts, category trees and bills of materials.",
              sub: [
                "Cycles: guard against loops in the data by tracking the visited path, or with the CYCLE clause in PostgreSQL 14 and later",
                "Indexing: index the parent-id column the recursive step joins on, or every level scans the whole table",
              ],
            },
            {
              t: "CTE performance",
              d: "Before PostgreSQL 12 every CTE was materialised, which blocked optimisations across it. Since 12, a side-effect-free, non-recursive CTE referenced once is inlined; write MATERIALIZED or NOT MATERIALIZED to override. Other engines have their own rules, so check the plan.",
            },
          ],
        },
        {
          title: "Query Optimisation",
          summary:
            "The optimiser turns a declarative query into a physical plan, choosing scans, join order and join algorithms from its statistics about the data. Most slow queries come from a missing or unusable index, or from the optimiser misjudging how many rows a step will return.\n\nReading plans and designing indexes are the core skills. Every index speeds up some reads and slows down every write.",
          items: [
            {
              t: "Execution plans",
              d: "EXPLAIN shows the plan the optimiser chose; EXPLAIN ANALYZE also runs the query and reports actual times and row counts.",
              sub: [
                "Scan types: a sequential scan reads the whole table; an index scan follows the index to matching rows; an index-only scan answers from the index alone; a bitmap scan gathers many matches and reads them in page order",
                "Estimates vs actuals: a large gap between estimated and actual rows points to stale or missing statistics, and usually explains a bad join choice",
                "Caution: EXPLAIN ANALYZE really executes the statement, so wrap INSERT, UPDATE and DELETE in a transaction and roll it back",
              ],
            },
            {
              t: "Index types",
              d: "Match the index structure to the operators your queries use (PostgreSQL names shown).",
              sub: [
                "B-tree: the default; equality, ranges and sorting",
                "Hash: equality only; rarely a better choice than a B-tree",
                "GIN: an inverted index for values that contain many items, such as full-text documents, arrays and JSONB",
                "GiST: a balanced tree for geometric, range and nearest-neighbour queries, such as PostGIS geospatial data",
                "BRIN: tiny summaries of block ranges; suits huge tables whose rows are physically ordered, such as append-only time series",
              ],
            },
            {
              t: "Covering indexes",
              d: "An index that holds every column a query needs lets the database answer from the index alone (an index-only scan). In PostgreSQL 11 and later, INCLUDE adds non-key columns; the cost is a bigger index to maintain on every write.",
            },
            {
              t: "Partial indexes",
              d: "Index only the rows queries care about, e.g. WHERE status = 'open'. The index is smaller and cheaper to maintain, but only queries whose filter implies the index condition can use it.",
            },
          ],
        },
        {
          title: "Query Patterns",
          summary:
            "Beyond indexes, performance comes from giving the optimiser less work: joins it can skip, filters it can apply early, results it can reuse. Knowing these patterns helps you write queries that optimise well and spot when the optimiser has missed something.\n\nWhen it has, the options are rewriting the query or storing a precomputed answer.",
          items: [
            {
              t: "Join elimination",
              d: "The optimiser drops a join whose table contributes no columns and cannot change the result, such as a left join to a unique key, or an inner join guaranteed by a trusted foreign key. Support varies: PostgreSQL removes the left-join case, while foreign-key-based elimination is found in engines such as SQL Server and Oracle.",
            },
            {
              t: "Predicate pushdown",
              d: "Apply filters as early as possible, ideally in the scan itself, so later steps handle fewer rows. In warehouses and lakehouse engines it also means skipping whole partitions and file blocks using their statistics.",
            },
            {
              t: "Materialized views",
              d: "Store the result of an expensive aggregation and read it like a table. The trade-off is freshness: PostgreSQL recomputes them only on demand (REFRESH MATERIALIZED VIEW), while some warehouses maintain them incrementally.",
            },
            {
              t: "Query rewriting",
              d: "When the plan is poor and no index will fix it, restate the query so the optimiser can do better.",
              sub: [
                "Sargable predicates: compare the bare column (created_at >= '2026-01-01') instead of wrapping it in a function, so an index can be used",
                "Keyset pagination: filter on the last key seen instead of using a large OFFSET, which reads and discards every skipped row",
                "Decorrelation: turn a subquery that runs once per row into a join or a single grouped aggregate",
              ],
            },
          ],
        },
        {
          title: "Advanced Join Patterns",
          summary:
            "Most joins are plain equality joins, but a few patterns come up constantly: top-N per group, rows that have (or lack) a match, and knowing which physical join algorithm the optimiser picked and why.\n\nChoosing the right form of a query often matters more than adding another index.",
          items: [
            {
              t: "Lateral joins",
              d: "A LATERAL subquery (CROSS APPLY in SQL Server) can refer to columns of the tables before it, like a correlated subquery that returns several rows and columns. The classic use is top-N per group, such as each customer's three latest orders.",
            },
            {
              t: "Semi-joins and anti-joins",
              d: "EXISTS returns rows that have at least one match, without duplicating them; NOT EXISTS returns rows with no match. Prefer NOT EXISTS to NOT IN: if the subquery returns a single NULL, NOT IN returns no rows at all.",
            },
            {
              t: "Join strategies",
              d: "The physical algorithm the optimiser picks for each join, based on input sizes, sort order, available indexes and memory.",
              sub: [
                "Nested loop: for each outer row, look up matches in the inner input; best when the outer side is small and the inner side is indexed; works with any join condition",
                "Hash join: build a hash table on the smaller input, then probe it with the larger; good for large unsorted inputs, but equality joins only and needs memory",
                "Merge join: walk two inputs sorted on the join key in step; good when both are large and already sorted, for example by an index",
              ],
            },
          ],
        },
      ],
      mentalModels: [
        "SQL is declarative: describe what you want, trust the optimiser, then check its plan.",
        "Indexes are trade-offs: faster reads, slower writes, more storage.",
        "Execution plans tell the truth: run EXPLAIN ANALYZE before you optimise.",
      ],
      exercises: [
        {
          title: "Query optimisation challenge",
          d: "Load a real dataset (e.g. from Kaggle or StrataScratch) into PostgreSQL and pick five slow queries.",
          steps: [
            "Run EXPLAIN (ANALYZE, BUFFERS) on each and record the time and the plan",
            "Identify the bottleneck: sequential scans of large tables, misestimated row counts, expensive sorts or joins",
            "Optimise: add or change indexes, rewrite the query, restructure it with CTEs",
            "Re-run and record the improvement, along with the write and storage cost of any new index",
          ],
        },
        {
          title: "Design a CRM data model",
          d: "Entities: contacts, companies, deals, activities and custom fields.",
          steps: [
            "Design a normalised schema (3NF) and decide how to store custom fields (entity-attribute-value, JSONB or extra columns), with reasons",
            "Write ten complex queries using window functions, CTEs and at least one recursive query, such as a company hierarchy",
            "Design the indexing strategy for the most common query patterns",
            "Check each query's plan against your indexes and adjust",
          ],
        },
      ],
      resources: [
        {
          kind: "book",
          title: "SQL Performance Explained (Markus Winand)",
          url: "https://use-the-index-luke.com/",
          free: true,
          note: "Free web edition: Use The Index, Luke",
        },
        {
          kind: "docs",
          title: "PostgreSQL: Using EXPLAIN",
          url: "https://www.postgresql.org/docs/current/using-explain.html",
          free: true,
        },
        {
          kind: "docs",
          title: "PostgreSQL: WITH Queries (Common Table Expressions)",
          url: "https://www.postgresql.org/docs/current/queries-with.html",
          free: true,
          note: "Recursion, cycle detection and materialisation",
        },
        {
          kind: "practice",
          title: "StrataScratch",
          url: "https://www.stratascratch.com/",
          note: "Free tier available",
        },
        {
          kind: "practice",
          title: "DataLemur",
          url: "https://datalemur.com/",
          note: "Free tier available",
        },
        {
          kind: "practice",
          title: "LeetCode Database problems",
          url: "https://leetcode.com/problemset/database/",
          note: "Filter by Hard; some problems need Premium",
        },
      ],
    },
  ],
};
