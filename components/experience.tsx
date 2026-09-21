import SectionLabel from "@/components/section-label";
import { roles, site } from "@/lib/content";

export default function Experience() {
  return (
    <section id="experience" className="bg-paper px-6 pb-[110px] sm:px-8">
      <div className="mx-auto max-w-page border-t-[1.5px] border-rule pt-[110px]">
        <div className="mb-11 flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel num="04">Experience</SectionLabel>
            <h2
              data-rv="d1"
              className="text-[clamp(34px,4.2vw,58px)] font-medium leading-none tracking-[-.03em]"
            >
              The ledger so far.
            </h2>
          </div>
          <a
            data-rv="d2"
            href={site.resume}
            className="border-b-[1.5px] border-current pb-0.5 font-inter text-[15px] font-medium transition-colors hover:text-accent"
          >
            Download resume ↗
          </a>
        </div>

        <ol data-rv className="border-b border-rule">
          {roles.map((r) => (
            <li
              key={r.period}
              className="-ml-5 grid items-start gap-x-8 gap-y-4 border-l-2 border-t border-l-transparent border-t-rule py-[34px] pl-5 transition-colors duration-200 hover:border-l-accent hover:bg-white sm:grid-cols-[150px_minmax(0,1fr)]"
            >
              <div className="font-mono text-xs leading-[1.7] tracking-[.12em] text-muted">
                <span className="block font-serif text-[44px] leading-[.9] tracking-normal text-ink">
                  {r.from}
                </span>
                {r.period}
              </div>
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2">
                  <h3 className="text-[clamp(22px,2.4vw,30px)] font-medium leading-[1.1] tracking-[-.025em]">
                    {r.role}
                  </h3>
                  <span className="font-mono text-[11px] uppercase tracking-[.14em] text-accent">
                    {r.org}
                  </span>
                </div>
                <p className="mt-3.5 max-w-[720px] font-inter text-base leading-[1.6] text-muted">
                  {r.body}
                </p>
                <p className="mt-3.5 font-mono text-[11.5px] uppercase leading-relaxed tracking-[.1em]">
                  {r.tech.join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
