// Settings for the "Ask about me" chat. Thresholds are tuned against
// scripts/ask-eval.ts, not guessed: change one, re-run `npm run ask:eval`.

// Retrieval + model: enough for the eval. Redis adds the rate limits, the
// daily spend cap and the answer cache, and is required before going public.
const CORE_ENV = [
  "ANTHROPIC_API_KEY",
  "UPSTASH_SEARCH_REST_URL",
  "UPSTASH_SEARCH_REST_TOKEN",
] as const;
const REDIS_ENV = ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"] as const;

const missing = (keys: readonly string[]) => keys.filter((k) => !process.env[k]);
export const missingCoreEnv = () => missing(CORE_ENV);
export const missingAskEnv = () => missing([...CORE_ENV, ...REDIS_ENV]);

// The hero hides the chat and the API answers 503 when this is false, so a
// missing key can never break the rest of the site.
export const askConfigured = () => missingAskEnv().length === 0;

export const ASK = {
  model: "claude-haiku-4-5",
  maxOutputTokens: 300,
  requestTimeoutMs: 15_000,

  questionMin: 2, // "hi" gets a canned greeting, not an error
  questionMax: 300,
  historyMaxItems: 4, // two exchanges
  historyItemMaxChars: 300,
  sessionMaxQuestions: 8,

  topK: 4,
  contextMaxChars: 3200, // ~800 tokens

  perMinute: 5,
  perDay: 25,
  globalPerDay: 300, // paid (model) calls across all visitors

  answerTtlSeconds: 60 * 60 * 24 * 7,
  fallbackTtlSeconds: 60 * 60 * 24,
  upstashTimeoutMs: 4_000,

  kbIndex: "kb",
  versionKey: "ask:kb:version",
} as const;
