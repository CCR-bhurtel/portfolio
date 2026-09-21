// Loads the knowledge base into Upstash Search.
//   npm run ingest              upload, bump the version, warm the suggestions
//   npm run ingest -- --dry-run just print the chunks
// Run it again whenever lib/content.ts or content/*.md changes.

import { Redis } from "@upstash/redis";
import { ASK, missingAskEnv, missingCoreEnv } from "@/lib/ask-config";
import { answerQuestion, getSearch } from "@/lib/ask-pipeline";
import { askSuggestions } from "@/lib/content";
import { buildChunks, estimateTokens } from "@/lib/knowledge";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const chunks = buildChunks();
  const total = chunks.reduce((n, c) => n + estimateTokens(c.text), 0);

  if (process.argv.includes("--dry-run")) {
    for (const c of chunks) {
      console.log(`${String(estimateTokens(c.text)).padStart(4)} tok  ${c.id}`);
    }
    console.log(`\n${chunks.length} chunks, ~${total} tokens in total.`);
    return;
  }

  const missing = missingCoreEnv();
  if (missing.length) {
    throw new Error(`Missing in .env.local: ${missing.join(", ")}`);
  }

  const { kb } = getSearch();

  // Update in place, then remove what no longer exists. Resetting the index
  // instead leaves it returning nothing for a minute, to live visitors too.
  await kb.upsert(
    chunks.map((c) => ({
      id: c.id,
      content: { title: c.metadata.title, text: c.text },
      metadata: c.metadata,
    }))
  );
  const keep = new Set(chunks.map((c) => c.id));
  const stale: string[] = [];
  let cursor = "0";
  do {
    const page = await kb.range({ cursor, limit: 100 });
    stale.push(...page.documents.map((d) => d.id).filter((id) => !keep.has(id)));
    cursor = page.nextCursor;
  } while (cursor && cursor !== "0");
  if (stale.length) await kb.delete(stale);

  // Embedding happens on Upstash's side. "Nothing pending" is not enough: wait
  // until searches answer several times in a row.
  let stable = 0;
  for (let i = 0; i < 90 && stable < 5; i++) {
    const info = await kb.info();
    const hits =
      info.pendingDocumentCount === 0
        ? await kb.search({ query: askSuggestions[i % askSuggestions.length], limit: 1, inputEnrichment: false })
        : [];
    stable = hits.length ? stable + 1 : 0;
    await sleep(1000);
  }
  if (stable < 5) throw new Error("The search index did not become searchable in time. Run the ingest again.");
  console.log(
    `Uploaded ${chunks.length} chunks (~${total} tokens), removed ${stale.length} stale.`
  );

  if (missingAskEnv().length) {
    console.log(
      `Skipped the cache version and warm-up: ${missingAskEnv().join(", ")} not set.`
    );
    return;
  }

  // A new version makes every cached answer from the old content unreachable
  const version = Date.now().toString();
  await Redis.fromEnv().set(ASK.versionKey, version);
  console.log(`Cache version ${version}.`);

  // The chips are the most-asked questions: answer them once, now
  let unanswered = 0;
  for (const question of askSuggestions) {
    const r = await answerQuestion({ question, history: [] }, null);
    if (r.via !== "model" && r.via !== "cache") unanswered++;
    console.log(`\nQ: ${question}\n[${r.via}] ${r.answer}`);
  }
  if (unanswered) {
    throw new Error(`${unanswered} suggested question(s) got no real answer. Fix the content or the question, then ingest again.`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
