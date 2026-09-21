import Anthropic from "@anthropic-ai/sdk";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Search } from "@upstash/search";
import { ASK } from "@/lib/ask-config";
import {
  hashText,
  normalizeQuestion,
  numbersAreGrounded,
  parseAnswer,
  smallTalk,
  trimToSentence,
  type AskBody,
} from "@/lib/ask-guards";
import {
  buildUserMessage,
  FALLBACK_ANSWER,
  RESTING_ANSWER,
  SYSTEM_PROMPT,
  type Passage,
  type Turn,
} from "@/lib/ask-prompt";

// The whole "Ask about me" flow. Each step either answers without the model
// or narrows what the model is allowed to say. Shared by the API route and
// scripts/ask-eval.ts so the eval exercises exactly what visitors get.

export type Source = { title: string; href: string };
export type ChunkMeta = { title: string; section: string; href: string };
export type AskResult = {
  answer: string;
  sources: Source[];
  // How the answer was produced: useful in logs and in the eval
  via: "smalltalk" | "cache" | "model" | "rejected" | "resting";
  topScore?: number;
  usage?: { input: number; output: number };
};

type ChunkContent = { title: string; text: string };
type Cached = { answer: string; sources: Source[] };

export class RateLimitedError extends Error {
  constructor(public retryAfterSeconds: number) {
    super("rate limited");
  }
}

// Retrieval has its own client so the eval can run without Redis
let search: ReturnType<typeof createSearch> | undefined;
function createSearch() {
  const client = Search.fromEnv();
  return { kb: client.index<ChunkContent, ChunkMeta>(ASK.kbIndex) };
}
export const getSearch = () => (search ??= createSearch());

let clients: ReturnType<typeof createClients> | undefined;

function createClients() {
  const redis = Redis.fromEnv();
  return {
    redis,
    perMinute: new Ratelimit({
      redis,
      prefix: "ask:rl:min",
      limiter: Ratelimit.slidingWindow(ASK.perMinute, "60 s"),
    }),
    perDay: new Ratelimit({
      redis,
      prefix: "ask:rl:day",
      limiter: Ratelimit.fixedWindow(ASK.perDay, "1 d"),
    }),
    global: new Ratelimit({
      redis,
      prefix: "ask:rl:global",
      limiter: Ratelimit.fixedWindow(ASK.globalPerDay, "1 d"),
    }),
  };
}

const getClients = () => (clients ??= createClients());

let anthropic: Anthropic | undefined;
const getAnthropic = () =>
  (anthropic ??= new Anthropic({
    timeout: ASK.requestTimeoutMs,
    maxRetries: 1,
  }));

// Upstash calls must never hang a request. A timeout rejects, and the caller
// fails closed: no limiter, no answer.
function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`${label} timed out`)),
      ASK.upstashTimeoutMs
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

const uniqueSources = (metas: ChunkMeta[]): Source[] => {
  const seen = new Set<string>();
  return metas
    .map((m) => ({
      // "Liftrava highlights" and "Liftrava" point at the same place
      title: m.title.replace(/ highlights$/, ""),
      href: m.href,
    }))
    .filter((s) => !seen.has(s.title) && seen.add(s.title));
};

type SourcedPassage = Passage & { meta: ChunkMeta };

// The model call plus the checks its answer must pass. `result` is null when
// the model declined, cited nothing, or stated a number it was not given.
export async function generateAnswer(
  question: string,
  passages: SourcedPassage[],
  history: Turn[]
): Promise<{ result: Cached | null; usage: { input: number; output: number } }> {
  const message = await getAnthropic().messages.create({
    model: ASK.model,
    max_tokens: ASK.maxOutputTokens,
    temperature: 0,
    system: SYSTEM_PROMPT,
    messages: [
      { role: "user", content: buildUserMessage(question, passages, history) },
    ],
  });
  const usage = {
    input: message.usage.input_tokens,
    output: message.usage.output_tokens,
  };

  let raw = message.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("");
  if (message.stop_reason === "max_tokens") raw = trimToSentence(raw);

  const parsed =
    message.stop_reason === "refusal" ? null : parseAnswer(raw, passages.length);
  const grounded =
    parsed &&
    numbersAreGrounded(parsed.text, [
      ...passages.map((p) => p.text),
      question,
      ...history.map((t) => t.text),
    ]);
  if (!parsed || !grounded) return { result: null, usage };

  return {
    result: {
      answer: parsed.text,
      sources: uniqueSources(parsed.cited.map((n) => passages[n - 1].meta)),
    },
    usage,
  };
}

