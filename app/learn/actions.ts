"use server";

import { allIds } from "@/lib/learn/model";
import {
  checkPassword,
  clearOwnerCookie,
  getRoadmap,
  isOwner,
  learnConfigured,
  loginAllowed,
  setOwnerCookie,
  setProgress,
} from "@/lib/learn/server";

// Every export here is a public POST endpoint: validate everything, trust
// nothing the client sends, and check the owner before touching data.

export type LoginState = { error?: string };

// Changing the cookie makes Next re-render the current page, so a successful
// login swaps the form for the page in place, with no redirect.
export async function login(_: LoginState, form: FormData): Promise<LoginState> {
  if (!learnConfigured()) {
    return {
      error:
        process.env.NODE_ENV === "development"
          ? "Set LEARN_PASSWORD in .env.local, then restart the dev server."
          : "Login is unavailable.",
    };
  }
  const allowed = await loginAllowed();
  if (allowed === "limited") {
    return { error: "Too many attempts. Try again in a few minutes." };
  }
  if (allowed === "unavailable") {
    return { error: "Login is unavailable right now. Try again in a minute." };
  }
  const password = form.get("password");
  if (typeof password !== "string" || !checkPassword(password)) {
    return { error: "That password isn't right." };
  }
  await setOwnerCookie();
  return {};
}

export async function logout() {
  await clearOwnerCookie();
}

/** Tick or untick items. Returns false instead of throwing. */
export async function setDone(slug: string, ids: string[], done: boolean) {
  if (
    typeof slug !== "string" ||
    typeof done !== "boolean" ||
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.length > 1000
  ) {
    return false;
  }
  if (!(await isOwner())) return false;

  const roadmap = getRoadmap(slug);
  if (!roadmap) return false;
  const known = new Set(allIds(roadmap));
  if (!ids.every((id) => typeof id === "string" && known.has(id))) return false;

  return setProgress(slug, ids, done);
}
