import SectionLabel from "@/components/section-label";
import { faqs } from "@/lib/content";

export default function Faq() {
  return (
    <section id="faq" className="bg-paper px-6 pb-[110px] sm:px-8">
      <div className="mx-auto grid max-w-page grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-start gap-x-16 gap-y-10 border-t-[1.5px] border-rule pt-[110px]">
        <div>
          <SectionLabel num="07">Before you write</SectionLabel>
          <h2
            data-rv="d1"
            className="text-[clamp(34px,4.2vw,58px)] font-medium leading-none tracking-[-.03em]"
          >
            Questions
            <br />
            teams ask first.
          </h2>
        </div>

        <div data-rv="d1" className="border-b border-rule">
          {faqs.map((f) => (
            <details key={f.q} className="group border-t border-rule">
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-5 text-[21px] font-medium leading-tight tracking-[-.02em] transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden="true"
                  className="font-mono text-base text-accent transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-[640px] pb-6 font-inter text-base leading-[1.6] text-muted">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
