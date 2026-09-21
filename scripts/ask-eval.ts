// Runs the question set in ask-eval.cases.json through the real pipeline
// (retrieval + model + guards, caches skipped) and fails on any regression.
//   npm run ask:eval
// Costs a few cents per run. Run it after changing the prompt, the thresholds
// in lib/ask-config.ts, or the site content (after `npm run ingest`).

import cases from "./ask-eval.cases.json";
import { missingCoreEnv } from "@/lib/ask-config";
import { answerQuestion } from "@/lib/ask-pipeline";
import { FALLBACK_ANSWER } from "@/lib/ask-prompt";

type Case = { q: string; expect: "answer" | "fallback"; any?: string[]; none?: string[] };

async function main() {
  const missing = missingCoreEnv();
  if (missing.length) throw new Error(`Missing in .env.local: ${missing.join(", ")}`);

  let failed = 0;
  let input = 0;
  let output = 0;
  let paid = 0;

  for (const c of cases as Case[]) {
    const r = await answerQuestion({ question: c.q, history: [] }, null, { skipCache: true });
    const text = r.answer.toLowerCase();
    const isFallback = r.answer === FALLBACK_ANSWER;

    const problems: string[] = [];
    if (c.expect === "fallback" && !isFallback) problems.push("expected the fallback");
    if (c.expect === "answer" && isFallback) problems.push("expected an answer");
    if (c.expect === "answer" && c.any && !c.any.some((k) => text.includes(k))) {
      problems.push(`none of [${c.any.join(", ")}] in answer`);
    }
    for (const k of c.none ?? []) {
      if (text.includes(k)) problems.push(`must not contain "${k}"`);
    }

    if (r.usage) {
      paid++;
      input += r.usage.input;
      output += r.usage.output;
    }
    if (problems.length) failed++;
    console.log(
      `${problems.length ? "FAIL" : "ok  "} [${r.via.padEnd(8)} ${(r.topScore ?? 0).toFixed(3)}] ${c.q}` +
        (problems.length ? `\n       ${problems.join("; ")}\n       -> ${r.answer}` : "")
    );
  }

  // Haiku 4.5: $1 per million input tokens, $5 per million output tokens
  const cost = (input * 1 + output * 5) / 1_000_000;
  console.log(
    `\n${cases.length - failed}/${cases.length} passed. ${paid} model calls, ` +
      `avg ${Math.round(input / (paid || 1))} in / ${Math.round(output / (paid || 1))} out tokens, ` +
      `$${cost.toFixed(4)} total ($${(cost / (paid || 1)).toFixed(4)} per paid question).`
  );
  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
