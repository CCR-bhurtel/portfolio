// Single source of truth for site copy. Rendered by the page sections and
// reused for JSON-LD, the sitemap and /llms.txt so they never drift apart.

export const site = {
  url: "https://www.shishirbhurtel.com.np",
  name: "Shishir Bhurtel",
  jobTitle: "AI Engineer & Full-Stack Developer",
  title: "Shishir Bhurtel — AI Engineer & Full-Stack Developer · LLM Agents, RAG, Web Apps",
  description:
    "AI engineer and full-stack developer. I build LLM agents and RAG pipelines that hold up with real users, and the web applications around them — Python and FastAPI or Node.js and NestJS backends, React and Next.js front ends. 3+ years of industry experience and 2 years of freelance work, for teams in the US and Europe.",
  tagline:
    "AI engineer and full-stack developer. I build LLM agents, RAG pipelines and the web applications around them.",
  email: "bhurtelshishir@gmail.com",
  location: "Kathmandu, Nepal",
  timezone: "UTC+5:45",
  resume: "/resume_shishir.pdf",
  twitter: "@shishirbhurtel",
};

export const keywords = [
  "Shishir Bhurtel",
  "AI Engineer",
  "LLM Engineer",
  "Agentic AI developer",
  "AI agent developer",
  "LangGraph developer",
  "RAG developer",
  "Hire AI engineer",
  "LLM evals and tracing",
  "Python developer",
  "FastAPI developer",
  "Python backend engineer",
  "Full-stack web application developer",
  "Node.js developer",
  "NestJS developer",
  "Next.js developer",
  "AI Engineer Nepal",
  "Full-Stack Developer",
  "LLM applications",
  "RAG pipelines",
  "AI agents",
  "LangGraph",
  "LangChain",
  "Prompt engineering and evals",
  "Python",
  "FastAPI",
  "Node.js",
  "Next.js",
  "React",
  "TypeScript",
  "Freelance AI developer",
  "Kathmandu",
];

export const railLinks = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "FAQ", href: "#faq" },
];

// AI first, then the application work: two of each
// Starter questions for the hero chat. The ingest script warms these into the
// answer cache, so the most-clicked questions never reach the model.
export const askSuggestions = [
  "What AI agents has he built?",
  "What's his backend stack?",
  "Is he available for contract work?",
  "How does he keep LLM features reliable?",
];

export const focusAreas = [
  "LLM agents & RAG",
  "Evals & tracing",
  "Backends & APIs",
  "Full-stack web apps",
];

// AI stack first: it is the first thing the marquee shows
export const stack = [
  "Python",
  "FastAPI",
  "LangGraph",
  "LangChain",
  "RAG · pgvector",
  "OpenAI · Claude APIs",
  "Evals & tracing",
  "TypeScript",
  "Node.js",
  "NestJS",
  "Express",
  "Next.js",
  "React",
  "Golang",
  "Postgres",
  "MongoDB",
  "Redis",
  "Celery",
  "Docker",
  "AWS",
];

export const stats = [
  { v: "3+ yrs", t: "Industry experience, plus 2 years of freelance work" },
  { v: "75+", t: "Projects delivered for 40+ clients worldwide" },
  { v: "Top Rated", t: "On Upwork · Level 2 on Fiverr" },
  {
    v: "100K+",
    t: "Concurrent users supported on a platform I re-architected",
  },
];

