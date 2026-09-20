import SectionLabel from "@/components/section-label";
import { stats } from "@/lib/content";

export default function About() {
  return (
    <section id="about" className="bg-paper px-6 pb-24 pt-[120px] sm:px-8">
      <div className="mx-auto grid max-w-page grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-start gap-16">
        <div>
          <SectionLabel num="01">About</SectionLabel>
          <h2
            data-rv="d1"
            className="text-[clamp(26px,3vw,42px)] font-medium leading-[1.14] tracking-[-.025em]"
          >
            Most AI features stall somewhere between the demo and production.{" "}
            <span className="text-muted">
              I work in that gap — the AI layer and the system it runs on.
            </span>
          </h2>
          <p
            data-rv="d2"
            className="mt-6 max-w-[560px] font-inter text-[17px] leading-[1.6] text-muted"
          >
            Six years shipping production software — Node.js, NestJS and React
            first, now Python and FastAPI alongside them — with most of my time
            on LLM applications: LangGraph agents, retrieval over real customer
            data with pgvector, tool calling, Celery pipelines, and the evals
            and tracing that make them trustworthy. Today I build the AI layer
            at Spacebrain.ai; before that, 75+ projects for 40+ clients as a Top
            Rated freelancer. Based in Kathmandu, working with teams in the US
            and Europe.
          </p>
        </div>

        <div
          data-rv="d2"
          className="rounded border-[1.5px] border-rule bg-white p-7"
        >
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[.16em] text-muted">
            <span>Currently</span>
            <span className="inline-flex items-center gap-2 text-ink">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              Open to work
            </span>
          </div>
          <dl className="mt-6 border-t-[1.5px] border-rule">
            {stats.map((st) => (
              <div
                key={st.v}
                className="flex items-baseline justify-between gap-5 border-b-[1.5px] border-rule py-[18px]"
              >
                <dt className="whitespace-nowrap text-[28px] font-medium leading-none tracking-[-.03em]">
                  {st.v}
                </dt>
                <dd className="max-w-[280px] text-right font-inter text-[14.5px] leading-[1.45] text-muted">
                  {st.t}
                </dd>
              </div>
            ))}
          </dl>
          <a
            href="#contact"
            className="mt-6 flex items-center justify-between rounded bg-ink px-5 py-[15px] font-inter text-[15px] font-medium text-paper transition-colors hover:bg-accent"
          >
            Start a conversation <span className="font-mono">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
