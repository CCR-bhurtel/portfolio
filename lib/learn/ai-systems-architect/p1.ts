import type { Phase } from "../model";

export const phase1: Phase = {
  n: 1,
  title: "System Design Foundations",
  weeks: "Weeks 1–6",
  summary:
    "Everything later in this roadmap, from data pipelines to RAG to multi-agent systems, is a distributed system in a different costume. This phase builds the vocabulary: how systems scale, what consistency actually promises, and how things fail.\n\nThe goal is not to memorise patterns but to reason about trade-offs under failure, because that is the question every architecture review ends up asking.",
  modules: [
    {
      id: "1.1",
      title: "Core Architectural Principles",
      summary:
        "The core toolkit for reasoning about any system at scale: how to add capacity, what you give up once data lives in more than one place, and how to keep serving when parts break.\n\nAlmost every design decision you will make later traces back to one of these three questions. Learn the options, but spend most of your time on what each option costs.",
      topics: [
        {
          title: "Scalability Patterns",
          summary:
            "Scaling means adding capacity without rewriting the system. Vertical scaling (a bigger machine) is simple until it hits a hardware or cost ceiling. Horizontal scaling (more machines) has no hard ceiling, but it forces you to route requests, cache hot data and split state across nodes.\n\nFor each lever, learn what it fixes and what new problem it creates.",
          items: [
            {
              t: "Horizontal vs vertical scaling",
              d: "Scale up one machine or scale out across many. Up is simpler; out survives node loss and has no ceiling, but state must be shared or partitioned.",
            },
            {
              t: "Load balancing algorithms",
              d: "How a balancer picks a backend for each request.",
              sub: [
                "Round-robin: rotate through backends evenly; fine when requests cost about the same",
                "Least connections: send to the least-busy backend; better when request cost varies",
                "Consistent hashing: map keys onto a ring so adding or removing a node moves only about 1/n of the keys; used for sticky routing and distributed caches",
              ],
            },
            {
              t: "Caching strategies",
              d: "Where writes go, and how the cache stays correct.",
              sub: [
                "Cache-aside: the app reads the cache, falls back to the store on a miss and fills the cache; the most common pattern",
                "Write-through: write the cache and the store together; consistent, but every write pays both",
                "Write-back (write-behind): write the cache and flush to the store later; fast, but a crash can lose data",
                "Write-around: write only the store; keeps write-once data from evicting hot entries",
                "Invalidation: TTLs, delete-on-write and versioned keys; the genuinely hard part",
              ],
            },
            {
              t: "Database sharding strategies",
              d: "Splitting one dataset across many databases.",
              sub: [
                "Range-based: contiguous key ranges per shard; range scans are cheap, but sequential keys create hot spots",
                "Hash-based: shard by hash of the key; even spread, but range queries fan out to every shard",
                "Directory-based: a lookup service maps keys to shards; flexible rebalancing, one more dependency to keep up",
              ],
            },
          ],
        },
        {
          title: "Consistency & Availability",
          summary:
            "Once data is replicated, every read has to decide how fresh it must be, and every write has to decide what to do when replicas can't reach each other. Consistency models are the contract between your storage and your application.\n\nPick the wrong one and it shows up as lost updates, stale reads or latency you didn't need to pay.",
          items: [
            {
              t: "CAP theorem",
              d: "During a network partition, a replicated store must choose between consistency (refuse or block requests) and availability (answer, possibly with stale data). Compare a CP system like ZooKeeper with an AP, Dynamo-style store like Cassandra at low consistency levels.",
            },
            {
              t: "PACELC",
              d: "Extends CAP: if there is a Partition, choose Availability or Consistency; Else, even when the network is healthy, choose Latency or Consistency. It explains why most systems trade consistency for speed day to day.",
            },
            {
              t: "Consistency models",
              d: "What a read is guaranteed to see.",
              sub: [
                "Strong (linearizable): every read sees the latest completed write, as if there were one copy",
                "Sequential: every node sees operations in the same order, though not necessarily in real-time order",
                "Causal: operations that depend on each other are seen in that order by everyone",
                "Read-your-writes: a client always sees its own earlier writes",
                "Eventual: replicas converge once writes stop; no ordering promise in the meantime",
              ],
            },
            {
              t: "Quorum systems (N, R, W)",
              d: "With N replicas, a write waits for W acknowledgements and a read queries R replicas. When R + W > N the two sets overlap, so a read normally reaches a replica with the latest acknowledged write. Tune R and W to trade read latency, write latency and durability.",
            },
          ],
        },
        {
          title: "Fault Tolerance",
          summary:
            "At scale something is always broken: a disk, a node, a network link, a whole zone. Fault tolerance is how a system detects failures, keeps serving through them and recovers without losing data.\n\nIt also covers the patterns that stop one failing dependency from dragging down everything that calls it.",
          items: [
            {
              t: "Replication strategies",
              d: "How copies of the data are kept in sync.",
              sub: [
                "Leader-follower: one node takes writes and ships them to followers; simple, but the leader is a bottleneck and failover is delicate",
                "Multi-leader: several nodes accept writes, often one per region; needs conflict resolution",
                "Leaderless: clients write to several replicas directly (Dynamo, Cassandra); relies on quorums and read repair",
              ],
            },
            {
              t: "Failure detection",
              d: "Deciding a node is down when you can never be certain.",
              sub: [
                "Heartbeats: periodic liveness messages with a timeout; the timeout trades detection speed against false alarms",
                "Gossip protocols: nodes exchange membership and health with random peers, so the cluster converges without a coordinator",
              ],
            },
            {
              t: "Recovery mechanisms",
              d: "Getting back to a correct state after a crash.",
              sub: [
                "Write-ahead log (WAL): write the change durably to a log before applying it, then replay the log on restart",
                "Checkpointing: take periodic snapshots so recovery only replays the log written since the last one",
              ],
            },
            {
              t: "Resilience patterns",
              d: "Keep one failing dependency from cascading.",
              sub: [
                "Circuit breaker: after repeated failures, fail fast for a while instead of queueing more doomed calls",
                "Retry with exponential backoff and jitter: retry transient errors without synchronised retry storms",
                "Bulkhead: give each dependency its own pool of threads or connections, so one slow service can't exhaust them all",
              ],
            },
          ],
        },
      ],
      mentalModels: [
        "Think in trade-offs, not absolutes.",
        "Always ask: what happens when this component fails?",
        "Know your failure domains and the blast radius of each one.",
      ],
      exercises: [
        {
          title: "Analyse 5 production systems",
          d: "Read engineering blog posts from Netflix, Uber, Airbnb, Discord and Slack. For each one:",
          steps: [
            "Draw the high-level architecture",
            "Identify the key trade-offs they made",
            "Write a one-page critique: what would you do differently?",
          ],
        },
        {
          title: "Design a URL shortener",
          d: "An architecture doc, not code. Teaches hashing, storage and caching.",
          steps: [
            "Estimate reads, writes and storage per year",
            "Choose how short codes are generated (hash, counter or pre-generated ids) and handle collisions",
            "Design the redirect hot path: store, cache and expected hit rate",
            "List the failure modes and what the user sees in each",
          ],
        },
        {
          title: "Design a rate limiter",
          d: "Teaches algorithms, distributed state and sliding windows.",
          steps: [
            "Compare token bucket, fixed window and sliding window",
            "Decide where the counters live and how nodes share them",
            "Decide what happens when the counter store is down: fail open or fail closed?",
          ],
        },
        {
          title: "Design a chat system",
          d: "Teaches WebSockets, message queues and presence tracking.",
          steps: [
            "Design connection handling and fan-out for 1:1 and group chats",
            "Choose message ordering and delivery guarantees",
            "Design presence (online and last seen) and its consistency model",
          ],
        },
      ],
      resources: [
        {
          kind: "book",
          title: "Designing Data-Intensive Applications (Martin Kleppmann)",
          url: "https://dataintensive.net/",
          note: "Read the whole book deeply (chapters 1–12 in the 1st edition, 1–14 in the 2nd)",
        },
        {
          kind: "course",
          title: "System Design Deep Dive: Real-World Distributed Systems (Educative)",
          url: "https://www.educative.io/courses/system-design-deep-dive-real-world-distributed-systems",
        },
        {
          kind: "course",
          title: "Grokking the System Design Interview, Volume II (DesignGurus)",
          url: "https://www.designgurus.io/course/grokking-system-design-interview-ii",
          note: "Focus on the distributed systems modules",
        },
        {
          kind: "practice",
          title: "The System Design Primer",
          url: "https://github.com/donnemartin/system-design-primer",
          free: true,
          note: "Distributed systems case studies",
        },
      ],
    },
    {
      id: "1.2",
      title: "Distributed Systems Deep Dive",
      summary:
        "Module 1.1 named the building blocks. This one opens them up: how data is split across machines, how replicas stay in agreement, how several nodes commit or coordinate as one, and how a system orders events when no two clocks agree.\n\nThese mechanisms sit underneath every database, queue and vector store you will choose later. You will rarely implement them, but you need to know what each one guarantees, what it costs and how it fails, so you can read a vendor's consistency claims critically.",
      topics: [
        {
          title: "Partitioning (Sharding)",
          summary:
            "Partitioning splits a dataset so that each node stores and serves only part of it. The partition key decides almost everything else: which queries stay on one shard, which fan out to all of them, and where hot spots form.\n\nThe hard parts are not the initial split but skewed load, secondary indexes and moving data when the cluster grows.",
          items: [
            {
              t: "Range-based sharding",
              d: "Each shard owns a contiguous range of keys, as in Bigtable and HBase. Range scans are cheap, but monotonically increasing keys such as timestamps send every new write to the last shard.",
              sub: [
                "Hot-spot fixes: prefix the key with a hash or another dimension, so sequential writes spread across ranges",
                "Dynamic splitting: a range splits in two when it grows too large and the halves can move to other nodes, so the layout follows the data",
              ],
            },
            {
              t: "Hash-based sharding",
              d: "Shard by a hash of the key. Keys and load spread evenly, but key order is lost, so a range query has to ask every shard.",
              sub: [
                "Hash mod N: simple, but changing N moves almost every key; avoid it for anything that has to grow",
                "Fixed partition count: create many more partitions than nodes up front and move whole partitions when nodes join or leave",
              ],
            },
            {
              t: "Consistent hashing",
              d: "Place nodes and keys on the same hash ring; each key belongs to the next node clockwise. Adding or removing a node moves only the keys next to it, which is why Dynamo and Cassandra use it.",
              sub: [
                "Virtual nodes: each physical node owns many small slices of the ring, which evens out load and lets a new node take a little from every existing node",
                "Rebalancing: move data in the background and throttle it, because a rebalance competes with live traffic and can tip an overloaded cluster into more failures",
              ],
            },
            {
              t: "Directory-based sharding",
              d: "A lookup service maps each key or tenant to its shard. Any placement is possible, including moving one large tenant on its own, but the directory is now on every request path and must be replicated and cached.",
            },
            {
              t: "Secondary indexes",
              d: "Indexing a field other than the partition key forces a choice between cheap writes and cheap reads.",
              sub: [
                "Local (document-partitioned): each shard indexes only its own rows; a write touches one shard, but a query by the indexed field has to ask every shard",
                "Global (term-partitioned): the index is partitioned by the indexed value; a read goes to one shard, but a write may touch several, so global indexes are often updated asynchronously (DynamoDB's global secondary indexes are only eventually consistent)",
              ],
            },
          ],
        },
        {
          title: "Replication",
          summary:
            "Replication keeps copies of the same data on several nodes for durability, availability and read capacity. The design questions are when a write counts as done, who may accept writes, and what happens when two replicas disagree.\n\nEvery answer trades latency, durability and how stale a read is allowed to be.",
          items: [
            {
              t: "Synchronous vs asynchronous",
              d: "Synchronous replication waits for followers before acknowledging a write: no data loss on failover, but one slow follower stalls every write. Asynchronous replication acknowledges at once: fast, but a failover can lose writes the client was told had succeeded.",
              sub: [
                "Semi-synchronous: one follower is synchronous and the rest are asynchronous, so at least two nodes hold every acknowledged write",
              ],
            },
            {
              t: "Consensus: Raft and Paxos",
              d: "Algorithms that let a group of nodes agree on one ordered log of values, and on who the leader is, as long as a majority is up. Learn them at the level of guarantees and failure behaviour, not proofs.",
              sub: [
                "Raft: nodes elect a leader for each term by majority vote; the leader appends entries to the followers' logs, and an entry is committed once a majority has stored it",
                "Paxos: the original, proven protocol; Multi-Paxos adds a stable leader so a sequence of values can be agreed efficiently; famously hard to implement correctly",
                "Majority quorums: 2f + 1 nodes tolerate f failures, which is why consensus clusters run 3 or 5 nodes",
                "Where you meet them: etcd uses Raft, ZooKeeper uses a similar protocol called Zab, and Spanner replicates each shard with Paxos",
              ],
            },
            {
              t: "Conflict resolution",
              d: "When several replicas accept writes (multi-leader or leaderless), concurrent updates to the same key have to be detected and merged.",
              sub: [
                "Last-write-wins: keep the value with the highest timestamp; simple, but it silently discards concurrent writes and trusts the clocks",
                "Vector clocks (version vectors): detect that two writes were concurrent, so the application or a merge function can reconcile them; they detect conflicts rather than resolve them",
                "CRDTs: data types (counters, sets, maps, text) whose concurrent updates merge automatically, so replicas converge without coordination",
              ],
            },
            {
              t: "Read scaling",
              d: "Send reads to followers to add read capacity. The cost is replication lag: a follower can be seconds behind, so a user may not see what they just wrote.",
              sub: [
                "Read-your-writes: read a user's own recent changes from the leader, or wait until the replica has caught up to that user's last write",
                "Monotonic reads: pin each user to one replica so they never see data go backwards between requests",
              ],
            },
          ],
        },
        {
          title: "Consensus & Coordination",
          summary:
            "Some operations must happen on several nodes as one: a transfer that debits one shard and credits another, or electing exactly one leader. Distributed transactions give atomicity across nodes at the cost of blocking and latency; sagas give up isolation to stay available.\n\nCoordination services package consensus so that most systems never have to implement it themselves.",
          items: [
            {
              t: "Two-phase commit (2PC)",
              d: "A coordinator asks every participant to prepare, then tells them all to commit only if every one voted yes. It is atomic but blocking: if the coordinator dies after the votes, participants hold their locks until it comes back.",
            },
            {
              t: "Three-phase commit (3PC)",
              d: "Adds a pre-commit round so participants can finish without the coordinator. It is only safe if network delays are bounded, an assumption real networks break, so it is rarely used in practice.",
            },
            {
              t: "Saga pattern",
              d: "Split a long business transaction into local transactions, each with a compensating action that undoes it if a later step fails. Sagas avoid distributed locks but give up isolation: other requests can see the half-finished state.",
              sub: [
                "Orchestration: a central coordinator tells each service what to do next; easier to follow and debug",
                "Choreography: each service reacts to the previous step's event; looser coupling, but the overall flow is harder to see",
                "Compensating transactions: a semantic undo such as a refund or a cancelled booking, not a rollback; they must be idempotent and safe to retry",
              ],
            },
            {
              t: "Coordination services",
              d: "ZooKeeper and etcd are small, consensus-backed stores for the critical metadata that many nodes must agree on. Use them for coordination, not as a general-purpose database.",
              sub: [
                "Leader election: the node that holds an ephemeral key (ZooKeeper) or a lease (etcd) is the leader; when its session or lease expires, another node takes over",
                "Configuration and service discovery: clients watch keys and react when they change",
                "Distributed locks: pair a lease with a fencing token that the storage checks, because a paused process can still believe it holds a lock that has already expired",
              ],
            },
          ],
        },
        {
          title: "Time & Ordering",
          summary:
            "Machines disagree about the time, and messages arrive late or out of order, so \"which happened first?\" has no free answer. Logical clocks capture cause and effect without trusting wall clocks; physical clocks with a known error bound can order events globally if you are willing to wait out the uncertainty.\n\nMany distributed bugs are ordering bugs in disguise, so learn exactly which guarantee each technique gives.",
          items: [
            {
              t: "Lamport timestamps",
              d: "Each node keeps a counter, increments it on every event, attaches it to outgoing messages and jumps ahead when it receives a higher value. The result is a total order consistent with causality, but it cannot tell you whether two events were concurrent.",
            },
            {
              t: "Vector clocks",
              d: "Each node keeps one counter per node. Comparing two vectors shows whether one event happened before the other or whether they were concurrent, at the cost of metadata that grows with the number of nodes.",
            },
            {
              t: "NTP and clock skew",
              d: "NTP keeps clocks within tens of milliseconds over the internet and can do better than a millisecond on a good local network, but clocks still drift and can jump backwards when corrected. Measure durations with a monotonic clock, and never order events across machines by wall-clock time.",
            },
            {
              t: "TrueTime (Spanner)",
              d: "Google's clock API returns an interval guaranteed to contain the true time, backed by GPS receivers and atomic clocks. Spanner waits out that uncertainty before a commit becomes visible (commit wait), so transaction timestamps match real-time order across the globe.",
            },
            {
              t: "Event ordering in practice",
              d: "A total order is expensive, so real systems order only what needs it.",
              sub: [
                "Per-partition order: a log such as Kafka orders events within a partition, not across partitions; give related events the same key so they land in the same partition",
                "Hybrid logical clocks: combine a physical timestamp with a logical counter, so timestamps stay close to wall time but still respect causality (used by CockroachDB)",
                "Total order broadcast: delivering the same messages in the same order to every node is equivalent to consensus, so it costs as much",
              ],
            },
          ],
        },
      ],
      mentalModels: [
        "Assume replicated data is eventually consistent unless you made it strong on purpose.",
        "The network is unreliable: assume partitions, lost messages and arbitrary delays.",
        "Clocks are unreliable: never use wall-clock time to order events across machines.",
      ],
      exercises: [
        {
          title: "Read five foundational papers",
          d: "The Google File System (2003), Bigtable (2006), Amazon's Dynamo (2007), Kafka: a Distributed Messaging System for Log Processing (2011) and Spanner (2012). Read the abstract, introduction and conclusion closely; skim the rest. For each:",
          steps: [
            "Write down the problem it solved and the workload it was built for",
            "Identify its central design decision and what it gave up to get it",
            "Map it to this module: how it partitions, replicates and orders data",
            "Note which of its ideas you can still see in systems you use today",
          ],
        },
        {
          title: "Architecture critique: design Twitter",
          d: "Write a three-page design doc for a well-known system; Twitter's home timeline is the classic choice.",
          steps: [
            "Define the data model: users, tweets, follows and timelines",
            "Design the API for posting, following and reading a timeline",
            "Choose a scaling strategy, including fan-out on write vs fan-out on read and how you shard",
            "List the failure modes and what users see in each",
            "Compare your design with published solutions and explain each difference",
          ],
        },
      ],
      resources: [
        {
          kind: "book",
          title: "Designing Data-Intensive Applications (Martin Kleppmann)",
          url: "https://dataintensive.net/",
          note: "Chapters 5–9 in the 1st edition (6–10 in the 2nd): replication, partitioning, transactions, faults, consensus",
        },
        {
          kind: "article",
          title: "Patterns of Distributed Systems (Unmesh Joshi)",
          url: "https://martinfowler.com/articles/patterns-of-distributed-systems/",
          free: true,
          note: "Catalogue: replicated log, leases, quorums, Lamport and hybrid clocks, 2PC",
        },
        {
          kind: "paper",
          title: "The Google File System (2003)",
          url: "https://research.google/pubs/the-google-file-system/",
          free: true,
        },
        {
          kind: "paper",
          title: "Bigtable: A Distributed Storage System for Structured Data (2006)",
          url: "https://research.google/pubs/bigtable-a-distributed-storage-system-for-structured-data/",
          free: true,
        },
        {
          kind: "paper",
          title: "Dynamo: Amazon's Highly Available Key-value Store (2007)",
          url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
          free: true,
        },
        {
          kind: "paper",
          title: "Spanner: Google's Globally-Distributed Database (2012)",
          url: "https://research.google/pubs/spanner-googles-globally-distributed-database-2/",
          free: true,
        },
      ],
    },
  ],
};
