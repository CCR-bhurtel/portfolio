"use client";

import { useEffect, useRef, useState } from "react";
import { askSuggestions, site } from "@/lib/content";

// Mirrors lib/ask-config.ts; the server enforces both again
const QUESTION_MAX = 300;
const SESSION_MAX = 8;

type Source = { title: string; href: string };
type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
  sources?: Source[];
  // Set on failures: the question to send again
  retry?: string;
};

// A failed exchange (the question and its error bubble) is shown once, then
// dropped: it is neither resent as history nor kept when the visitor retries.
const withoutFailures = (list: Message[]) =>
  list.filter((m, i) => !m.retry && !list[i + 1]?.retry);

const monoLabel = "font-mono text-[11px] uppercase tracking-[.16em]";
const OFFLINE = `I couldn't reach the server. Check your connection and try again, or email Shishir at ${site.email}`;

export default function Ask() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);
  const [heroDraft, setHeroDraft] = useState("");
  const [draft, setDraft] = useState("");

  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const nextId = useRef(1);

  const asked = messages.filter((m) => m.role === "user").length;
  const capped = asked >= SESSION_MAX;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, pending]);

  async function ask(raw: string) {
    const question = raw.replace(/\s+/g, " ").trim().slice(0, QUESTION_MAX);
    if (question.length < 2 || pending || capped) return;

    if (!dialogRef.current?.open) dialogRef.current?.showModal();
    inputRef.current?.focus();

    const history = withoutFailures(messages)
      .slice(-4)
      .map(({ role, text }) => ({ role, text }));
    setMessages((prev) => [
      ...withoutFailures(prev),
      { id: nextId.current++, role: "user", text: question },
    ]);
    setPending(true);

    const controller = new AbortController();
    abortRef.current = controller;
    let reply: Omit<Message, "id" | "role">;
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history }),
        signal: controller.signal,
      });
      const data = await res.json().catch(() => null);
      reply =
        res.ok && typeof data?.answer === "string"
          ? { text: data.answer, sources: data.sources ?? [] }
          : { text: data?.message ?? OFFLINE, retry: question };
    } catch {
      if (controller.signal.aborted) {
        // Dialog closed mid-request: drop the unanswered question
        setMessages((prev) => prev.slice(0, -1));
        setPending(false);
        return;
      }
      reply = { text: OFFLINE, retry: question };
    }
    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, role: "assistant", ...reply },
    ]);
    setPending(false);
  }

  const close = () => dialogRef.current?.close();

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(heroDraft);
          setHeroDraft("");
        }}
        className="mx-auto mt-8 max-w-[640px] text-left"
      >
        <label
          htmlFor="ask-hero"
          className={`flex items-center justify-between gap-4 text-ash ${monoLabel}`}
        >
          <span className="inline-flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 bg-accent" />
            Ask my AI assistant
          </span>
          <span className="hidden text-smoke sm:inline">
            Answers from my site &amp; resume
          </span>
        </label>
        <div className="mt-3 flex rounded border-[1.5px] border-paper/25 bg-paper/[.04] backdrop-blur-sm transition-colors focus-within:border-accent-soft">
          <input
            id="ask-hero"
            value={heroDraft}
            onChange={(e) => setHeroDraft(e.target.value)}
            maxLength={QUESTION_MAX}
            autoComplete="off"
            placeholder="Ask anything about me…"
            className="min-w-0 flex-1 bg-transparent px-4 py-[15px] font-inter text-base text-paper outline-none focus-visible:outline-none placeholder:text-smoke"
          />
          <button
            type="submit"
            aria-label="Ask"
            className="m-1.5 grid w-12 flex-none place-items-center rounded-sm bg-accent font-mono text-[15px] text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            ↗
          </button>
        </div>
        <ul className="mt-3 flex flex-wrap justify-center gap-2">
          {askSuggestions.map((q) => (
            <li key={q}>
              <button
                type="button"
                onClick={() => ask(q)}
                className="rounded border border-paper/15 px-3 py-1.5 font-inter text-[13px] text-ash transition-colors hover:border-accent-soft hover:text-paper"
              >
                {q}
              </button>
            </li>
          ))}
        </ul>
      </form>

      <dialog
        ref={dialogRef}
        aria-labelledby="ask-title"
        onClick={(e) => e.target === e.currentTarget && close()}
        onClose={() => abortRef.current?.abort()}
        className="project-dialog m-auto h-[min(680px,88vh)] w-[min(720px,calc(100%-24px))] flex-col overflow-hidden rounded border-[1.5px] border-ink bg-paper p-0 text-left text-ink open:flex"
      >
        <div className="flex flex-none items-center justify-between gap-5 bg-ink px-6 py-[18px] text-paper">
          <h2
            id="ask-title"
            className={`inline-flex items-center gap-2.5 font-normal text-ash ${monoLabel}`}
          >
            <span className="inline-block h-2 w-2 bg-accent" />
            Ask about Shishir · AI assistant
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close chat"
            className="h-[38px] w-[38px] rounded-full border-[1.5px] border-paper/30 font-mono text-[15px] transition-colors hover:border-accent hover:bg-accent"
          >
            ✕
          </button>
        </div>

        <div
          ref={scrollRef}
          aria-live="polite"
          className="flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-7"
        >
          {messages.map((m) =>
            m.role === "user" ? (
              <p
                key={m.id}
                className="ml-auto w-fit max-w-[85%] rounded bg-ink px-4 py-3 font-inter text-[15.5px] leading-normal text-paper"
              >
                {m.text}
              </p>
            ) : (
              <div
                key={m.id}
                className="max-w-[92%] rounded border-[1.5px] border-rule bg-white px-5 py-4"
              >
                <p className="whitespace-pre-line font-inter text-[15.5px] leading-[1.6]">
                  {m.text}
                </p>
                {m.retry && (
                  <button
                    type="button"
                    onClick={() => ask(m.retry!)}
                    className="mt-3 border-b-[1.5px] border-current pb-0.5 font-inter text-sm font-medium transition-colors hover:text-accent"
                  >
                    Try again ↻
                  </button>
                )}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-rule pt-3">
                    <span className={`text-muted ${monoLabel}`}>Sources</span>
                    {m.sources.map((s) => (
                      <a
                        key={s.title}
                        href={s.href}
                        onClick={close}
                        className="rounded border-[1.5px] border-rule px-2.5 py-1 font-mono text-xs transition-colors hover:border-accent hover:text-accent"
                      >
                        {s.title} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
          {pending && (
            <div className="flex w-fit items-center gap-1.5 rounded border-[1.5px] border-rule bg-white px-5 py-[18px]">
              <span className="sr-only">Looking that up…</span>
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  aria-hidden="true"
                  style={{ animationDelay: `${delay}ms` }}
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-none border-t-[1.5px] border-rule bg-paper px-5 py-4 sm:px-7">
          {capped ? (
            <a
              href={`mailto:${site.email}`}
              className="flex items-center justify-between rounded bg-ink px-5 py-[15px] font-inter text-[15px] font-medium text-paper transition-colors hover:bg-accent"
            >
              That&rsquo;s the limit for one chat. Email Shishir
              <span className="font-mono">↗</span>
            </a>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(draft);
                setDraft("");
              }}
              className="flex rounded border-[1.5px] border-rule bg-white transition-colors focus-within:border-ink"
            >
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={QUESTION_MAX}
                autoComplete="off"
                aria-label="Your question"
                placeholder="Ask a follow-up…"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 font-inter text-base outline-none focus-visible:outline-none placeholder:text-ash"
              />
              <button
                type="submit"
                disabled={pending || draft.trim().length < 2}
                className="m-1 rounded-sm bg-accent px-4 font-inter text-sm font-medium text-paper transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                Ask
              </button>
            </form>
          )}
          <p className="mt-2.5 flex justify-between gap-4 font-inter text-xs leading-normal text-muted">
            <span>
              AI answers from my site and resume. Email me for anything
              important.
            </span>
            {!capped && (
              <span className="flex-none font-mono">
                {asked}/{SESSION_MAX}
              </span>
            )}
          </p>
        </div>
      </dialog>
    </>
  );
}
