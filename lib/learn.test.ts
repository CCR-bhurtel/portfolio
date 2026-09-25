import assert from "node:assert/strict";
import { test } from "node:test";
import { aiSystemsArchitect } from "@/lib/learn/ai-systems-architect";
import { allIds, itemText, nodes, slug, type Roadmap } from "@/lib/learn/model";

// Every roadmap registered in lib/learn/server.ts
const roadmaps: Roadmap[] = [aiSystemsArchitect];

test("slug makes short, stable, url-safe ids", () => {
  assert.equal(slug("CAP theorem"), "cap-theorem");
  assert.equal(slug("Quorum systems (N, R, W)"), "quorum-systems-n-r-w");
  assert.equal(slug("FP32 → FP16 → INT8"), "fp32-fp16-int8");
  assert.equal(slug("  Write-back (write-behind) "), "write-back-write-behind");
});

for (const r of roadmaps) {
  test(`${r.slug}: ids are unique, so no two items share a tick`, () => {
    const seen = new Set<string>();
    for (const id of [...allIds(r), ...nodes(r).map((n) => n.key)]) {
      assert.ok(!seen.has(id), `duplicate id ${id}`);
      assert.match(id, /^\d+\.\d+\/[a-z0-9/-]+$|^\d+\.\d+$/, `malformed id ${id}`);
      seen.add(id);
    }
  });

  test(`${r.slug}: every node has a description and something to tick`, () => {
    for (const p of r.phases) {
      assert.ok(p.summary.trim(), `phase ${p.n} has no summary`);
      assert.ok(p.modules.length > 0, `phase ${p.n} has no modules`);
      for (const m of p.modules) {
        assert.ok(m.summary.trim(), `${m.id} has no summary`);
        assert.ok(m.topics.length > 0, `${m.id} has no topics`);
        for (const t of m.topics) {
          assert.ok(t.summary.trim(), `${m.id} ${t.title} has no summary`);
          assert.ok(t.items.length > 0, `${m.id} ${t.title} has no items`);
          for (const i of t.items) assert.ok(itemText(i).trim(), `${m.id} ${t.title} has an empty item`);
        }
      }
    }
  });

  test(`${r.slug}: every resource links somewhere real`, () => {
    for (const m of r.phases.flatMap((p) => p.modules)) {
      for (const res of m.resources) {
        assert.doesNotThrow(() => new URL(res.url), `${m.id} ${res.title}: bad url`);
        assert.match(res.url, /^https:\/\//, `${m.id} ${res.title}: not https`);
      }
    }
  });
}
