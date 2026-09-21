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

  // Reset rather than diff: ids of deleted content must not linger
  await kb.reset().catch(() => {}); // the index does not exist on a first run
  await kb.upsert(
    chunks.map((c) => ({
      id: c.id,
      content: { title: c.metadata.title, text: c.text },
      metadata: c.metadata,
    }))
  );

  // Embedding happens on Upstash's side; wait until everything is searchable
  for (let i = 0; i < 40; i++) {
    const info = await kb.info();
    if (info.pendingDocumentCount === 0 && info.documentCount >= chunks.length) break;
    await sleep(1000);
  }
  console.log(`Uploaded ${chunks.length} chunks (~${total} tokens).`);

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
  for (const question of askSuggestions) {
    const r = await answerQuestion({ question, history: [] }, null);
    console.log(`\nQ: ${question}\n[${r.via}, score ${r.topScore?.toFixed(3)}] ${r.answer}`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
