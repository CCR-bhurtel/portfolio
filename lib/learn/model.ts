// The shape of a learning roadmap and the pure helpers the server and the
// client share. No roadmap content is imported here, so nothing private ends
// up in a public JS chunk: content only reaches the browser as page props,
// after the owner check.

/** A checkable thing to learn. `t` is short (it becomes the id), `d` is a
 *  one-line explanation, `sub` holds detail bullets ("Name: explanation").
 *  Set `id` to keep a tick when you reword `t`. */
export type Item = string | { t: string; d?: string; sub?: string[]; id?: string };

export type Topic = {
  title: string;
  /** Paragraphs separated by a blank line */
  summary: string;
  items: Item[];
};

export type Exercise = { title: string; d?: string; steps: string[] };

export type ResourceKind =
  | "book"
  | "course"
  | "article"
  | "paper"
  | "docs"
  | "video"
  | "practice";

export type Resource = {
  kind: ResourceKind;
  title: string;
  url: string;
  free?: boolean;
  note?: string;
};

export type Module = {
  /** "1.1" */
  id: string;
  title: string;
  summary: string;
  topics: Topic[];
  mentalModels: string[];
  exercises: Exercise[];
  resources: Resource[];
};

export type Phase = {
  n: number;
  title: string;
  weeks: string;
  summary: string;
  modules: Module[];
};

export type Roadmap = {
  slug: string;
  title: string;
  summary: string;
  duration: string;
  phases: Phase[];
  /** How to study: shown after the graph, not tracked */
  method: { title: string; points: string[] }[];
};

/** Item id → completion time (epoch ms) */
export type Progress = Record<string, number>;

export const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
    .slice(0, 60)
    .replace(/-+$/, "");

export const itemText = (i: Item) => (typeof i === "string" ? i : i.t);

export const topicKey = (m: Module, t: Topic) => `${m.id}/${slug(t.title)}`;
export const itemId = (m: Module, t: Topic, i: Item) =>
  `${topicKey(m, t)}/${typeof i !== "string" && i.id ? i.id : slug(itemText(i))}`;
export const exerciseId = (m: Module, e: Exercise) => `${m.id}/x/${slug(e.title)}`;
export const resourceId = (m: Module, r: Resource) => `${m.id}/r/${slug(r.title)}`;

export type Node =
  | { kind: "module"; key: string; phase: Phase; module: Module }
  | {
      kind: "topic";
      key: string;
      phase: Phase;
      module: Module;
      topic: Topic;
      /** position within the module, from 0 */
      index: number;
    };

export const topicIds = (m: Module, t: Topic) => t.items.map((i) => itemId(m, t, i));

export const moduleIds = (m: Module) => [
  ...m.topics.flatMap((t) => topicIds(m, t)),
  ...m.exercises.map((e) => exerciseId(m, e)),
  ...m.resources.map((r) => resourceId(m, r)),
];

export const idsOf = (n: Node) =>
  n.kind === "module" ? moduleIds(n.module) : topicIds(n.module, n.topic);

export const phaseIds = (p: Phase) => p.modules.flatMap(moduleIds);
export const allIds = (r: Roadmap) => r.phases.flatMap(phaseIds);

/** Every node in reading order: a module, then its topics */
export const nodes = (r: Roadmap): Node[] =>
  r.phases.flatMap((phase) =>
    phase.modules.flatMap((module) => [
      { kind: "module" as const, key: module.id, phase, module },
      ...module.topics.map((topic, index) => ({
        kind: "topic" as const,
        key: topicKey(module, topic),
        phase,
        module,
        topic,
        index,
      })),
    ])
  );

export const countDone = (ids: string[], progress: Progress) =>
  ids.reduce((n, id) => n + (progress[id] ? 1 : 0), 0);

/** Summaries hold paragraphs separated by a blank line */
export const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

export const topicCount = (r: Roadmap) =>
  r.phases.reduce(
    (n, p) => n + p.modules.reduce((k, m) => k + m.topics.length, 0),
    0
  );