export type Project = {
  name: string;
  kind: string;
  year: string;
  tagline: string;
  problem: string;
  built: string;
  highlights: string[];
  tech: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    name: "Spacebrain.ai",
    kind: "Current role · AI platform",
    year: "2025 —",
    tagline:
      "The assistant and agent layer of a go-to-market platform — CRM, marketing, conversations and payments in one workspace.",
    problem:
      "A go-to-market team's context is spread across customer records, documents and conversations. An assistant is only useful there if it can find the right context, take real actions, and be trusted to do both at scale.",
    built:
      "Assistant and agent systems with LangGraph orchestration behind FastAPI services: retrieval over customer records and documents, tool-calling actions that draft replies and prepare workflow steps, and the evaluation and tracing that keep them trustworthy.",
    highlights: [
      "LangGraph agent orchestration behind FastAPI services",
      "Retrieval over customer records and documents with pgvector",
      "Tool-calling actions that draft replies and prepare workflow steps",
      "Evaluation and tracing so changes are measured, not guessed",
    ],
    tech: [
      "LangGraph",
      "RAG · pgvector",
      "FastAPI",
      "Python",
      "Celery",
      "Postgres",
      "Docker",
    ],
    links: [{ label: "Visit spacebrain.ai", href: "https://spacebrain.ai" }],
  },
  {
    name: "Liftrava",
    kind: "Product · SaaS",
    year: "2026",
    tagline:
      "An offline-first fitness PWA: log every set with zero signal, and get AI-generated targets built from what you actually train.",
    problem:
      "Gyms are signal dead zones. Logging apps stall mid-set, lose data or silently duplicate it — and most training plans are written once and never match what someone actually trains.",
    built:
      "A full-stack build across four deployed apps — REST API, athlete PWA, admin console and marketing site. Workouts run completely offline: start a session, log sets, finish, and everything syncs when signal returns, with idempotent syncing and a local replay queue guaranteeing no duplicate or lost sets. Logging responds instantly, online or off.",
    highlights: [
      "Offline-first: start, log and finish a workout with zero signal; syncs on reconnect",
      "Idempotent sync and a local replay queue — no duplicate or lost sets",
      "Plans that build themselves: pick today's muscle groups and sessions become the plan",
      "AI-generated next-session targets — weight, reps, deload — from real training history",
      "187-exercise library with smart search, PR tracking and a 3D muscle-recovery map",
      "Guest mode with history import on signup; Paddle subscriptions; push reminders timed to each user's usual gym hour",
      "Verified end to end with automated browser tests, including emulated offline and slow networks",
    ],
    tech: [
      "Applied AI",
      "Offline-first PWA",
      "Full-stack",
      "Health & fitness",
      "SaaS",
    ],
    links: [{ label: "Visit liftrava.com", href: "https://liftrava.com" }],
  },
  {
    name: "Tranquil.AI",
    kind: "AI product",
    year: "2025",
    tagline:
      "An AI companion for mental wellness — journalling, mood tracking and personalised insight.",
    problem:
      "Journalling apps collect writing but give nothing back. People stop after a week because nothing in the product notices what they wrote.",
    built:
      "A Next.js app over a Python service that turns entries into mood signals and returns grounded, personalised reflections — with prompt design and guardrails tuned so the output stays supportive and safe.",
    highlights: [
      "LLM pipeline for entry analysis and insight generation",
      "Mood tracking with trends over time",
      "Prompt guardrails for a sensitive domain",
    ],
    tech: ["Python", "Next.js", "LLM APIs", "Postgres"],
    links: [{ label: "Live demo", href: "https://tranquil-ai.vercel.app" }],
  },
  {
    name: "National exam platform",
    kind: "Client work",
    year: "2024",
    tagline:
      "Exam assignment for a European government body, built to hold up under load.",
    problem:
      "A national-scale exam assignment process that had to stay correct and available with very large concurrent usage.",
    built:
      "Domain-centric services in Express and Next.js over MongoDB with PayloadCMS, OAuth and JWT auth, Stripe for payments, and an architecture reworked for concurrency.",
    highlights: [
      "Backend architecture handling 100K+ concurrent users",
      "OAuth and JWT authentication",
      "Domain-centric service architecture",
    ],
    tech: ["Express.js", "Next.js", "MongoDB", "PayloadCMS", "OAuth", "Stripe"],
    links: [],
  },
  {
    name: "ShareDirect",
    kind: "Open source",
    year: "2024",
    tagline:
      "Peer-to-peer file transfer — devices talk directly, nothing touches a server.",
    problem:
      "Sending a large file usually means uploading it to someone else's storage first: slow, and a privacy cost for a transfer that lasts minutes.",
    built:
      "A Go signalling service and a Next.js client using WebRTC data channels, so files stream device to device with the server only brokering the handshake.",
    highlights: [
      "WebRTC data channels with chunked streaming",
      "Go signalling server, no file ever stored",
      "Works browser to browser, no install",
    ],
    tech: ["Golang", "Next.js", "WebRTC", "WebSockets"],
    links: [
      { label: "Live demo", href: "https://share-direct.vercel.app" },
      { label: "Code", href: "https://github.com/CCR-bhurtel/ShareDirect" },
    ],
  },
  {
    name: "ChatUp",
    kind: "Realtime app",
    year: "2023",
    tagline:
      "A realtime chat platform with private messaging, groups, file sharing and end-to-end encryption.",
    problem:
      "Building chat is easy until presence, delivery guarantees and encryption have to work together at the same time.",
    built:
      "A Node and Express backend over WebSockets with a room model for groups, media upload handling, and end-to-end encryption on message payloads.",
    highlights: [
      "WebSocket rooms with presence and delivery state",
      "End-to-end encrypted messages",
      "File sharing with previews",
    ],
    tech: ["Node.js", "Express.js", "WebSockets", "MongoDB", "React"],
    links: [
      { label: "Live demo", href: "https://chat-up-phi.vercel.app/" },
      { label: "Code", href: "https://github.com/CCR-bhurtel/ChatUp" },
    ],
  },
  {
    name: "BidStruct",
    kind: "Client work",
    year: "2025",
    tagline:
      "A government bidding platform — React and Redux front end over an optimised Node API.",
    problem:
      "A bidding workflow with heavy, slow queries and an interface contractors found hard to navigate under deadline.",
    built:
      "Rebuilt the interface in React and Redux, then profiled and reworked the API layer: caching, query tuning and third-party integrations.",
    highlights: [
      "API response times improved by 10%",
      "Database query times reduced by 8%",
      "Caching strategy and third-party integrations",
    ],
    tech: ["React.js", "Redux.js", "Node.js", "Express.js", "MongoDB"],
    links: [],
  },
];

