import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { aiSystemsArchitect } from "@/lib/learn/ai-systems-architect";
import type { Progress, Roadmap } from "@/lib/learn/model";

// /learn is private: every page and action checks isOwner() itself. A check
// in the layout alone would not hold, because layouts don't re-render on
// client navigation.

export const roadmaps: Roadmap[] = [aiSystemsArchitect];
export const getRoadmap = (slug: string) => roadmaps.find((r) => r.slug === slug);

export const COOKIE = { name: "learn_owner", path: "/learn" } as const;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const password = () => process.env.LEARN_PASSWORD ?? "";
// Unset means closed, never open
export const learnConfigured = () => password().length > 0;

// Stateless session: the cookie is an HMAC keyed by the password, so changing
// LEARN_PASSWORD logs out every device.
const ownerToken = () =>
  createHmac("sha256", password()).update("learn-owner-v1").digest("hex");

const sha = (s: string) => createHash("sha256").update(s).digest();

export async function isOwner() {
  // Read the cookie first: it is what makes every /learn route dynamic. An
  // early return before it would let a build without LEARN_PASSWORD
  // prerender the login form as a static page.
  const value = (await cookies()).get(COOKIE.name)?.value;
  if (!value || !learnConfigured()) return false;
  return timingSafeEqual(sha(value), sha(ownerToken()));
}

export const checkPassword = (input: string) =>
  learnConfigured() && timingSafeEqual(sha(input), sha(password()));

export async function setOwnerCookie() {
  (await cookies()).set({
    name: COOKIE.name,
    value: ownerToken(),
    path: COOKIE.path,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearOwnerCookie() {
  // The path must match, or the Path=/learn cookie survives the delete
  (await cookies()).delete({ name: COOKIE.name, path: COOKIE.path });
}

const UPSTASH_TIMEOUT_MS = 4_000;

// Upstash calls must never hang a page; a timeout rejects like any error
function withTimeout<T>(promise: Promise<T>): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("upstash timed out")), UPSTASH_TIMEOUT_MS);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

let clients: ReturnType<typeof createClients> | undefined;
function createClients() {
  const redis = Redis.fromEnv({ retry: { retries: 1 } });
  return {
    redis,
    login: new Ratelimit({
      redis,
      prefix: "learn:rl:login",
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      // 0 turns off the limiter's allow-on-timeout, so errors fail closed
      timeout: 0,
    }),
  };
}
const getClients = () => (clients ??= createClients());

/** Five password attempts per 15 minutes per IP. Fails closed. */
export async function loginAllowed(): Promise<"ok" | "limited" | "unavailable"> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  try {
    const { success } = await withTimeout(getClients().login.limit(ip));
    return success ? "ok" : "limited";
  } catch {
    return "unavailable";
  }
}

const progressKey = (slug: string) => `learn:progress:${slug}`;

/** null when Redis is unavailable: the page then renders read-only */
export async function getProgress(slug: string): Promise<Progress | null> {
  try {
    const raw = await withTimeout(
      getClients().redis.hgetall<Record<string, number>>(progressKey(slug))
    );
    return raw ?? {};
  } catch {
    return null;
  }
}

export async function setProgress(slug: string, ids: string[], done: boolean) {
  const { redis } = getClients();
  try {
    if (done) {
      const now = Date.now();
      await withTimeout(
        redis.hset(progressKey(slug), Object.fromEntries(ids.map((id) => [id, now])))
      );
    } else {
      await withTimeout(redis.hdel(progressKey(slug), ...ids));
    }
    return true;
  } catch {
    return false;
  }
}
