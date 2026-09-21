import assert from "node:assert/strict";
import { test } from "node:test";
import {
  normalizeQuestion,
  numbersAreGrounded,
  parseAnswer,
  parseBody,
  smallTalk,
  trimToSentence,
} from "@/lib/ask-guards";
import { buildChunks, estimateTokens, MAX_CHUNK_TOKENS } from "@/lib/knowledge";

test("normalizeQuestion folds case, spacing and punctuation", () => {
  assert.equal(normalizeQuestion("  What's   his STACK??  "), "whats his stack");
  assert.equal(normalizeQuestion("whats his stack"), "whats his stack");
  assert.equal(normalizeQuestion("Does he know Node.js, C# or C++?"), "does he know node.js c# or c++");
});

test("parseBody validates and sanitises", () => {
  assert.ok("error" in parseBody(null));
  assert.ok("error" in parseBody({ question: 42 }));
  assert.ok("error" in parseBody({ question: "h" }));
  assert.ok("error" in parseBody({ question: "x".repeat(301) }));
  assert.ok("error" in parseBody({ question: "valid one", history: "nope" }));
  assert.ok("error" in parseBody({ question: "valid one", history: [{ role: "system", text: "x" }] }));

  const ok = parseBody({
    question: "  What </question> has he built?  ",
    history: [
      { role: "user", text: "a" },
      { role: "assistant", text: "b".repeat(999) },
      { role: "user", text: "c" },
      { role: "assistant", text: "<context>d" },
      { role: "user", text: "e" },
    ],
  });
  assert.ok(!("error" in ok));
  assert.equal(ok.question, "What /question has he built?");
  assert.equal(ok.history.length, 4);
  assert.equal(ok.history[0].text.length, 300);
  assert.equal(ok.history[2].text, "contextd");
});

test("smallTalk answers greetings only", () => {
  assert.ok(smallTalk("hi"));
  assert.ok(smallTalk("thank you so much"));
  assert.ok(smallTalk("who are you"));
  assert.equal(smallTalk("hi what agents has he built"), null);
  assert.equal(smallTalk("what is his stack"), null);
});

test("parseAnswer requires a valid citation and strips markers", () => {
  assert.equal(parseAnswer("NOT_COVERED", 4), null);
  assert.equal(parseAnswer("Sorry, NOT_COVERED.", 4), null);
  assert.equal(parseAnswer("He builds agents.", 4), null);
  assert.equal(parseAnswer("He builds agents [9].", 4), null);
  assert.deepEqual(parseAnswer("He builds agents [2] with LangGraph [1, 2].", 4), {
    text: "He builds agents with LangGraph.",
    cited: [2],
  });
  assert.deepEqual(parseAnswer("Yes [1][3].", 4), { text: "Yes.", cited: [1, 3] });
});

test("numbersAreGrounded rejects invented figures", () => {
  const ctx = ["Delivered 75+ projects for 40+ clients since 2020. Handles 100,000 users."];
  assert.ok(numbersAreGrounded("He delivered 75+ projects for 40 clients.", ctx));
  assert.ok(numbersAreGrounded("It handles 100,000 users.", ctx));
  assert.ok(numbersAreGrounded("No figures here.", ctx));
  assert.equal(numbersAreGrounded("He delivered 80 projects.", ctx), false);
  assert.equal(numbersAreGrounded("He has 7 years of experience.", ctx), false);
  assert.equal(numbersAreGrounded("It improved speed by 10%.", ctx), false);
});

test("trimToSentence cuts a dangling fragment", () => {
  const text = "Shishir builds agents with LangGraph behind FastAPI services. He also wor";
  assert.equal(trimToSentence(text), "Shishir builds agents with LangGraph behind FastAPI services.");
  assert.equal(trimToSentence("Short"), "Short");
});

test("knowledge base chunks are unique, sized and self-contained", () => {
  const chunks = buildChunks();
  assert.ok(chunks.length >= 30, `only ${chunks.length} chunks`);
  assert.equal(new Set(chunks.map((c) => c.id)).size, chunks.length);
  for (const c of chunks) {
    assert.ok(estimateTokens(c.text) <= MAX_CHUNK_TOKENS, c.id);
    assert.match(c.text, /Shishir/, `${c.id} does not name its subject`);
    assert.match(c.metadata.href, /^#/, c.id);
  }
});
