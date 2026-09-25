"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { setDone } from "@/app/learn/actions";
import Drawer from "@/components/learn/drawer";
import SectionLabel from "@/components/section-label";
import {
  allIds,
  countDone,
  exerciseId,
  idsOf,
  moduleIds,
  nodes,
  paragraphs,
  phaseIds,
  resourceId,
  topicCount,
  topicIds,
  topicKey,
  type Module,
  type Node,
  type Phase,
  type Progress,
  type Roadmap,
  type Topic,
} from "@/lib/learn/model";
import { cn } from "@/lib/utils";

const monoLabel = "font-mono text-[11px] uppercase tracking-[.16em]";
const pad = (n: number) => String(n).padStart(2, "0");
const pct = (done: number, total: number) =>
  total ? Math.round((done / total) * 100) : 0;

type NodeState = "done" | "partial" | "none";
const stateOf = (done: number, total: number): NodeState =>
  total > 0 && done === total ? "done" : done > 0 ? "partial" : "none";

// The first topic with unticked items; once every topic is done, the first
// module with unfinished practice or reading
function nextUp(all: Node[], progress: Progress) {
  const open = (ids: string[]) => ids.some((id) => !progress[id]);
  return (
    all.find((n) => n.kind === "topic" && open(idsOf(n))) ??
    all.find(
      (n) =>
        n.kind === "module" &&
        open([
          ...n.module.exercises.map((e) => exerciseId(n.module, e)),
          ...n.module.resources.map((r) => resourceId(n.module, r)),
        ])
    )
  );
}

