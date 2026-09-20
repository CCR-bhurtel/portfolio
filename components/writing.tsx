import SectionLabel from "@/components/section-label";
import { education, posts, social } from "@/lib/content";

export default function Writing() {
  return (
    <section id="writing" className="bg-paper px-6 pb-[110px] sm:px-8">
      <div className="mx-auto grid max-w-page grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-start gap-16">
        <div>
          <SectionLabel num="05">Writing</SectionLabel>
          <ul data-rv="d1">
            {posts.map((p, i) => (
              <li key={p.href}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid grid-cols-[34px_minmax(0,1fr)] items-baseline gap-[18px] border-b border-rule py-5 transition-[padding,color] duration-200 hover:pl-2 hover:text-accent"
                >
                  <span className="font-serif text-[26px] leading-none text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-[21px] font-medium leading-tight tracking-[-.02em]">
                      {p.title}
                    </span>
                    <span className="mt-1.5 block font-mono text-[11px] uppercase tracking-[.14em] text-muted">
                      {p.date} · {p.read}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a
            data-rv="d2"
            href={social.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-[22px] inline-block border-b-[1.5px] border-current pb-0.5 font-inter text-[15px] font-medium transition-colors hover:text-accent"
          >
            All articles on Medium →
          </a>
        </div>

        <div>
          <SectionLabel num="06">Education</SectionLabel>
          <ul data-rv="d1" className="border-b-[1.5px] border-rule">
            {education.map((e) => (
              <li key={e.school} className="border-t-[1.5px] border-rule py-[22px]">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h3 className="text-xl font-medium tracking-[-.02em]">
                    {e.school}
                  </h3>
                  <span className="font-mono text-[11px] tracking-[.14em] text-muted">
                    {e.years}
                  </span>
                </div>
                <p className="mt-2 font-inter text-[15px] leading-[1.55] text-muted">
                  {e.detail}
                </p>
              </li>
            ))}
          </ul>
          <div
            data-rv="d2"
            className="mt-8 rounded border-[1.5px] border-rule bg-white p-6"
          >
            <div className="font-mono text-[11px] uppercase tracking-[.16em] text-muted">
              Also
            </div>
            <p className="mt-2.5 font-inter text-[15.5px] leading-[1.6]">
              Open-source contributions, technical writing, and an unreasonable
              interest in how large systems stay up.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
