import Mark from "@/components/mark";
import { site, social } from "@/lib/content";

const columns = [
  {
    title: "Sections",
    items: [
      { label: "Work", href: "#work" },
      { label: "Services", href: "#skills" },
      { label: "Experience", href: "#experience" },
      { label: "Writing", href: "#writing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Elsewhere",
    items: [
      { label: "GitHub", href: social.github },
      { label: "LinkedIn", href: social.linkedin },
      { label: "Medium", href: social.medium },
    ],
  },
  {
    title: "Hire me",
    items: [
      { label: "Upwork", href: social.upwork },
      { label: "Fiverr", href: social.fiverr },
      { label: "Email", href: `mailto:${site.email}` },
    ],
  },
];

const monoLabel = "font-mono text-[11px] uppercase tracking-[.16em] text-muted";

export default function Footer() {
  return (
    <footer className="border-t-[1.5px] border-rule bg-paper px-6 pb-7 pt-14 sm:px-8">
      <div className="mx-auto grid max-w-page grid-cols-2 gap-10 lg:grid-cols-5">
        <div className="col-span-2">
          <a
            href="#top"
            className="inline-flex items-center gap-3 text-[19px] font-semibold tracking-[.01em]"
          >
            <Mark size={26} />
            {site.name}
          </a>
          <p className="mt-4 max-w-[320px] font-inter text-[15px] leading-[1.55] text-muted">
            {site.tagline}
          </p>
        </div>
        {columns.map((col) => (
          <nav
            key={col.title}
            aria-label={col.title}
            className="grid content-start gap-3 font-inter text-[15px]"
          >
            <div className={`mb-1.5 ${monoLabel}`}>{col.title}</div>
            {col.items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-muted"
                {...(item.href.startsWith("http") && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                {item.label}
              </a>
            ))}
          </nav>
        ))}
      </div>
      <div
        className={`mx-auto mt-10 flex max-w-page flex-wrap justify-between gap-4 border-t-[1.5px] border-rule pt-5 ${monoLabel}`}
      >
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>{site.location}</span>
      </div>
    </footer>
  );
}