export default function RoadmapView({
  roadmap,
  initialProgress,
}: {
  roadmap: Roadmap;
  /** null when Redis was unavailable: read-only */
  initialProgress: Progress | null;
}) {
  const readOnly = initialProgress === null;
  const [progress, setProgress] = useState<Progress>(initialProgress ?? {});
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [saveError, setSaveError] = useState(false);

  const all = useMemo(() => nodes(roadmap), [roadmap]);
  const ids = useMemo(() => allIds(roadmap), [roadmap]);
  const done = countDone(ids, progress);
  const next = nextUp(all, progress);

  const open = useCallback((key: string) => {
    setActiveKey(key);
    setSaveError(false);
    history.replaceState(null, "", `#${key}`);
    // Keep the graph in step behind the drawer, so closing lands on the node
    const el = document.getElementById(key);
    const box = el?.getBoundingClientRect();
    if (box && (box.top < 80 || box.bottom > window.innerHeight)) {
      el?.scrollIntoView({ block: "center" });
    }
  }, []);

  const close = () => {
    const key = activeKey;
    setActiveKey(null);
    history.replaceState(null, "", location.pathname + location.search);
    if (key) document.getElementById(key)?.focus({ preventScroll: true });
  };

  // Deep link: /learn/<slug>#1.1/scalability-patterns opens that node
  useEffect(() => {
    const key = decodeURIComponent(location.hash.slice(1));
    if (all.some((n) => n.key === key)) open(key);
  }, [all, open]);

  // Tick at once, then save; a failed save reverts just those ids
  const toggle = async (changed: string[], value: boolean) => {
    if (readOnly || changed.length === 0) return;
    const before = Object.fromEntries(changed.map((id) => [id, progress[id]]));
    const apply = (p: Progress, values: Record<string, number | undefined>) => {
      const nextP = { ...p };
      for (const [id, v] of Object.entries(values)) {
        if (v) nextP[id] = v;
        else delete nextP[id];
      }
      return nextP;
    };
    const now = Date.now();
    setProgress((p) =>
      apply(p, Object.fromEntries(changed.map((id) => [id, value ? now : undefined])))
    );
    setSaveError(false);
    const ok = await setDone(roadmap.slug, changed, value).catch(() => false);
    if (!ok) {
      setProgress((p) => apply(p, before));
      setSaveError(true);
    }
  };

  const index = activeKey ? all.findIndex((n) => n.key === activeKey) : -1;
  const percent = pct(done, ids.length);
  const stats: [string, string][] = [
    ["Phases", pad(roadmap.phases.length)],
    ["Modules", pad(roadmap.phases.reduce((n, p) => n + p.modules.length, 0))],
    ["Topics", pad(topicCount(roadmap))],
    ["Done", `${percent}%`],
  ];

  return (
    <main>
      <section className="relative overflow-clip bg-ink px-6 pb-16 pt-12 text-paper sm:px-8">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -right-6 select-none text-[clamp(180px,28vw,400px)] font-medium leading-none tracking-[-.06em] text-paper/[.04]"
        >
          {percent}%
        </span>
        <div className="relative mx-auto max-w-page">
          <a
            href="/learn"
            className={`text-ash transition-colors hover:text-paper ${monoLabel}`}
          >
            ← All paths
          </a>
          <div className={`mt-10 flex items-center gap-3 text-ash ${monoLabel}`}>
            <span className="inline-block h-2 w-2 bg-accent" />
            Learning path · {roadmap.duration}
          </div>
          <h1 className="mt-5 max-w-[1040px] text-balance text-[clamp(40px,6.2vw,92px)] font-medium leading-[.95] tracking-[-.04em]">
            {roadmap.title}
          </h1>
          <p className="mt-6 max-w-[660px] font-inter text-[17px] leading-[1.55] text-ash">
            {roadmap.summary}
          </p>

          <dl className="mt-12 grid grid-cols-2 border-t-[1.5px] border-paper/15 sm:grid-cols-4">
            {stats.map(([label, value]) => (
              <div key={label} className="py-5 pr-4">
                <dt className={`text-ash ${monoLabel}`}>{label}</dt>
                <dd className="mt-2 text-[clamp(32px,3.4vw,48px)] font-medium leading-none tracking-[-.03em]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="h-2 bg-paper/10">
            <div
              className="h-full bg-accent transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
            {next ? (
              <button
                type="button"
                onClick={() => open(next.key)}
                className="max-w-full rounded bg-accent px-6 py-[15px] text-left font-inter text-[15px] font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                Continue: {next.module.id}{" "}
                {next.kind === "topic" ? next.topic.title : `${next.module.title} practice`} →
              </button>
            ) : (
              <span className="font-inter text-[15px] font-medium">
                Every item is done. Time for a new path.
              </span>
            )}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className={`text-ash ${monoLabel}`}>
                {done} / {ids.length} items
              </span>
              <Legend />
            </div>
          </div>
          {readOnly && (
            <p
              role="status"
              className="mt-6 rounded border-[1.5px] border-[#ff9b9b]/40 px-4 py-3 font-inter text-sm text-[#ffb4b4]"
            >
              Progress couldn&rsquo;t be loaded, so ticking is off for now.
              Reload to try again.
            </p>
          )}
        </div>
      </section>

      {roadmap.phases.map((phase) => (
        <PhaseSection
          key={phase.n}
          phase={phase}
          progress={progress}
          onOpen={open}
        />
      ))}

      <Method roadmap={roadmap} />

      <footer className="border-t-[1.5px] border-rule px-6 py-6 sm:px-8">
        <div
          className={`mx-auto flex max-w-page flex-wrap justify-between gap-4 text-muted ${monoLabel}`}
        >
          <span>Private · only you can see this page</span>
          <a href="/learn" className="transition-colors hover:text-accent">
            All paths →
          </a>
        </div>
      </footer>

      <Drawer
        node={index >= 0 ? all[index] : null}
        prev={index > 0 ? all[index - 1] : null}
        next={index >= 0 && index < all.length - 1 ? all[index + 1] : null}
        progress={progress}
        readOnly={readOnly}
        saveError={saveError}
        onToggle={toggle}
        onNavigate={open}
        onClose={close}
      />
    </main>
  );
}

function Legend() {
  const items: [NodeState, string][] = [
    ["done", "Done"],
    ["partial", "In progress"],
    ["none", "Not started"],
  ];
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-ash ${monoLabel}`}>
      {items.map(([state, label]) => (
        <li key={state} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cn(
              "h-3 w-3 rounded-[2px] border-[1.5px]",
              state === "done" && "border-accent bg-accent",
              state === "partial" && "border-accent bg-paper",
              state === "none" && "border-paper/40 bg-paper"
            )}
          />
          {label}
        </li>
      ))}
    </ul>
  );
}

function PhaseSection({
  phase,
  progress,
  onOpen,
}: {
  phase: Phase;
  progress: Progress;
  onOpen: (key: string) => void;
}) {
  const ids = phaseIds(phase);
  const percent = pct(countDone(ids, progress), ids.length);

  return (
    <section aria-labelledby={`phase-${phase.n}`}>
      <div className="relative overflow-clip border-t-[1.5px] border-paper/10 bg-ink px-6 pb-14 pt-20 text-paper sm:px-8">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 -right-4 select-none text-[clamp(160px,24vw,320px)] font-medium leading-none tracking-[-.06em] text-paper/5"
        >
          {pad(phase.n)}
        </span>
        <div className="relative mx-auto grid max-w-page items-end gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
          <div>
            <SectionLabel num={pad(phase.n)} dark>
              {phase.weeks}
            </SectionLabel>
            <h2
              id={`phase-${phase.n}`}
              className="text-[clamp(34px,4.6vw,66px)] font-medium leading-[.98] tracking-[-.035em]"
            >
              {phase.title}
            </h2>
          </div>
          <div>
            <div className="grid gap-3 font-inter text-[15.5px] leading-[1.6] text-ash">
              {paragraphs(phase.summary).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-1.5 flex-1 bg-paper/10">
                <div
                  className="h-full bg-accent transition-[width] duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className={`text-ash ${monoLabel}`}>{percent}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-10 sm:px-8 lg:py-14">
        <div className="relative mx-auto max-w-page">
          {/* The spine: modules sit on it, topics branch off it */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-3 w-[2px] -translate-x-1/2 bg-ink before:absolute before:-top-1 before:left-1/2 before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:rounded-full before:bg-ink after:absolute after:-bottom-1 after:left-1/2 after:h-2.5 after:w-2.5 after:-translate-x-1/2 after:rounded-full after:bg-ink lg:left-1/2"
          />
          {phase.modules.map((m) => (
            <ModuleRow key={m.id} module={m} progress={progress} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ModuleRow({
  module: m,
  progress,
  onOpen,
}: {
  module: Module;
  progress: Progress;
  onOpen: (key: string) => void;
}) {
  const ids = moduleIds(m);
  const done = countDone(ids, progress);
  const state = stateOf(done, ids.length);
  // Contiguous halves, so reading order stays 1..n on every screen size
  const half = Math.ceil(m.topics.length / 2);

  return (
    <div className="grid gap-y-1 py-5 lg:grid-cols-[minmax(0,1fr)_280px_minmax(0,1fr)] lg:items-center lg:gap-x-12 lg:py-7">
      <button
        id={m.id}
        type="button"
        onClick={() => onOpen(m.id)}
        className={cn(
          "relative z-10 ml-8 block scroll-mt-28 rounded border-[1.5px] px-5 py-4 text-left text-paper transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5 lg:col-start-2 lg:row-start-1 lg:ml-0",
          "before:absolute before:right-full before:top-1/2 before:h-[2px] before:w-[22px] before:-translate-y-1/2 before:bg-ink lg:before:hidden",
          state === "done"
            ? "border-accent bg-accent"
            : "border-ink bg-ink hover:border-accent"
        )}
      >
        <span
          className={cn(
            "flex items-center justify-between gap-3",
            monoLabel,
            state === "done" ? "text-paper/80" : "text-ash"
          )}
        >
          <span>{m.id} · Module</span>
          <span>{state === "done" ? "✓ Done" : `${done}/${ids.length}`}</span>
        </span>
        <span className="mt-2 block text-[20px] font-medium leading-[1.12] tracking-[-.02em]">
          {m.title}
        </span>
        <span className="mt-4 block h-1 bg-paper/15">
          <span
            className={cn(
              "block h-full transition-[width] duration-500",
              state === "done" ? "bg-paper" : "bg-accent-soft"
            )}
            style={{ width: `${pct(done, ids.length)}%` }}
          />
        </span>
      </button>

      {[m.topics.slice(0, half), m.topics.slice(half)].map(
        (topics, side) =>
          topics.length > 0 && (
            <TopicStack
              key={side}
              side={side === 0 ? "left" : "right"}
              module={m}
              topics={topics}
              progress={progress}
              onOpen={onOpen}
            />
          )
      )}
    </div>
  );
}

// Connectors: each <li> draws its own stub plus its slice of a vertical
// bracket (clipped at the first and last node's centre), and the <ul> adds
// one stub from the bracket to the module node. Both are vertically centred,
// so they meet whatever the node count or title length.
function TopicStack({
  side,
  module: m,
  topics,
  progress,
  onOpen,
}: {
  side: "left" | "right";
  module: Module;
  topics: Topic[];
  progress: Progress;
  onOpen: (key: string) => void;
}) {
  const left = side === "left";
  return (
    <ul
      className={cn(
        "relative lg:row-start-1 lg:self-center",
        "lg:after:absolute lg:after:top-1/2 lg:after:h-[1.5px] lg:after:w-12 lg:after:bg-ink/30",
        left
          ? "lg:col-start-1 lg:justify-self-end lg:after:left-full"
          : "lg:col-start-3 lg:justify-self-start lg:after:right-full"
      )}
    >
      {topics.map((t) => {
        const key = topicKey(m, t);
        const ids = topicIds(m, t);
        const done = countDone(ids, progress);
        const state = stateOf(done, ids.length);
        return (
          <li
            key={key}
            className={cn(
              "relative py-1 pl-14 lg:pl-0",
              "after:absolute after:left-3 after:top-1/2 after:h-[1.5px] after:w-11 after:bg-ink/30 lg:after:w-6",
              "lg:before:absolute lg:before:inset-y-0 lg:before:w-[1.5px] lg:before:bg-ink/30 lg:first:before:top-1/2 lg:last:before:bottom-1/2",
              left
                ? "lg:pr-6 lg:before:right-0 lg:after:left-auto lg:after:right-0"
                : "lg:pl-6 lg:before:left-0 lg:after:left-0"
            )}
          >
            <button
              id={key}
              type="button"
              onClick={() => onOpen(key)}
              className={cn(
                "relative z-10 flex w-full scroll-mt-28 items-center justify-between gap-3 overflow-hidden rounded border-[1.5px] px-4 py-3 text-left transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 lg:w-[260px]",
                state === "done" && "border-accent bg-accent text-paper",
                state === "partial" && "border-accent bg-white",
                state === "none" && "border-rule bg-white hover:border-ink"
              )}
            >
              <span className="text-[15.5px] font-medium leading-snug tracking-[-.01em]">
                {t.title}
              </span>
              <span
                className={cn(
                  "flex-none font-mono text-[11px] tracking-[.08em]",
                  state === "done" && "text-paper",
                  state === "partial" && "text-accent",
                  state === "none" && "text-muted"
                )}
              >
                {state === "done" ? "✓" : `${done}/${ids.length}`}
              </span>
              {state === "partial" && (
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-accent/15">
                  <span
                    className="block h-full bg-accent"
                    style={{ width: `${pct(done, ids.length)}%` }}
                  />
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Method({ roadmap }: { roadmap: Roadmap }) {
  return (
    <section className="border-t-[1.5px] border-rule bg-paper px-6 py-[100px] sm:px-8">
      <div className="mx-auto max-w-page">
        <SectionLabel num={pad(roadmap.phases.length + 1)}>
          How to study
        </SectionLabel>
        <h2 className="text-[clamp(34px,4.2vw,58px)] font-medium leading-none tracking-[-.03em]">
          Go deep on
          <br />
          every topic.
        </h2>
        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-x-10 gap-y-12">
          {roadmap.method.map((m, i) => (
            <div key={m.title}>
              <span className="font-serif text-[40px] leading-[.9] text-accent">
                {pad(i + 1)}
              </span>
              <h3 className="mt-4 text-[23px] font-medium leading-[1.15] tracking-[-.02em]">
                {m.title}
              </h3>
              <ul className="mt-4 grid gap-2 border-t border-rule pt-3.5 font-inter text-[15px] leading-normal text-muted">
                {m.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
