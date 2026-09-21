import { createHash } from "node:crypto";
import { ASK } from "@/lib/ask-config";
import { NOT_COVERED, type Turn } from "@/lib/ask-prompt";
import { site } from "@/lib/content";

// Pure checks around the model call. Everything here is deterministic and unit
// tested (ask-guards.test.ts): the model is never trusted on its own.

// Cache key form: case, punctuation and spacing don't make a new question
export const normalizeQuestion = (q: string) =>
  q
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9+#.]+/g, " ")
    .replace(/\.+(?= |$)/g, "")
    .trim();

export const hashText = (s: string) =>
  createHash("sha256").update(s).digest("hex").slice(0, 32);

export type AskBody = { question: string; history: Turn[] };

export function parseBody(input: unknown): AskBody | { error: string } {
  if (!input || typeof input !== "object") return { error: "Invalid request." };
  const { question, history = [] } = input as Record<string, unknown>;
  if (typeof question !== "string") return { error: "Ask a question first." };
  const q = question.replace(/\s+/g, " ").trim();
  if (q.length < ASK.questionMin) return { error: "That question is too short." };
  if (q.length > ASK.questionMax) {
    return { error: `Keep it under ${ASK.questionMax} characters.` };
  }
  if (!Array.isArray(history)) return { error: "Invalid request." };
  const turns: Turn[] = [];
  for (const item of history.slice(-ASK.historyMaxItems)) {
    const { role, text } = (item ?? {}) as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof text !== "string") {
      return { error: "Invalid request." };
    }
    turns.push({
      role,
      // Angle brackets are dropped so history can't close the prompt's tags
      text: text.replace(/[<>]/g, "").slice(0, ASK.historyItemMaxChars),
    });
  }
  return { question: q.replace(/[<>]/g, ""), history: turns };
}

// Greetings and meta questions never need retrieval or the model
export function smallTalk(normalized: string): string | null {
  if (/^(hi|hii+|hello|hey|yo|namaste|good (morning|afternoon|evening))( there)?$/.test(normalized)) {
    return "Hi! Ask me anything about Shishir: his AI and backend work, projects, stack, or how to hire him.";
  }
  if (/^(thanks|thank you|thx|ok thanks|great thanks|cool thanks)( a lot| so much)?$/.test(normalized)) {
    return `You're welcome. If you'd like to talk to Shishir directly: ${site.email}`;
  }
  if (/^(who|what) are you$|^what can you do$|^are you (an? )?(ai|bot|human|real)$/.test(normalized)) {
    return "I'm an AI assistant on Shishir's site. I answer from his website and resume using retrieval over a vector database, so ask about his work, skills, experience or availability.";
  }
  return null;
}

export type ParsedAnswer = { text: string; cited: number[] };

// Returns null when the model declined or did not ground its answer
export function parseAnswer(raw: string, passageCount: number): ParsedAnswer | null {
  const answer = raw.trim();
  if (!answer || answer.includes(NOT_COVERED)) return null;
  const cited = [
    ...new Set(
      [...answer.matchAll(/\[(\d+)\]/g)]
        .map((m) => Number(m[1]))
        .filter((n) => n >= 1 && n <= passageCount)
    ),
  ];
  if (cited.length === 0) return null;
  const text = answer
    .replace(/\s*\[\d+(?:\s*,\s*\d+)*\]/g, "")
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
  return text ? { text, cited } : null;
}

const numbersIn = (s: string) =>
  (s.match(/\d+(?:[.,]\d+)*/g) ?? []).map((n) => n.replace(/,/g, ""));

// Every number in the answer must appear in the retrieved passages (or the
// visitor's question). Invented metrics and dates are the costliest mistake.
export function numbersAreGrounded(answer: string, sources: string[]): boolean {
  const known = new Set(sources.flatMap(numbersIn));
  return numbersIn(answer).every((n) => known.has(n));
}

// Used when the model stopped at max_tokens mid-sentence
export function trimToSentence(text: string): string {
  const end = Math.max(text.lastIndexOf("."), text.lastIndexOf("!"), text.lastIndexOf("?"));
  return end > 40 ? text.slice(0, end + 1) : text;
}
