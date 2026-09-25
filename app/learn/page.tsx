import LoginForm from "@/components/learn/login-form";
import { allIds, countDone, topicCount } from "@/lib/learn/model";
import { getProgress, isOwner, roadmaps } from "@/lib/learn/server";

const monoLabel = "font-mono text-[11px] uppercase tracking-[.16em]";

export default async function LearnIndex() {
  if (!(await isOwner())) return <LoginForm />;

  const paths = await Promise.all(
    roadmaps.map(async (r) => {
      const ids = allIds(r);
      const progress = await getProgress(r.slug);
      return {
        r,
        pct: progress && Math.round((countDone(ids, progress) / ids.length) * 100),
      };
    })
  );

  return (
    <main>
      <section className="bg-ink px-6 pb-20 pt-20 text-paper sm:px-8">
        <div className="mx-auto max-w-page">
          <div className={`inline-flex items-center gap-3 text-ash ${monoLabel}`}>
            <span className="inline-block h-2 w-2 bg-accent" />
            Learning · {String(roadmaps.length).padStart(2, "0")}{" "}
            {roadmaps.length === 1 ? "path" : "paths"}
          </div>
          <h1 className="mt-5 text-[clamp(44px,6.4vw,96px)] font-medium leading-[.94] tracking-[-.04em]">
            What I&rsquo;m
            <br />
            learning.
          </h1>
          <p className="mt-6 max-w-[520px] font-inter text-[17px] leading-[1.55] text-ash">
            Roadmaps I&rsquo;m working through, topic by topic, with the
            resources for each.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8">
        <ul className="mx-auto grid max-w-page grid-cols-[repeat(auto-fill,minmax(min(460px,100%),1fr))] gap-0.5">
          {paths.map(({ r, pct }, i) => (
            <li key={r.slug}>
              <a
                href={`/learn/${r.slug}`}
                className="group relative flex min-h-[460px] flex-col justify-between overflow-clip rounded bg-coal px-8 py-8 text-paper"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-10 -right-[18px] text-[220px] font-medium leading-none tracking-[-.06em] text-paper/5"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`relative flex justify-between gap-4 text-ash ${monoLabel}`}>
                  <span>{r.duration}</span>
                  <span>
                    {r.phases.length} phases · {topicCount(r)} topics
                  </span>
                </span>
                <span className="relative">
                  <span className="block max-w-[520px] text-[clamp(32px,3.6vw,46px)] font-medium leading-[1.02] tracking-[-.03em]">
                    {r.title}
                  </span>
                  <span className="mt-4 block max-w-[520px] font-inter text-base leading-[1.55] text-ash">
                    {r.summary}
                  </span>
                </span>
                <span className="relative block border-t-[1.5px] border-paper/20 pt-5">
                  <span className="flex items-center justify-between gap-4">
                    <span className={`text-ash ${monoLabel}`}>
                      {pct === null ? "Progress unavailable" : `${pct}% done`}
                    </span>
                    <span
                      className={`text-accent-soft transition-transform group-hover:translate-x-1 ${monoLabel}`}
                    >
                      Open →
                    </span>
                  </span>
                  <span className="mt-3 block h-1.5 bg-paper/10">
                    <span
                      className="block h-full bg-accent"
                      style={{ width: `${pct ?? 0}%` }}
                    />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
