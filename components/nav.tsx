"use client";

import { useEffect, useState } from "react";
import Mark from "@/components/mark";
import { railLinks } from "@/lib/content";

export default function Nav() {
  // The nav sits over the dark hero first, then flips to the light theme
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  const surface = pastHero
    ? "bg-paper border-rule text-ink"
    : "bg-ink/80 border-paper/20 text-paper";

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-[60] hidden w-[86px] flex-col items-center justify-between border-r py-[22px] backdrop-blur-[14px] transition-colors duration-300 rail:flex ${surface}`}
      >
        <a href="#top" aria-label="Shishir Bhurtel — back to top">
          <Mark />
        </a>
        <nav
          aria-label="Sections"
          className="flex flex-col items-center gap-[22px]"
        >
          {railLinks.map((r) => (
            <a
              key={r.href}
              href={r.href}
              className={`rotate-180 py-1.5 font-mono text-[11px] uppercase tracking-[.2em] transition-colors [writing-mode:vertical-rl] hover:text-accent ${
                pastHero ? "text-[#3F4346]" : "text-[#E4E6E2]"
              }`}
            >
              {r.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          aria-label="Get in touch"
          className="grid h-11 w-11 place-items-center rounded-full bg-accent font-mono text-[15px] text-paper transition-transform hover:-translate-y-[3px]"
        >
          ↗
        </a>
      </aside>

      <header
        className={`fixed inset-x-0 top-0 z-[60] flex h-[60px] items-center justify-between border-b px-5 backdrop-blur-[14px] transition-colors duration-300 rail:hidden ${surface}`}
      >
        <a
          href="#top"
          className="inline-flex items-center gap-2.5 text-[17px] font-semibold"
        >
          <Mark />
          Shishir
        </a>
        <a
          href="#contact"
          className="rounded bg-accent px-4 py-2.5 font-inter text-sm font-medium text-paper"
        >
          Get in touch ↗
        </a>
      </header>
    </>
  );
}
