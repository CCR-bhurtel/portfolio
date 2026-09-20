import HeroNetwork from "@/components/hero-network";
import { focusAreas, stack } from "@/lib/content";

const ART_MASK =
  "radial-gradient(ellipse 50% 52% at 50% 34%,#000 0%,#000 55%,rgba(0,0,0,.6) 78%,rgba(0,0,0,.2) 100%)";

export default function Hero() {
  return (
    <>
      <section id="top" className="relative overflow-hidden bg-ink">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[calc(var(--hero-w)*.625)] w-[var(--hero-w)] -translate-x-1/2">
          <div
            className="absolute inset-0"
            style={{ maskImage: ART_MASK, WebkitMaskImage: ART_MASK }}
          >
            <HeroNetwork />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,13,14,.85),rgba(11,13,14,.2)_22%,rgba(11,13,14,.2)_34%,rgba(11,13,14,.92)_48%,#0B0D0E_62%)]" />
        </div>

        <div className="relative px-6 pb-14 pt-[calc(var(--hero-w)*.288)] text-center sm:px-14">
          <div className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.18em] text-ash sm:text-xs">
            <span className="inline-block h-2 w-2 bg-accent" />
            AI engineer · Full-stack developer
            <span className="hidden sm:inline">· Remote</span>
          </div>
          <h1 className="mx-auto mt-5 max-w-[1100px] text-balance text-[clamp(38px,5.85vw,84px)] font-medium leading-[.98] tracking-[-.03em] text-paper">
            I build AI systems
            <br className="hidden sm:block" /> and products that ship.
          </h1>
          <p className="mx-auto mt-[22px] max-w-[660px] font-inter text-[clamp(16px,1.4vw,19px)] leading-normal text-ash">
            I&rsquo;m Shishir Bhurtel. I build LLM agents and RAG pipelines that
            hold up with real users — and the full-stack applications around
            them: Python and FastAPI or Node.js and NestJS backends, React and
            Next.js front ends. Six years shipping production software.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href="#work"
              className="whitespace-nowrap rounded bg-accent px-6 py-[15px] font-inter text-[15px] font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              See the work ↗
            </a>
            <a
              href="#contact"
              className="whitespace-nowrap rounded border-[1.5px] border-paper/30 px-[22px] py-[15px] font-inter text-[15px] font-medium text-paper transition-colors hover:border-paper"
            >
              Tell me what you&rsquo;re building →
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-3 border-t-[1.5px] border-paper/15 pt-5 font-mono text-xs uppercase tracking-[.14em] text-ash">
            {focusAreas.map((area, i) => (
              <li key={area}>
                <span className="mr-3 font-medium text-paper">
                  {String(i + 1).padStart(2, "0")} /
                </span>
                {area}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-label="Tech stack"
        className="overflow-hidden border-t-[1.5px] border-paper/10 bg-ink py-[30px]"
      >
        {/* The list is doubled so the -50% marquee loop is seamless */}
        <div className="marquee flex w-max items-center font-mono text-[13px] uppercase tracking-[.14em] text-smoke">
          {[false, true].map((duplicate) => (
            <ul
              key={String(duplicate)}
              aria-hidden={duplicate}
              className="flex items-center"
            >
              {stack.map((s) => (
                <li
                  key={s}
                  className="mr-14 flex items-center gap-3.5 whitespace-nowrap"
                >
                  <span className="inline-block h-[5px] w-[5px] bg-accent" />
                  {s}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>
    </>
  );
}
