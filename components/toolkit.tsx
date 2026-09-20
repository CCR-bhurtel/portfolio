import SectionLabel from "@/components/section-label";
import { toolkit } from "@/lib/content";

export default function Toolkit() {
  return (
    <section id="skills" className="bg-paper px-6 py-[110px] sm:px-8">
      <div className="mx-auto max-w-page">
        <div className="mb-11 flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel num="03">What you can hire me for</SectionLabel>
            <h2
              data-rv="d1"
              className="text-[clamp(34px,4.2vw,58px)] font-medium leading-none tracking-[-.03em]"
            >
              From first agent
              <br />
              to production.
            </h2>
          </div>
          <p
            data-rv="d2"
            className="max-w-[360px] font-inter text-base leading-[1.55] text-muted"
          >
            Most engagements are a mix: an AI capability that has to be
            reliable, plus the system underneath it. Hire me for one step or
            the whole path.
          </p>
        </div>

        <div
          data-rv
          className="grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-x-10 gap-y-12"
        >
          {toolkit.map((t) => (
            <div key={t.num}>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-[40px] leading-[.9] text-accent">
                  {t.num}
                </span>
                <span className="font-serif text-lg italic text-muted">
                  {t.step}
                </span>
              </div>
              <h3 className="mt-4 text-[23px] font-medium leading-[1.15] tracking-[-.02em]">
                {t.title}
              </h3>
              <p className="mb-5 mt-2.5 font-inter text-[15px] leading-normal text-muted">
                {t.body}
              </p>
              <ul className="grid gap-[7px] border-t border-rule pt-3.5 font-mono text-[12.5px] tracking-[.02em]">
                {t.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
