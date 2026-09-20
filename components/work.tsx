"use client";

import { useRef, useState } from "react";
import SectionLabel from "@/components/section-label";
import { projects } from "@/lib/content";

const monoLabel = "font-mono text-[11px] uppercase tracking-[.16em]";

export default function Work() {
  const [active, setActive] = useState(projects[0]);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = (i: number) => {
    setActive(projects[i]);
    dialogRef.current?.showModal();
    dialogRef.current?.scrollTo(0, 0);
  };
  const close = () => dialogRef.current?.close();

  return (
    <section id="work" className="overflow-hidden bg-ink pb-[120px] pt-[110px] text-paper">
      <div className="mx-auto flex max-w-[1384px] flex-wrap items-end justify-between gap-8 px-6 sm:px-8">
        <div>
          <SectionLabel num="02" dark>
            Selected work · {String(projects.length).padStart(2, "0")}
          </SectionLabel>
          <h2
            data-rv="d1"
            className="text-[clamp(38px,5vw,72px)] font-medium leading-[.98] tracking-[-.035em]"
          >
            Things I&rsquo;ve built.
          </h2>
        </div>
        <p
          data-rv="d2"
          className="max-w-[380px] font-inter text-base leading-[1.55] text-ash"
        >
          AI products first, then the systems work underneath them. Open any
          project for the problem, the build and the links.
        </p>
      </div>

      <div className="rail-scroll mt-14 snap-x snap-mandatory overflow-x-auto overflow-y-hidden px-6 pb-7 sm:px-8">
        <ul className="mx-auto flex w-max min-w-[min(1320px,100%)] gap-0.5">
          {projects.map((pr, i) => {
            const dark = i % 2 === 0;
            const mutedText = dark ? "text-ash" : "text-muted";
            return (
              <li key={pr.name} className="flex-none snap-center">
                <button
                  type="button"
                  onClick={() => open(i)}
                  aria-haspopup="dialog"
                  className={`group relative flex h-[540px] w-[min(420px,78vw)] flex-col justify-between overflow-hidden border-l-[1.5px] border-paper/15 px-[30px] py-8 text-left ${
                    dark ? "bg-coal text-paper" : "bg-paper text-ink"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -bottom-10 -right-[18px] text-[220px] font-medium leading-none tracking-[-.06em] ${
                      dark ? "text-paper/5" : "text-ink/5"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`relative flex items-center justify-between ${monoLabel} ${mutedText}`}
                  >
                    <span>{pr.kind}</span>
                    <span>{pr.year}</span>
                  </span>
                  <span className="relative">
                    <span className="block text-[clamp(30px,3.4vw,42px)] font-medium leading-[1.02] tracking-[-.03em]">
                      {pr.name}
                    </span>
                    <span
                      className={`mt-3.5 block max-w-[330px] font-inter text-base leading-[1.55] ${mutedText}`}
                    >
                      {pr.tagline}
                    </span>
                  </span>
                  <span
                    className={`relative flex items-center justify-between gap-4 border-t-[1.5px] pt-[18px] ${
                      dark ? "border-paper/20" : "border-rule"
                    }`}
                  >
                    <span
                      className={`font-mono text-[11px] uppercase tracking-[.12em] ${mutedText}`}
                    >
                      {pr.tech.slice(0, 3).join(" · ")}
                    </span>
                    <span
                      className={`inline-flex flex-none items-center gap-2 whitespace-nowrap transition-transform group-hover:translate-x-1 ${monoLabel} ${
                        dark ? "text-accent-soft" : "text-accent"
                      }`}
                    >
                      Open ↗
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={`mx-auto max-w-[1384px] px-6 text-smoke sm:px-8 ${monoLabel}`}>
        ← Drag or scroll the rail →
      </div>

      {/* Native dialog: focus trap, Escape and the backdrop come for free */}
      <dialog
        ref={dialogRef}
        aria-labelledby="project-title"
        onClick={(e) => e.target === e.currentTarget && close()}
        className="project-dialog m-auto max-h-[86vh] w-[min(920px,calc(100%-32px))] overflow-auto rounded border-[1.5px] border-ink bg-paper p-0 text-ink"
      >
        <div className="sticky top-0 flex items-center justify-between gap-5 bg-ink px-7 py-[22px] text-paper">
          <span className={`inline-flex items-center gap-2.5 text-ash ${monoLabel}`}>
            <span className="inline-block h-2 w-2 bg-accent" />
            {active.kind} · {active.year}
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Close project"
            className="h-[38px] w-[38px] rounded-full border-[1.5px] border-paper/30 font-mono text-[15px] transition-colors hover:border-accent hover:bg-accent"
          >
            ✕
          </button>
        </div>
        <div className="px-7 pb-10 pt-9">
          <h3
            id="project-title"
            className="text-[clamp(30px,4vw,48px)] font-medium leading-none tracking-[-.03em]"
          >
            {active.name}
          </h3>
          <p className="mt-4 max-w-[640px] font-inter text-[19px] leading-normal text-muted">
            {active.tagline}
          </p>
          {active.links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {active.links.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2.5 rounded border-[1.5px] px-[22px] py-3.5 font-inter text-[15px] font-medium ${
                    i === 0
                      ? "border-accent bg-accent text-paper"
                      : "border-rule bg-white text-ink"
                  }`}
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}

          <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-8 border-t-[1.5px] border-rule pt-6">
            <div>
              <h4 className={`font-normal text-muted ${monoLabel}`}>The problem</h4>
              <p className="mt-2.5 font-inter text-base leading-[1.6]">
                {active.problem}
              </p>
            </div>
            <div>
              <h4 className={`font-normal text-muted ${monoLabel}`}>What I built</h4>
              <p className="mt-2.5 font-inter text-base leading-[1.6]">
                {active.built}
              </p>
            </div>
          </div>

          <div className="mt-7 border-t-[1.5px] border-rule pt-6">
            <h4 className={`font-normal text-muted ${monoLabel}`}>Highlights</h4>
            <ul className="mt-3.5 grid gap-2.5">
              {active.highlights.map((hl) => (
                <li
                  key={hl}
                  className="flex gap-3 font-inter text-base leading-normal"
                >
                  <span aria-hidden="true" className="font-mono text-accent">
                    ✓
                  </span>
                  {hl}
                </li>
              ))}
            </ul>
          </div>

          <ul className="mt-7 flex flex-wrap gap-2 border-t-[1.5px] border-rule pt-6">
            {active.tech.map((t) => (
              <li
                key={t}
                className="rounded border-[1.5px] border-rule bg-white px-[13px] py-[9px] font-mono text-xs tracking-[.06em]"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </section>
  );
}
