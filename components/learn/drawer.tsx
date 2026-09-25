"use client";

import { useEffect, useRef } from "react";
import {
  countDone,
  exerciseId,
  idsOf,
  itemId,
  itemText,
  paragraphs,
  resourceId,
  topicIds,
  topicKey,
  type Item,
  type Module,
  type Node,
  type Progress,
  type Topic,
} from "@/lib/learn/model";
import { cn } from "@/lib/utils";

const monoLabel = "font-mono text-[11px] uppercase tracking-[.16em]";
const pad = (n: number) => String(n).padStart(2, "0");
// Only ever rendered on the client (the drawer opens after mount), so the
// viewer's locale and timezone can't cause a hydration mismatch
const day = (ts: number) =>
  new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });

type Props = {
  node: Node | null;
  prev: Node | null;
  next: Node | null;
  progress: Progress;
  readOnly: boolean;
  saveError: boolean;
  onToggle: (ids: string[], done: boolean) => void;
  onNavigate: (key: string) => void;
  onClose: () => void;
};

export default function Drawer(props: Props) {
  const { node, prev, next, onNavigate, onClose } = props;
  const ref = useRef<HTMLDialogElement>(null);

  // Native modal dialog: focus trap, Escape and the backdrop come for free.
  // The open guard keeps StrictMode's double effect from throwing.
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (node && !d.open) d.showModal();
    if (!node && d.open) d.close();
  }, [node]);

  // The body remounts per node, dropping focus to <body>; move it to the new
  // title so the arrow keys keep working and screen readers hear the change
  useEffect(() => {
    const d = ref.current;
    if (!d?.open) return;
    d.scrollTo(0, 0);
    d.querySelector<HTMLElement>("#learn-drawer-title")?.focus({ preventScroll: true });
  }, [node?.key]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const to = e.key === "ArrowRight" ? next : e.key === "ArrowLeft" ? prev : null;
    if (to) {
      e.preventDefault();
      onNavigate(to.key);
    }
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby="learn-drawer-title"
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="learn-drawer fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-[min(620px,100%)] max-w-none overflow-y-auto overscroll-contain border-0 border-l-[1.5px] border-ink bg-paper p-0 text-ink"
    >
      {node && <Body {...props} node={node} close={() => ref.current?.close()} />}
    </dialog>
  );
}