// Buyer-facing offers. `step` reads left to right as the path an AI feature
// takes to production; `items` keeps the skills scannable for recruiters.
export const toolkit = [
  {
    num: "01",
    step: "Build",
    title: "Agents & LLM features",
    body: "Assistants and agents that take real actions inside your product — drafting replies, preparing workflow steps, calling your APIs — with a human in the loop where it matters.",
    items: [
      "Python · FastAPI services",
      "LangGraph · LangChain",
      "Tool calling & structured output",
      "Multi-step agent workflows",
      "OpenAI / Claude APIs",
    ],
  },
  {
    num: "02",
    step: "Ground",
    title: "RAG & retrieval",
    body: "Answers grounded in your own records and documents instead of the model's best guess.",
    items: [
      "Retrieval over docs & customer records",
      "Embeddings & vector search",
      "pgvector · Postgres",
      "Python ingestion jobs · Celery",
      "Context & prompt design",
    ],
  },
  {
    num: "03",
    step: "Harden",
    title: "Evals, tracing & guardrails",
    body: "The unglamorous part: knowing when the model is wrong, what it costs, and whether a change actually made it better.",
    items: [
      "Prompt design + evals",
      "LLM tracing & observability",
      "Guardrails for sensitive domains",
      "Cost & latency awareness",
    ],
  },
  {
    num: "04",
    step: "Ship",
    title: "Backend, product & cloud",
    body: "The system around the model — Python and FastAPI services, Node.js and NestJS APIs, data, interface, deployment. The difference between a demo and a service people rely on.",
    items: [
      "Python · FastAPI · Celery",
      "Node.js · NestJS · Express · Fastify",
      "Golang · REST & WebSockets",
      "Next.js · React · TypeScript",
      "Postgres · MongoDB · Redis",
      "Docker · AWS · CI/CD",
    ],
  },
];

export const faqs = [
  {
    q: "What kind of AI work do you take on?",
    a: "LLM features inside existing products, agents that call tools and take actions, RAG over your documents and records, and making an AI feature that already exists reliable enough to trust. I also build the full-stack system around it, so you don't need a second engineer to get it live.",
  },
  {
    q: "Can you work inside our existing codebase and team?",
    a: "Yes — that is most of what I've done. I've worked as a contract engineer inside product teams in the US, Germany and the Netherlands, and delivered 75+ projects directly with clients. I'm most productive in Python and FastAPI, Node.js with NestJS or Express, and Next.js with React.",
  },
  {
    q: "How do you keep LLM features reliable in production?",
    a: "Evals before and after every meaningful change, tracing on every model call, guardrails where the domain is sensitive, and a human in the loop for actions with consequences. I also watch cost and latency from the start, because a feature that works but is too slow or too expensive doesn't ship.",
  },
  {
    q: "Where are you based, and how does the time zone work?",
    a: "Kathmandu, Nepal (UTC+5:45). I've worked with teams in the US and Europe throughout my career — written updates by default, calls where they help.",
  },
  {
    q: "How do we start?",
    a: "Email me or use the form below with what you're building and where the model fits. I reply within a day. From there it's usually a short scoping call and a small first milestone, so you can judge the work before committing to more.",
  },
];

