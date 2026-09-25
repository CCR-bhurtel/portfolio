import type { Phase } from "../model";

export const phase3: Phase = {
  n: 3,
  title: "AI/ML System Architecture",
  weeks: "Weeks 17–30",
  summary:
    "This phase moves from general distributed systems to systems built around models: classic ML pipelines (features, training, serving, governance), retrieval-augmented generation, and agents built on LLMs. In each module the model is one component in a larger system with data flows, latency budgets and failure modes.\n\nAn architect is rarely asked to pick the best model. The questions are where the data comes from, how predictions reach users within budget, how quality is measured after launch, and what happens when a model or an agent gets it wrong. This phase builds the vocabulary to answer them.",
  modules: [
    {
      id: "3.1",
      title: "ML System Design Fundamentals",
      summary:
        "How a classic ML system fits together, from raw data to a prediction served in production: features, training pipelines, serving, and the registry that ties versions together.\n\nThe model is usually the smallest part of the system. Most of the risk sits in the data paths around it, so spend your time on where training and serving can disagree, and on how you would notice.",
      topics: [
        {
          title: "Feature Engineering & Feature Stores",
          summary:
            "Features are the inputs a model sees, and many production ML bugs are really feature bugs. A feature store keeps one definition of each feature and serves it twice: in bulk from an offline store for training, and by key from an online store at prediction time.\n\nThe central trade-off is freshness against cost and complexity: streaming features are fresher, batch features are simpler and cheaper to run.",
          items: [
            {
              t: "Feature types",
              d: "The kinds of input a model consumes, each with its own storage and encoding needs.",
              sub: [
                "Numerical: counts, amounts, ratios; usually need scaling or a log transform",
                "Categorical: plans, countries, industries; need encoding before most models can use them",
                "Embeddings: dense vectors produced by another model, for example from text or from a user's history",
                "Sequences: ordered events such as clicks or page views; often summarised into windowed aggregates",
              ],
            },
            {
              t: "Feature transformations",
              d: "Turning raw values into something a model can learn from. The same transformation code must run in training and in serving, or you have built skew into the system.",
              sub: [
                "Normalisation and scaling: min-max, z-score or log, so large-valued features don't dominate distance- or gradient-based models",
                "Encoding: one-hot for low-cardinality categories, target or hashing encoding for high-cardinality ones",
                "Binning (bucketing): turn a continuous value into ranges, such as company-size bands; robust to outliers, but loses detail",
              ],
            },
            {
              t: "Online vs offline stores",
              d: "The offline store holds full history for building training sets; the online store holds the latest value per entity for low-latency lookups.",
              sub: [
                "Online store: key-value lookups in milliseconds; Redis, DynamoDB, Cassandra",
                "Offline store: large historical scans; Snowflake, BigQuery, Delta Lake",
                "Materialisation: the job that copies fresh values from offline to online, and a common source of staleness",
              ],
            },
            {
              t: "Point-in-time correctness",
              d: "When building a training set, join each label only with feature values that existed at that label's timestamp. Otherwise future information leaks into training, and the model looks better offline than it can ever be in production.",
            },
            {
              t: "Training-serving skew",
              d: "Any difference between the features a model trained on and the ones it receives at prediction time: different code paths, different freshness, or missing values handled differently. Serving from the same feature definitions used in training removes the most common causes; monitoring catches the rest.",
            },
            {
              t: "Batch vs streaming pipelines",
              d: "Batch jobs recompute features on a schedule (hourly or daily); streaming jobs update them as events arrive, for example Kafka with Flink or Spark Structured Streaming. Streaming buys freshness at the cost of harder backfills, state management and operations.",
            },
          ],
        },
        {
          title: "Model Training Pipelines",
          summary:
            "A training pipeline turns data, code and configuration into a model artifact you can reproduce. Reproducibility is the architect's concern: if you can't rebuild last month's model, you can't debug it, audit it or roll back to it with confidence.\n\nThe trade-off is rigour against speed. Versioning everything costs time up front and pays it back at the first incident.",
          items: [
            {
              t: "Data versioning",
              d: "Pin the exact dataset each model was trained on, so a result can be reproduced and a regression traced to a data change.",
              sub: [
                "DVC: Git-style versioning for large files and pipelines, with the data itself kept in object storage",
                "Pachyderm: versioned data repositories with pipelines that re-run when their input data changes",
                "Table time travel: Delta Lake and Apache Iceberg snapshots let you read a table as of a past version",
              ],
            },
            {
              t: "Experiment tracking",
              d: "Record parameters, metrics, code version and artifacts for every run, so you can compare runs and know exactly what produced a model. MLflow (open source) and Weights & Biases (hosted) are the common choices.",
            },
            {
              t: "Hyperparameter tuning",
              d: "Searching for the training settings (learning rate, tree depth, regularisation) that give the best validation score.",
              sub: [
                "Grid search: try every combination; exhaustive, but cost grows exponentially with the number of parameters",
                "Random search: sample combinations at random; usually finds good settings faster than grid search when only a few parameters really matter",
                "Bayesian optimisation: model score as a function of the settings and pick the next trial where improvement looks likely; fewer trials, but chosen one after another",
                "Early stopping (Hyperband, ASHA): kill unpromising trials early so compute goes to the good ones",
              ],
            },
            {
              t: "Distributed training",
              d: "Spreading training across devices when the data or the model outgrows one. Most tabular models never need it; large neural networks do.",
              sub: [
                "Data parallelism: each device holds a full copy of the model and trains on a different slice of each batch; gradients are averaged every step",
                "Model parallelism: split the model itself across devices, by layers (pipeline parallelism) or within layers (tensor parallelism), when it doesn't fit in one device's memory",
                "Sharded data parallelism (ZeRO, PyTorch FSDP): shard parameters, gradients and optimiser state across data-parallel workers to cut memory per device",
              ],
            },
          ],
        },
        {
          title: "Model Serving & Inference",
          summary:
            "Serving is how predictions reach the product. Choose the pattern from when the prediction is needed, not from the model: if the answer can be computed before anyone asks, batch is cheaper and simpler than a live API.\n\nDeployment strategies then control the risk of replacing a model, and inference optimisations trade a little accuracy or latency for large gains in cost and throughput.",
          items: [
            {
              t: "Serving patterns",
              d: "When predictions are computed, relative to when they are needed.",
              sub: [
                "Real-time: a synchronous API call per request; freshest inputs, strictest latency and availability requirements",
                "Batch: pre-compute predictions on a schedule and store them for lookup; cheap and simple, but stale, and wasted on entities nobody looks at",
                "Streaming: consume events from a stream and emit predictions continuously; suits fraud detection or alerting, where reaction time matters",
              ],
            },
            {
              t: "Deployment strategies",
              d: "Ways to replace a model in production without betting everything on offline metrics.",
              sub: [
                "Shadow mode: the new model scores live traffic alongside the old one, but only the old model's output is used; catches errors and latency problems with no user impact",
                "Canary: send a small, growing share of traffic to the new model and watch errors and metrics before full rollout",
                "A/B test: split traffic between models long enough to measure a business metric with statistical confidence",
              ],
            },
            {
              t: "Request batching",
              d: "Grouping requests to use the hardware efficiently, trading a little latency for much higher throughput.",
              sub: [
                "Static batching: a fixed batch size; simple, but requests wait for the batch to fill",
                "Dynamic batching: the server groups requests that arrive within a short time window (NVIDIA Triton supports this)",
                "Continuous batching: for LLM generation; new sequences join and finished ones leave the batch at every decoding step (vLLM, SGLang)",
              ],
            },
            {
              t: "Quantisation",
              d: "Store weights, and sometimes activations, at lower precision to cut memory and speed up inference. FP32 to FP16 or BF16 is usually close to lossless; INT8 and below need calibration and an accuracy check on your own evaluation set.",
            },
            {
              t: "Distillation",
              d: "Train a smaller student model to imitate a larger teacher's outputs. You pay a training cost once to get a model that is cheaper and faster to serve, usually with some loss in quality.",
            },
            {
              t: "Prediction caching",
              d: "Cache results for repeated inputs, keyed on the input or a hash of its features. Works well for popular items and deterministic models; needs a TTL or explicit invalidation when the model or its features change.",
            },
          ],
        },
        {
          title: "Model Registry & Governance",
          summary:
            "The registry is the system of record for models: which versions exist, what each was trained on, and which one is live. Without it, \"which model made this decision?\" has no reliable answer.\n\nGovernance adds the approval steps and audit trail that regulated or customer-facing decisions need, and makes rollback a routine operation rather than a scramble.",
          items: [
            {
              t: "Model versioning",
              d: "Every trained artifact gets an immutable version. Applications load a named pointer (an alias such as 'champion', or a stage), so promoting or rolling back is a registry change, not a code deploy. Some teams add semantic versioning to signal breaking changes to inputs or outputs.",
            },
            {
              t: "Metadata and lineage",
              d: "Store with each version its training data version, code commit, hyperparameters, evaluation metrics and owner. This lineage is what makes audits, debugging and reproduction possible.",
            },
            {
              t: "Approval workflows",
              d: "Promotion gates between environments, such as staging to production: automated checks (metric thresholds, bias and load tests), then a human sign-off where the stakes justify it.",
            },
            {
              t: "Rollback strategies",
              d: "Keep the previous version deployable and its features still available, so rollback means repointing an alias or shifting traffic back. Rollback fails when the old model depends on features or schemas that have since changed.",
            },
          ],
        },
      ],
      mentalModels: [
        "Some training-serving skew is inevitable: monitor for it constantly.",
        "Models decay as the world drifts: plan for monitoring, retraining and replacement from day one.",
        "Business metrics beat ML metrics: optimise for revenue and retention, not just accuracy.",
      ],
      exercises: [
        {
          title: "Design a lead scoring system for a CRM",
          d: "An architecture doc for scoring how likely each lead is to convert.",
          steps: [
            "List candidate features from contact demographics, engagement history, company info and deal attributes; mark each as batch or streaming, and note where point-in-time joins matter",
            "Lay out the architecture: feature store (Feast) → training (XGBoost) → model server (BentoML, NVIDIA Triton or a FastAPI service) → A/B test",
            "Decide whether scores must update in real time on each new activity or can be batch-computed nightly, and justify it",
            "Write the monitoring plan: feature drift, score distribution, and conversion rate by score band",
            "Set a retraining cadence and the triggers that would force an early retrain",
          ],
        },
        {
          title: "Model failure post-mortem",
          d: "Learn how ML systems fail in practice.",
          steps: [
            "Find three real post-mortems or incident write-ups of ML failures, such as model drift or a broken data pipeline",
            "For each, write up the root cause, time to detection, how the team recovered, and what would have prevented it",
            "Note which failures ordinary service monitoring would have missed, and what ML-specific monitoring would have caught them",
          ],
        },
      ],
      resources: [
        {
          kind: "book",
          title: "Designing Machine Learning Systems (Chip Huyen)",
          url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/",
          note: "The core text for this module",
        },
        {
          kind: "course",
          title: "Architecting and Integrating Scalable AI Systems (Coursera)",
          url: "https://www.coursera.org/learn/architecting-and-integrating-scalable-ai-systems",
          note: "Requirements, system modelling, cloud deployment and integration",
        },
        {
          kind: "course",
          title: "ML System Design course (Exponent)",
          url: "https://www.tryexponent.com/courses/ml-system-design",
          note: "Interview-style framework and worked designs; paid membership. Exponent now trades as Aced",
        },
        {
          kind: "article",
          title: "Rules of Machine Learning (Google)",
          url: "https://developers.google.com/machine-learning/guides/rules-of-ml",
          free: true,
          note: "Martin Zinkevich's practical rules, including a section on training-serving skew",
        },
        {
          kind: "paper",
          title: "Hidden Technical Debt in Machine Learning Systems (Sculley et al., NeurIPS 2015)",
          url: "https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html",
          free: true,
        },
        {
          kind: "docs",
          title: "Feast documentation",
          url: "https://docs.feast.dev/",
          free: true,
          note: "The feature store in the lead-scoring exercise; read the point-in-time join docs",
        },
      ],
    },
    {
      id: "3.2",
      title: "RAG Architecture Deep Dive",
      summary:
        "Retrieval-augmented generation (RAG) answers questions from your own documents by retrieving relevant passages and putting them in the model's prompt. The architecture is a pipeline: parse and chunk documents, embed and index them, retrieve and re-rank candidates, then assemble the context.\n\nMost RAG quality problems are retrieval problems, not model problems. Each stage trades latency and cost for recall or precision, and the only reliable way to tune them is against an evaluation set built from real queries.",
      topics: [
        {
          title: "Chunking Strategies",
          summary:
            "Chunking decides the unit of retrieval. Chunks that are too small lose the context needed to answer; chunks that are too large dilute the embedding and waste prompt tokens.\n\nChunking is fixed at ingest time, so changing it later means re-processing and re-embedding the corpus. Choose it per document type rather than one size for everything.",
          items: [
            {
              t: "Fixed-size chunking",
              d: "Split every N characters or tokens, usually with some overlap between chunks. Simple and predictable, but blind to meaning.",
              sub: [
                "Character splitter: fastest, but can cut a sentence or a table in half",
                "Token splitter: sizes chunks in the embedding model's tokens so they fit its input limit exactly; slightly slower because the text must be tokenised",
              ],
            },
            {
              t: "Semantic chunking",
              d: "Split where the meaning changes, aiming for one idea per chunk.",
              sub: [
                "Boundary-aware (recursive) splitting: split on paragraphs first, then sentences, only as far as needed to fit the size limit",
                "Embedding-based splitting: embed consecutive sentences and start a new chunk where their similarity drops; better boundaries, higher ingest cost",
              ],
            },
            {
              t: "Hierarchical chunking",
              d: "For nested documents (headings, then paragraphs, then sentences), store parent-child links between chunks. Retrieve the small, precise child, then pass its larger parent to the model for context; the cost is a bigger index.",
            },
            {
              t: "Structure-aware chunking",
              d: "Use the document's own structure: split on headings, tables, code blocks and list boundaries. Never split mid-table or mid-code-block, and carry the section heading into each chunk so it keeps its context.",
            },
          ],
        },
        {
          title: "Embedding & Vector Search",
          summary:
            "Embeddings turn text into vectors so that similar meanings land close together, and a vector index finds the nearest vectors without comparing against every one. Approximate nearest-neighbour (ANN) indexes give up a little recall for large gains in speed.\n\nThe index type and its parameters set the recall, latency and memory cost of every query, so tune them against your own queries rather than trusting defaults.",
          items: [
            {
              t: "Dense embeddings",
              d: "A neural model maps text to a fixed-length vector, and similar meaning gives nearby vectors. Strong on paraphrase and intent, weak on exact identifiers, codes and rare terms.",
            },
            {
              t: "Sparse retrieval",
              d: "Vectors with one dimension per vocabulary term, most of them zero. BM25 is the classic lexical scoring function; learned sparse models such as SPLADE add term expansion. Strong on exact matches, blind to synonyms, which is why it is often combined with dense search (hybrid retrieval).",
            },
            {
              t: "HNSW index",
              d: "Hierarchical navigable small world: a layered graph of vectors, searched greedily from coarse layers down to fine ones. High recall at low latency, but memory-hungry, because the full vectors and the graph links normally sit in RAM.",
            },
            {
              t: "IVF and PQ",
              d: "Index families that trade some recall for lower memory and build cost.",
              sub: [
                "IVF (inverted file index): cluster the vectors and search only the nprobe nearest clusters; cheaper to build and lighter than HNSW, with recall set by nprobe",
                "PQ (product quantisation): compress each vector into a short code; large memory savings at some cost in accuracy; often combined with IVF as IVF-PQ",
              ],
            },
            {
              t: "HNSW tuning parameters",
              d: "The knobs that set the HNSW trade-off.",
              sub: [
                "M: links per node; higher improves recall and increases memory",
                "ef_construction: candidate list size while building; higher gives a better graph at the cost of build time",
                "ef_search: candidate list size per query; higher raises recall and latency, and can be changed without rebuilding",
              ],
            },
          ],
        },
        {
          title: "Retrieval Strategies",
          summary:
            "Retrieval is a funnel. The first stage must be cheap and wide so the right passage is somewhere among the candidates (recall); later stages are expensive and narrow so only the best reach the prompt (precision).\n\nThe design question is how many stages fit in the latency budget, and how many candidates each stage passes on.",
          items: [
            {
              t: "Single-stage retrieval",
              d: "Top-k vector search, straight into the prompt. Fast and simple, but it can miss exact matches such as product codes or names, and whatever ranks in the top k goes in, relevant or not.",
            },
            {
              t: "Hybrid retrieval",
              d: "Query a lexical index (BM25) and a vector index in parallel, then merge the results. Recovers the exact-match queries that dense search misses, at roughly twice the first-stage work.",
            },
            {
              t: "Reciprocal Rank Fusion",
              d: "Merge ranked lists by position rather than raw score: each document scores the sum of 1/(k + rank) across the lists, with k commonly set to 60. It needs no score calibration, which matters because BM25 and cosine scores aren't comparable.",
            },
            {
              t: "Multi-stage retrieval",
              d: "Chain stages that get slower and more accurate as the candidate set shrinks.",
              sub: [
                "Stage 1: retrieve around 50 candidates with fast vector or hybrid search",
                "Stage 2: re-rank those candidates with a cross-encoder",
                "Stage 3: pass the top 5 or so to the LLM",
              ],
            },
          ],
        },
        {
          title: "Re-ranking",
          summary:
            "A re-ranker takes the candidates from first-stage retrieval and scores each one against the query with a heavier model. It often gives a sizeable precision gain, and it lets you send fewer, better passages to the LLM.\n\nThe cost is latency that grows with the number of candidates, so the re-ranker's input size is a budget decision.",
          items: [
            {
              t: "Cross-encoders",
              d: "Encode the query and a passage together in one model pass, so the model sees how they interact. More accurate than comparing precomputed embeddings, but nothing can be precomputed, so cost scales with the candidate count. A typical use is re-ranking 25 to 50 candidates down to 5.",
            },
            {
              t: "LLM-based re-ranking",
              d: "Ask an LLM to score or order the candidates. Slower and costlier than a cross-encoder, but it can reason about relevance and follow instructions such as 'prefer the newest policy'.",
            },
            {
              t: "Latency budget",
              d: "Re-ranking cost depends on model size, hardware, passage length and candidate count. A cross-encoder over a few dozen passages commonly adds tens to a few hundred milliseconds, and LLM re-ranking can add seconds, so measure it per stage against a set budget.",
            },
            {
              t: "Precision gain",
              d: "The gain depends on the corpus and on how good the first stage already is, so measure it on your own evaluation set. One public data point: in Anthropic's contextual retrieval experiments, adding a re-ranker cut the top-20 retrieval failure rate from 2.9% to 1.9%.",
            },
          ],
        },
        {
          title: "Context Optimisation",
          summary:
            "What reaches the prompt matters as much as what is retrieved. Filtering, de-duplication and compression keep the context small, relevant and within access rules, which lowers cost and gives the model less to be distracted by.\n\nFiltering is also a security control: in a multi-tenant system, a filter on tenant and permissions is what stops one customer's documents from appearing in another customer's answer.",
          items: [
            {
              t: "Metadata filtering",
              d: "Restrict the search by tenant, document type, date range or access control, shrinking the candidate pool before similarity ranking.",
              sub: [
                "Pre-filtering: apply the filter inside the index search; returns a full k results, but some ANN indexes lose speed or recall with very selective filters",
                "Post-filtering: search first, then drop non-matching results; simple, but can leave you with fewer than k results",
              ],
            },
            {
              t: "Deduplication",
              d: "Remove near-duplicate chunks (overlapping windows, copied boilerplate, several versions of the same document) so the prompt doesn't spend tokens on the same fact twice.",
            },
            {
              t: "Maximal Marginal Relevance",
              d: "Select results one at a time, scoring each by its relevance to the query minus its similarity to what is already selected. A weight (lambda) trades relevance against diversity.",
            },
            {
              t: "Context compression",
              d: "Shrink retrieved text before generation: keep only the sentences relevant to the query, or have an LLM summarise the chunks. Saves prompt tokens, but adds a step and can drop the detail the answer needed.",
            },
          ],
        },
      ],
      mentalModels: [
        "Chunking determines retrieval quality: one idea per chunk, with enough context to stand on its own.",
        "Retrieval is a funnel: a wide top for recall, a narrow bottom for precision.",
        "Re-ranking is usually worth its cost: spend milliseconds to save prompt tokens and get better answers.",
      ],
      exercises: [
        {
          title: "Design a RAG system for a travel knowledge base",
          d: "Documents: destination guides, hotel descriptions, activity listings and FAQs.",
          steps: [
            "Choose a chunking strategy per document type (for example hierarchical for long guides, one chunk per FAQ entry) and justify each",
            "Lay out the pipeline: document parsing → chunking → embedding → vector DB → hybrid retrieval → re-ranking → LLM",
            "Decide which metadata to store for filtering, such as destination, season, price band and language",
            "Write a latency budget per stage that adds up to your end-to-end target",
          ],
        },
        {
          title: "RAG evaluation exercise",
          d: "Measure before you tune.",
          steps: [
            "Build a small RAG system with LangChain or LlamaIndex",
            "Write 20 test queries with expected answers and the passages that support them",
            "Measure retrieval recall, re-ranking precision and answer faithfulness with RAGAS metrics (context recall, context precision, faithfulness)",
            "Change one thing at a time (chunking strategy, embedding model, re-ranker) and record its effect on each metric",
          ],
        },
      ],
      resources: [
        {
          kind: "practice",
          title: "Advanced RAG Techniques (Google Codelabs)",
          url: "https://codelabs.developers.google.com/codelabs/production-ready-ai-with-gc/8-advanced-rag-methods/advanced-rag-methods",
          free: true,
          note: "Chunking, re-ranking and query transformation on Cloud SQL and Vertex AI",
        },
        {
          kind: "docs",
          title: "Optimize RAG retrieval pipelines for latency and precision (AWS Well-Architected)",
          url: "https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentperf03-bp03.html",
          free: true,
          note: "Agentic AI Lens best practice AGENTPERF03-BP03",
        },
        {
          kind: "article",
          title: "Introducing Contextual Retrieval (Anthropic)",
          url: "https://www.anthropic.com/engineering/contextual-retrieval",
          free: true,
          note: "Embeddings plus BM25 plus re-ranking, with measured results",
        },
        {
          kind: "course",
          title: "Retrieval Augmented Generation (DeepLearning.AI)",
          url: "https://www.deeplearning.ai/courses/retrieval-augmented-generation",
          note: "Zain Hasan's course on building, evaluating and running RAG in production; first module free",
        },
        {
          kind: "docs",
          title: "Ragas metrics",
          url: "https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/",
          free: true,
          note: "Context precision, context recall and faithfulness, for the evaluation exercise",
        },
        {
          kind: "article",
          title: "Hierarchical Navigable Small Worlds (Pinecone)",
          url: "https://www.pinecone.io/learn/series/faiss/hnsw/",
          free: true,
          note: "How HNSW works, and how M, efConstruction and efSearch trade recall, speed and memory",
        },
      ],
    },
    {
      id: "3.3",
      title: "Agentic AI Architecture Patterns",
      summary:
        "An agent is an LLM that chooses its own next step: it reasons, calls tools, observes the results and continues until the goal is met. This module covers how a single agent reasons, remembers and uses tools; how several agents coordinate; and the controls that keep them safe and reliable.\n\nThe central trade-off is autonomy against predictability. Each extra degree of freedom handles more open-ended tasks and adds cost, latency and new ways to fail, so give a system the least agency that does the job.",
      topics: [
        {
          title: "Single-Agent Reasoning",
          summary:
            "How a single agent decides what to do next. The options range from one prompt and one response to exploring many candidate lines of reasoning, and each step up buys capability with more model calls.\n\nBefore choosing, ask whether the task needs an agent at all: a fixed workflow of LLM calls is cheaper, faster and easier to test when the steps are known in advance.",
          items: [
            {
              t: "Workflows vs agents",
              d: "In a workflow, code defines the path and LLMs fill in the steps; in an agent, the LLM chooses the path at run time. Start with the simplest option and add agency only when a fixed path can't handle the task.",
            },
            {
              t: "Reactive prompting",
              d: "One prompt in, one response out, with no planning or tool loop. Cheapest and most predictable; enough for classification, extraction and drafting.",
            },
            {
              t: "Plan-then-act",
              d: "Generate a full plan first, then execute its steps in order. Easy to inspect and approve up front, but brittle when an early result should change the plan, so add a re-planning step.",
            },
            {
              t: "ReAct loop",
              d: "Interleave reasoning and acting: think, call a tool, observe the result, repeat. It adapts to what it finds, but every turn is another model call, so the loop needs a step limit.",
            },
            {
              t: "Search over thoughts",
              d: "Generate several candidate reasoning paths and evaluate them, as in Tree of Thoughts or Graph of Thoughts. Helps on problems that need lookahead or backtracking, at many times the cost of a single pass.",
            },
          ],
        },
        {
          title: "Memory Architectures",
          summary:
            "An LLM keeps nothing between calls, so any memory an agent has is something the system stores and puts back into the context. Memory design decides what is kept, where, for how long, and how it is found again.\n\nThe trade-off is continuity against cost, privacy and staleness: remembering more helps personalisation, but every stored fact must be retrieved correctly, kept current and be deletable.",
          items: [
            {
              t: "Working memory",
              d: "The current context window: the conversation, tool results and intermediate reasoning for the task at hand. Limited in size, so long tasks need summarising or trimming.",
            },
            {
              t: "Episodic memory",
              d: "Records of past interactions and their outcomes, such as how a similar request was resolved last time. Lets an agent carry experience across sessions.",
            },
            {
              t: "Semantic memory",
              d: "Durable facts and knowledge: user preferences, domain facts, profiles of customers or products. Needs rules for updating and resolving conflicts when a fact changes.",
            },
            {
              t: "Procedural memory",
              d: "Knowing how: instructions, tool-use recipes and learned skills. Usually lives in the system prompt, code or a skill library rather than a database.",
            },
            {
              t: "Retrieval-based memory",
              d: "Store memories as embeddings and retrieve the relevant ones on each turn: RAG applied to memory, called the Retriever pattern in the system-theoretic patterns paper. It is a mechanism for episodic or semantic memory, with the same chunking, ranking and staleness problems as any RAG system.",
            },
          ],
        },
        {
          title: "Tool-Using Agents",
          summary:
            "Tools are how an agent acts on the world: search, databases, APIs, code execution. The model emits a structured call, the system executes it and returns the result.\n\nTools are also where the risk is, because a wrong call can change real data or spend real money. Design tool interfaces like public APIs: narrow, typed, validated and permissioned.",
          items: [
            {
              t: "Function calling",
              d: "The model returns a structured call (a tool name plus JSON arguments matching a schema) instead of free text, and your code validates and runs it. Clear names, descriptions and schemas matter as much as the prompt; the Model Context Protocol (MCP) standardises how tools are exposed to agents.",
            },
            {
              t: "Tool selection",
              d: "Choosing which tool fits the user's intent. Accuracy tends to drop as the tool list grows and descriptions overlap, so keep each agent's tool set small or route to a subset first.",
            },
            {
              t: "Tool chaining",
              d: "Feeding one tool's output into the next call: search flights, then check the fare rules, then hold a seat. Every hop can fail, so validate intermediate results.",
            },
            {
              t: "Error handling",
              d: "What happens when a tool call fails or returns nonsense.",
              sub: [
                "Retry: for transient errors, with backoff and a limit",
                "Fallback: an alternative tool, a cached answer or a simpler path",
                "Ask a human: escalate when the agent is stuck or the action is risky",
                "Idempotency: make side-effecting tools safe to retry, for example with an idempotency key, so a retry doesn't book twice",
              ],
            },
          ],
        },
        {
          title: "Multi-Agent Coordination",
          summary:
            "Multi-agent systems split work across agents that each have their own prompt, tools and context. The split helps when a task has separable parts or needs more context than one agent can hold; it hurts when agents must share a lot of state, because coordination overhead and failure modes multiply.\n\nThe core choice is the topology: a central supervisor, or peers that talk to each other directly.",
          items: [
            {
              t: "Centralised supervisor-worker",
              d: "A supervisor agent breaks down the task, delegates to workers and combines the results. Easy to trace and control, but the supervisor is a bottleneck and a single point of failure.",
              sub: [
                "Supervisor: plans, delegates and decides when the task is done",
                "Workers: execute specialised subtasks and report back",
                "Use case: complex workflows that need orchestration, such as research, then drafting, then review",
              ],
            },
            {
              t: "Decentralised peer-to-peer",
              d: "Agents hand off to each other or communicate directly through a protocol such as Agent2Agent (A2A), with no central coordinator. No single point of failure and more flexible, but harder to trace, and loops and termination become your problem.",
              sub: [
                "Use case: collaborative problem-solving where the next expert depends on what the last one found",
              ],
            },
            {
              t: "Specialist agents",
              d: "Domain-specific agents (researcher, writer, coder, reviewer), each with its own prompt, tools and knowledge. Narrow roles make each agent easier to prompt, test and permission.",
            },
            {
              t: "Message passing vs shared state",
              d: "Agents coordinate by sending messages (explicit and easy to log, but context must be copied) or by reading and writing shared state such as a blackboard or graph state (less copying, but needs rules for concurrent writes).",
            },
            {
              t: "Multi-agent debate",
              d: "Several agents propose answers, critique each other over a few rounds and converge on one. It can improve reasoning and factual accuracy, at several times the cost, and agents can also converge on a shared mistake.",
            },
          ],
        },
        {
          title: "Oversight & Control Patterns",
          summary:
            "Patterns that keep agents within safe limits and let them survive long tasks: validating what comes in, checkpointing state, limiting what agents may do, and bringing in a human where judgement or authority is needed.\n\nAn architecture review will ask about these first, because they bound the blast radius when the model gets something wrong.",
          items: [
            {
              t: "Human-in-the-loop",
              d: "The agent pauses for approval at defined checkpoints, typically before irreversible or costly actions such as payments, emails or deletions. Put checkpoints where the risk is, not everywhere, or reviewers start rubber-stamping.",
            },
            {
              t: "Agent-to-human handoff",
              d: "Escalate the whole case to a person when confidence is low, the request is out of scope or policy requires it. Pass the full context along so the human doesn't start from zero.",
            },
            {
              t: "Integrator pattern",
              d: "Validate incoming information (tool results, retrieved documents, other agents' messages) before it enters the agent's state. The system-theoretic patterns paper names this the Integrator; in practice it is also where you check tool output for injected instructions.",
            },
            {
              t: "Long-running workflows",
              d: "Tasks that run for minutes or days need durable state: checkpoint after each step, so a crash or a wait for approval resumes where it left off instead of starting over. Durable execution engines such as Temporal, or framework checkpointers such as LangGraph's, provide this.",
            },
            {
              t: "Scoping and guardrails",
              d: "Limit what an agent can do, so a mistake stays small.",
              sub: [
                "Least privilege: only the tools and data scopes the task needs, using the end user's permissions rather than a shared admin key",
                "Budgets: caps on steps, tokens, time and spend per task",
                "Termination conditions: explicit criteria for done, plus a hard stop for loops",
                "Sandboxing: run generated code and risky actions in an isolated environment",
              ],
            },
          ],
        },
        {
          title: "Agentic System Taxonomy",
          summary:
            "A way to classify any agentic system along a few axes, useful for comparing frameworks and for describing your own design precisely.\n\nThe axes are independent: a single agent can plan or search, and a multi-agent system can be built from purely reactive agents.",
          items: [
            {
              t: "Architectural paradigm",
              d: "Symbolic systems (rules, classical planners, explicit state) are predictable and auditable; neural systems (LLM-driven) are flexible but stochastic. The Abou Ali and Dornaika survey finds symbolic systems dominate safety-critical domains and argues for hybrids.",
            },
            {
              t: "Degree of agency",
              d: "Single-agent or multi-agent. More agents give separation of concerns and parallelism, at the cost of coordination overhead and more failure modes.",
            },
            {
              t: "Coordination mechanism",
              d: "Centralised (a supervisor decides) or decentralised (peers negotiate or hand off). The same trade-off as any distributed system: control and traceability against resilience and flexibility.",
            },
            {
              t: "Reasoning mode",
              d: "Reactive (respond directly), planning (plan, then act) or search-based (explore and evaluate alternatives). Cost and latency usually grow in that order.",
            },
          ],
        },
      ],
      mentalModels: [
        "Agents are state machines: track state, handle transitions, manage failures.",
        "Multi-agent systems are distributed systems: apply consensus, coordination and fault-tolerance principles.",
        "Agency is a spectrum, from simple automation to autonomous decision-making: use the least that does the job.",
      ],
      exercises: [
        {
          title: "Design a multi-agent travel planning system",
          d: "Agents: Planner (builds the itinerary), Researcher (fetches information), Booker (makes reservations) and Budget Manager (tracks costs).",
          steps: [
            "Choose the coordination model, central supervisor or peer-to-peer, and justify it",
            "Design memory: a shared vector DB for destination information plus per-user preferences",
            "Define each agent's tools (flight, hotel, weather and payment APIs) and the permissions each one gets",
            "Document the communication protocol and failure handling, including what happens when a booking succeeds but payment fails",
            "Mark the human-in-the-loop points, at minimum before any payment",
          ],
        },
        {
          title: "Agentic framework comparison",
          d: "Compare three agent frameworks, for example LangGraph, CrewAI and Microsoft Agent Framework (the successor to AutoGen, which is now in maintenance mode).",
          steps: [
            "For each, analyse the coordination model, memory strategy, tool integration and error handling",
            "Place each one on the taxonomy above",
            "Write the comparison: strengths, weaknesses and best use cases",
          ],
        },
      ],
      resources: [
        {
          kind: "article",
          title: "Building effective agents (Anthropic)",
          url: "https://www.anthropic.com/engineering/building-effective-agents",
          free: true,
          note: "Workflow and agent patterns, and when not to build an agent",
        },
        {
          kind: "docs",
          title: "Choose your agentic AI architecture components (Google Cloud)",
          url: "https://docs.cloud.google.com/architecture/choose-agentic-ai-architecture-components",
          free: true,
          note: "Frameworks, tools, memory and runtimes; its companion page on agent design patterns is also worth reading",
        },
        {
          kind: "docs",
          title: "Enterprise Agentic Architecture and Design Patterns (Salesforce)",
          url: "https://architect.salesforce.com/docs/architect/fundamentals/guide/enterprise-agentic-architecture.html",
          free: true,
          note: "Named patterns for interaction, specialist, utility and long-running agents",
        },
        {
          kind: "paper",
          title: "Agentic Design Patterns: A System-Theoretic Framework",
          url: "https://arxiv.org/abs/2601.19752",
          free: true,
          note: "12 patterns, including Integrator and Retriever",
        },
        {
          kind: "paper",
          title: "Agentic AI: A Comprehensive Survey of Architectures, Applications, and Future Directions",
          url: "https://arxiv.org/abs/2510.25445",
          free: true,
          note: "Source of the symbolic vs neural taxonomy",
        },
        {
          kind: "paper",
          title: "Architectures for Building Agentic AI (Nowaczyk)",
          url: "https://arxiv.org/abs/2512.09458",
          free: true,
          note: "Book chapter arguing that reliability is an architectural property",
        },
        {
          kind: "paper",
          title: "ReAct: Synergizing Reasoning and Acting in Language Models",
          url: "https://arxiv.org/abs/2210.03629",
          free: true,
          note: "The paper behind the reason, act, observe loop",
        },
      ],
    },
  ],
};