function Body({
  node,
  prev,
  next,
  progress,
  readOnly,
  saveError,
  onToggle,
  onNavigate,
  close,
}: Props & { node: Node; close: () => void }) {
  const { phase, module: m } = node;
  const ids = idsOf(node);
  const done = countDone(ids, progress);
  const allDone = done === ids.length;
  const title = node.kind === "topic" ? node.topic.title : m.title;
  const summary = node.kind === "topic" ? node.topic.summary : m.summary;

  return (
    <div className="flex min-h-full flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-ink px-6 py-4 text-paper sm:px-8">
        <span className={`inline-flex items-center gap-2.5 text-ash ${monoLabel}`}>
          <span className="inline-block h-2 w-2 bg-accent" />
          Phase {pad(phase.n)} · {m.id} ·{" "}
          {node.kind === "topic"
            ? `Topic ${node.index + 1} of ${m.topics.length}`
            : "Module"}
        </span>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="h-[38px] w-[38px] flex-none rounded-full border-[1.5px] border-paper/30 font-mono text-[15px] transition-colors hover:border-accent hover:bg-accent"
        >
          ✕
        </button>
      </div>

      <div key={node.key} className="learn-drawer-body flex-1 px-6 pb-14 pt-8 sm:px-8">
        {node.kind === "topic" && (
          <button
            type="button"
            onClick={() => onNavigate(m.id)}
            className={`text-left text-muted transition-colors hover:text-accent ${monoLabel}`}
          >
            ↑ {m.id} {m.title}
          </button>
        )}
        <h2
          id="learn-drawer-title"
          tabIndex={-1}
          className="mt-3 text-[clamp(30px,4vw,44px)] font-medium leading-[1.02] tracking-[-.03em] focus-visible:outline-none"
        >
          {title}
        </h2>
        <div className="mt-5 grid gap-3 font-inter text-[16.5px] leading-[1.65] text-muted">
          {paragraphs(summary).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="h-1.5 min-w-[140px] flex-1 bg-rule">
            <div
              className="h-full bg-accent transition-[width] duration-300"
              style={{ width: `${ids.length ? (done / ids.length) * 100 : 0}%` }}
            />
          </div>
          <span className={`text-muted ${monoLabel}`}>
            {done} / {ids.length} done
          </span>
          {node.kind === "topic" && !readOnly && (
            <button
              type="button"
              onClick={() =>
                allDone
                  ? onToggle(ids, false)
                  : onToggle(ids.filter((id) => !progress[id]), true)
              }
              className={`text-accent transition-colors hover:text-ink ${monoLabel}`}
            >
              {allDone ? "Clear all" : "Mark all done"}
            </button>
          )}
        </div>
        {saveError && (
          <p role="alert" className="mt-4 font-inter text-sm text-[#c93a3a]">
            Couldn&rsquo;t save that. Check your connection and try again.
          </p>
        )}
        {readOnly && (
          <p role="status" className="mt-4 font-inter text-sm text-muted">
            Progress is unavailable right now, so ticking is off.
          </p>
        )}

        {node.kind === "topic" ? (
          <ItemList
            module={m}
            topic={node.topic}
            progress={progress}
            readOnly={readOnly}
            onToggle={onToggle}
          />
        ) : (
          <ModuleBody
            module={m}
            progress={progress}
            readOnly={readOnly}
            onToggle={onToggle}
            onNavigate={onNavigate}
          />
        )}
      </div>

      <nav
        aria-label="Roadmap"
        className="sticky bottom-0 grid grid-cols-2 border-t-[1.5px] border-rule bg-paper"
      >
        <Step node={prev} dir="prev" onNavigate={onNavigate} />
        <Step node={next} dir="next" onNavigate={onNavigate} />
      </nav>
    </div>
  );
}

function Step({
  node,
  dir,
  onNavigate,
}: {
  node: Node | null;
  dir: "prev" | "next";
  onNavigate: (key: string) => void;
}) {
  const nextSide = dir === "next";
  return (
    <button
      type="button"
      disabled={!node}
      onClick={() => node && onNavigate(node.key)}
      className={cn(
        "group min-w-0 px-6 py-4 transition-colors enabled:hover:bg-white disabled:opacity-40 sm:px-8",
        nextSide ? "border-l-[1.5px] border-rule text-right" : "text-left"
      )}
    >
      <span className={`block text-muted ${monoLabel}`}>
        {nextSide ? "Next →" : "← Prev"}
      </span>
      <span className="mt-1 block truncate text-[15px] font-medium group-enabled:group-hover:text-accent">
        {node
          ? `${node.module.id} ${node.kind === "topic" ? node.topic.title : node.module.title}`
          : "—"}
      </span>
    </button>
  );
}

function Check({
  id,
  checked,
  disabled,
  label,
  onChange,
}: {
  id: string;
  checked: boolean;
  disabled: boolean;
  label?: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <span className="relative mt-[3px] grid h-5 w-5 flex-none place-items-center">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-label={label}
        onChange={(e) => onChange(e.target.checked)}
        className="peer absolute inset-0 m-0 cursor-pointer appearance-none rounded-[3px] border-[1.5px] border-ink/35 bg-white transition-colors checked:border-accent checked:bg-accent enabled:hover:border-ink enabled:checked:hover:border-accent disabled:cursor-not-allowed disabled:opacity-50"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className="pointer-events-none relative h-3 w-3 text-paper opacity-0 transition-opacity peer-checked:opacity-100"
      >
        <path
          d="M2.5 6.5 5 9l4.5-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// "Name: explanation" bullets get a bold name
function Sub({ text }: { text: string }) {
  const at = text.indexOf(": ");
  if (at < 1 || at > 48) return <>{text}</>;
  return (
    <>
      <span className="font-medium text-ink">{text.slice(0, at)}</span>
      {text.slice(at)}
    </>
  );
}

function Done({ ts }: { ts?: number }) {
  if (!ts) return null;
  return (
    <span className="flex-none font-mono text-[10.5px] uppercase tracking-[.14em] text-accent">
      Done {day(ts)}
    </span>
  );
}

type ListProps = {
  module: Module;
  progress: Progress;
  readOnly: boolean;
  onToggle: (ids: string[], done: boolean) => void;
};

function ItemList({ module: m, topic, progress, readOnly, onToggle }: ListProps & { topic: Topic }) {
  return (
    <ul className="mt-8 border-b border-rule">
      {topic.items.map((item: Item) => {
        const id = itemId(m, topic, item);
        const ts = progress[id];
        const detail = typeof item === "string" ? undefined : item;
        return (
          <li key={id} className="flex gap-3.5 border-t border-rule py-4">
            <Check
              id={`cb-${id}`}
              checked={!!ts}
              disabled={readOnly}
              onChange={(v) => onToggle([id], v)}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <label
                  htmlFor={`cb-${id}`}
                  className={cn(
                    "cursor-pointer text-[17px] font-medium leading-snug tracking-[-.01em]",
                    ts && "text-muted"
                  )}
                >
                  {itemText(item)}
                </label>
                <Done ts={ts} />
              </div>
              {detail?.d && (
                <p className="mt-1.5 font-inter text-[15px] leading-[1.6] text-muted">
                  {detail.d}
                </p>
              )}
              {detail?.sub && (
                <ul className="mt-3 grid gap-2 border-l-[1.5px] border-rule pl-4 font-inter text-[14.5px] leading-[1.55] text-muted">
                  {detail.sub.map((s) => (
                    <li key={s}>
                      <Sub text={s} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Block({
  title,
  count,
  children,
}: {
  title: string;
  count?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h3 className={`flex justify-between gap-4 text-muted ${monoLabel}`}>
        {title}
        {count && <span>{count}</span>}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ModuleBody({
  module: m,
  progress,
  readOnly,
  onToggle,
  onNavigate,
}: ListProps & { onNavigate: (key: string) => void }) {
  const exIds = m.exercises.map((e) => exerciseId(m, e));
  const resIds = m.resources.map((r) => resourceId(m, r));

  return (
    <>
      <Block title="Topics">
        <ol className="border-b border-rule">
          {m.topics.map((t, i) => {
            const ids = topicIds(m, t);
            const done = countDone(ids, progress);
            return (
              <li key={t.title} className="border-t border-rule">
                <button
                  type="button"
                  onClick={() => onNavigate(topicKey(m, t))}
                  className="group flex w-full items-center gap-4 py-3.5 text-left"
                >
                  <span className="w-7 flex-none font-serif text-[24px] leading-none text-accent">
                    {pad(i + 1)}
                  </span>
                  <span className="flex-1 text-[16.5px] font-medium leading-snug tracking-[-.01em] transition-colors group-hover:text-accent">
                    {t.title}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[11px] tracking-[.08em]",
                      done === ids.length ? "text-accent" : "text-muted"
                    )}
                  >
                    {done === ids.length ? "✓" : `${done}/${ids.length}`}
                  </span>
                  <span className="text-accent transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </Block>

      {m.mentalModels.length > 0 && (
        <Block title="Mental models">
          <ul className="grid gap-3">
            {m.mentalModels.map((x) => (
              <li
                key={x}
                className="border-l-2 border-accent pl-4 text-[16.5px] font-medium leading-snug tracking-[-.01em]"
              >
                {x}
              </li>
            ))}
          </ul>
        </Block>
      )}

      {m.exercises.length > 0 && (
        <Block title="Practice" count={`${countDone(exIds, progress)}/${exIds.length}`}>
          <ul className="border-b border-rule">
            {m.exercises.map((e, i) => {
              const id = exIds[i];
              return (
                <li key={id} className="flex gap-3.5 border-t border-rule py-4">
                  <Check
                    id={`cb-${id}`}
                    checked={!!progress[id]}
                    disabled={readOnly}
                    onChange={(v) => onToggle([id], v)}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <label
                        htmlFor={`cb-${id}`}
                        className="cursor-pointer text-[17px] font-medium leading-snug tracking-[-.01em]"
                      >
                        {e.title}
                      </label>
                      <Done ts={progress[id]} />
                    </div>
                    {e.d && (
                      <p className="mt-1.5 font-inter text-[15px] leading-[1.6] text-muted">
                        {e.d}
                      </p>
                    )}
                    <ol className="mt-3 grid list-decimal gap-1.5 pl-5 font-inter text-[14.5px] leading-[1.55] text-muted marker:font-mono marker:text-[12px] marker:text-accent">
                      {e.steps.map((s) => (
                        <li key={s} className="pl-1">
                          {s}
                        </li>
                      ))}
                    </ol>
                  </div>
                </li>
              );
            })}
          </ul>
        </Block>
      )}

      {m.resources.length > 0 && (
        <Block title="Resources" count={`${countDone(resIds, progress)}/${resIds.length}`}>
          <ul className="border-b border-rule">
            {m.resources.map((r, i) => {
              const id = resIds[i];
              return (
                <li key={id} className="flex gap-3.5 border-t border-rule py-4">
                  <Check
                    id={`cb-${id}`}
                    checked={!!progress[id]}
                    disabled={readOnly}
                    label={`Done: ${r.title}`}
                    onChange={(v) => onToggle([id], v)}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-[3px] border-[1.5px] border-rule bg-white px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[.12em] text-muted">
                        {r.kind}
                      </span>
                      {r.free && (
                        <span className="rounded-[3px] border-[1.5px] border-accent/30 px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[.12em] text-accent">
                          Free
                        </span>
                      )}
                      <span className="ml-auto">
                        <Done ts={progress[id]} />
                      </span>
                    </div>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-[16.5px] font-medium leading-snug tracking-[-.01em] transition-colors hover:text-accent"
                    >
                      {r.title} <span className="text-accent">↗</span>
                    </a>
                    {r.note && (
                      <p className="mt-1 font-inter text-[14.5px] leading-[1.55] text-muted">
                        {r.note}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Block>
      )}
    </>
  );
}