export async function answerQuestion(
  { question, history }: AskBody,
  visitorId: string | null, // null skips the per-visitor limits (eval, ingest)
  { skipCache = false } = {} // the eval measures the model, not the cache
): Promise<AskResult> {
  const { kb } = getSearch();
  const normalized = normalizeQuestion(question);

  if (visitorId) {
    const c = getClients();
    const [minute, day] = await withTimeout(
      Promise.all([c.perMinute.limit(visitorId), c.perDay.limit(visitorId)]),
      "rate limit"
    );
    const blocked = [minute, day].find((r) => !r.success);
    if (blocked) {
      throw new RateLimitedError(
        Math.max(1, Math.ceil((blocked.reset - Date.now()) / 1000))
      );
    }
  }

  const canned = smallTalk(normalized);
  if (canned) return { answer: canned, sources: [], via: "smalltalk" };

  // Exact-match cache only. Upstash Search scores are rank-normalised (the best
  // hit is always ~1.0), so they cannot tell a paraphrase from a different
  // question, and a "semantic" cache would serve wrong answers.
  // Follow-ups depend on the conversation, so only first questions are cached
  const cacheable = history.length === 0 && !skipCache;
  let cacheKey = "";

  if (cacheable) {
    const { redis } = getClients();
    const version =
      (await withTimeout(redis.get<string>(ASK.versionKey), "version")) ?? "0";
    cacheKey = `ask:answer:${version}:${hashText(normalized)}`;
    const hit = await withTimeout(redis.get<Cached>(cacheKey), "cache read");
    if (hit) return { ...hit, via: "cache" };
  }

  // Pronouns in a follow-up ("what stack did it use?") need the previous question
  const lastQuestion = [...history].reverse().find((t) => t.role === "user");
  const retrievalQuery = lastQuestion
    ? `${lastQuestion.text} ${question}`
    : question;
  const retrieve = () =>
    withTimeout(
      kb.search({ query: retrievalQuery, limit: ASK.topK, inputEnrichment: false }),
      "retrieval"
    );
  let matches = await retrieve();
  // Hybrid search over a populated index always returns something. Nothing
  // means the index is briefly unavailable (seen right after a re-ingest), so
  // it is an error to retry, never a "not covered" to show or cache.
  if (matches.length === 0) {
    await new Promise((r) => setTimeout(r, 400));
    matches = await retrieve();
  }
  if (matches.length === 0) throw new Error("retrieval returned no results");
  const topScore = matches[0].score;

  const remember = async (result: Cached, ttl: number) => {
    if (!cacheable) return;
    await withTimeout(
      getClients().redis.set(cacheKey, result, { ex: ttl }),
      "cache write"
    ).catch((err) => console.warn("[ask] cache write failed", err));
  };

  const usable = matches.filter((m) => m.content?.text && m.metadata);
  if (usable.length === 0) throw new Error("retrieved documents have no text");

  // Fill the context budget in relevance order; always keep the best match
  const passages: SourcedPassage[] = [];
  let budget = ASK.contextMaxChars;
  for (const m of usable) {
    const text = m.content.text;
    if (passages.length > 0 && text.length > budget) continue;
    budget -= text.length;
    passages.push({
      n: passages.length + 1,
      title: m.metadata!.title,
      text,
      meta: m.metadata!,
    });
  }

  // The daily cap guards public traffic; the eval and ingest are ours
  if (visitorId) {
    const spend = await withTimeout(getClients().global.limit("all"), "daily cap");
    if (!spend.success) {
      return { answer: RESTING_ANSWER, sources: [], via: "resting", topScore };
    }
  }

  const { result: generated, usage } = await generateAnswer(
    question,
    passages,
    history
  );

  if (!generated) {
    const result = { answer: FALLBACK_ANSWER, sources: [] };
    await remember(result, ASK.fallbackTtlSeconds);
    return { ...result, via: "rejected", topScore, usage };
  }

  await remember(generated, ASK.answerTtlSeconds);
  return { ...generated, via: "model", topScore, usage };
}
