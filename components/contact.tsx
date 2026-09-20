import ContactForm from "@/components/contact-form";
import SectionLabel from "@/components/section-label";
import { links, site } from "@/lib/content";

const monoLabel =
  "font-mono text-[11px] uppercase tracking-[.16em] text-ash font-normal";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-ink px-6 pb-[100px] pt-[110px] text-paper sm:px-8"
    >
      <div className="mx-auto max-w-page">
        <SectionLabel num="08" dark>
          Open to work · replies within a day
        </SectionLabel>
        <h2
          data-rv="d1"
          className="max-w-[760px] font-inter text-[clamp(17px,1.5vw,20px)] font-normal leading-[1.55] text-ash"
        >
          Have an agent, a RAG pipeline or an LLM feature that needs to reach
          production? Tell me what you&rsquo;re building.
        </h2>
        <a
          data-rv="d1"
          href={`mailto:${site.email}`}
          className="mt-7 block break-words text-[clamp(30px,6.4vw,96px)] font-medium leading-none tracking-[-.04em] transition-colors duration-200 hover:text-accent-soft"
        >
          {site.email}
        </a>

        <div
          data-rv="d2"
          className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] items-start gap-12 border-t-[1.5px] border-paper/15 pt-9"
        >
          <div>
            <h3 className={monoLabel}>Elsewhere</h3>
            <ul className="mt-4 grid gap-2.5 font-inter text-base">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="flex justify-between gap-4 border-b-[1.5px] border-paper/15 pb-2.5 transition-colors hover:border-accent-soft hover:text-accent-soft"
                  >
                    {l.label}
                    <span className="font-mono">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={monoLabel}>Based in</h3>
            <p className="mt-4 font-inter text-base leading-[1.6] text-ash">
              {site.location} · {site.timezone}
              <br />
              Working with teams in the US and Europe.
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
