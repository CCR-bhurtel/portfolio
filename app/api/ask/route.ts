import Anthropic from "@anthropic-ai/sdk";
import { askConfigured } from "@/lib/ask-config";
import { hashText, parseBody } from "@/lib/ask-guards";
import { answerQuestion, RateLimitedError } from "@/lib/ask-pipeline";
import { ERROR_ANSWER } from "@/lib/ask-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const json = (body: unknown, status = 200, headers?: HeadersInit) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });

// Every failure leaves here as { error, message }: the chat always has
// something human to show and never sees a stack trace.
export async function POST(req: Request) {
  if (!askConfigured()) {
    return json({ error: "unavailable", message: ERROR_ANSWER }, 503);
  }

  let input: unknown;
  try {
    input = await req.json();
  } catch {
    return json({ error: "bad_request", message: "Invalid request." }, 400);
  }
  const body = parseBody(input);
  if ("error" in body) {
    return json({ error: "bad_request", message: body.error }, 400);
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const visitor = hashText(ip);
  const started = Date.now();

  try {
    const result = await answerQuestion(body, visitor);
    console.info(
      "[ask]",
      JSON.stringify({
        via: result.via,
        topScore: result.topScore && Number(result.topScore.toFixed(3)),
        usage: result.usage,
        ms: Date.now() - started,
        visitor: visitor.slice(0, 8),
      })
    );
    return json({ answer: result.answer, sources: result.sources });
  } catch (err) {
    if (err instanceof RateLimitedError) {
      return json(
        {
          error: "rate_limited",
          message:
            "That's a lot of questions in a short time. Give it a moment and try again.",
        },
        429,
        { "Retry-After": String(err.retryAfterSeconds) }
      );
    }
    // Most specific first; the distinction matters in the logs, not to visitors
    if (err instanceof Anthropic.RateLimitError) {
      console.error("[ask] anthropic rate limit");
    } else if (err instanceof Anthropic.APIError) {
      console.error("[ask] anthropic error", err.status, err.message);
    } else {
      console.error("[ask] failed", err);
    }
    return json({ error: "failed", message: ERROR_ANSWER }, 503);
  }
}