export const roles = [
  {
    from: "2025",
    role: "AI & Backend Engineer",
    org: "Spacebrain.ai",
    period: "Oct 2025 — Present",
    body: "Building the AI layer of a go-to-market platform that brings CRM, marketing, conversations and payments into one workspace. I work on the assistant and agent systems — LangGraph orchestration behind FastAPI services — plus retrieval over customer records and documents, tool-calling actions that draft replies and prepare workflow steps, and the evaluation and tracing that keep them trustworthy at scale.",
    tech: [
      "Python",
      "FastAPI",
      "LangGraph",
      "LLM orchestration",
      "RAG · pgvector",
      "Celery",
      "Postgres",
      "Docker",
    ],
  },
  {
    from: "2024",
    role: "Full Stack Developer (Contract)",
    org: "AppCentric · United States",
    period: "Dec 2024 — Jun 2025",
    body: "Working on the BackToIt and BidStruct products: optimising RESTful APIs, integrating third-party services and caching, and building the React and Redux interface for a government bidding platform.",
    tech: ["Node.js", "Express.js", "React.js", "Redux.js", "MongoDB"],
  },
  {
    from: "2023",
    role: "Full Stack Developer (Contract)",
    org: "TijgerSoftware · Germany",
    period: "Dec 2023 — Dec 2024",
    body: "Delivered national-level projects in the Netherlands and Germany, including a government exam assignment platform. Built APIs in Express and Next.js, OAuth and JWT authentication, Stripe payments, and improved the backend architecture to handle more than 100K concurrent users.",
    tech: ["Express.js", "Next.js", "MongoDB", "PayloadCMS", "OAuth", "Stripe"],
  },
  {
    from: "2021",
    role: "Freelance Web Developer",
    org: "Upwork · Fiverr",
    period: "May 2021 — Jun 2023",
    body: "Completed over 75 orders for more than 40 clients worldwide, reaching Level 2 on Fiverr and Top Rated on Upwork — mostly Node.js software, delivered directly with the client.",
    tech: ["Node.js", "JavaScript", "React", "MongoDB"],
  },
];

export const posts = [
  {
    date: "Apr 12, 2023",
    read: "12 min",
    title: "A comprehensive guide for PostgreSQL indexing",
    href: "https://medium.com/@bhurtelshishir/a-comprehensive-guide-for-postgresql-indexing-800af5459dba",
  },
  {
    date: "Apr 3, 2023",
    read: "10 min",
    title: "Understanding the internal architecture of Slack",
    href: "https://medium.com/@bhurtelshishir/understanding-the-internal-architecture-of-slack-how-slack-sends-millions-of-messages-at-a-time-4d4189968fd0",
  },
  {
    date: "Mar 12, 2023",
    read: "12 min",
    title: "Django vs Express — which framework should you choose?",
    href: "https://medium.com/@bhurtelshishir/django-vs-express-which-framework-should-you-choose-80585a821bc2",
  },
];

export const education = [
  {
    school: "Patan Multiple Campus",
    years: "2022 — 2026",
    detail: "BSc in Computer Science and Information Technology (expected).",
  },
  {
    school: "Trinity International College",
    years: "2019 — 2020",
    detail: "High school, GPA 3.64.",
  },
];

export const social = {
  github: "https://github.com/CCR-bhurtel",
  linkedin: "https://www.linkedin.com/in/shishir-bhurtel-54974b1b7/",
  medium: "https://medium.com/@bhurtelshishir",
  upwork: "https://www.upwork.com/freelancers/~01057ddfd5f75dcab7",
  fiverr: "https://www.fiverr.com/s/jjG8lZV",
};

export const links = [
  { label: "GitHub", href: social.github },
  { label: "LinkedIn", href: social.linkedin },
  { label: "Medium", href: social.medium },
  { label: "Upwork", href: social.upwork },
  { label: "Fiverr", href: social.fiverr },
];
