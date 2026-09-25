import type React from "react";
import type { Metadata } from "next";
import Mark from "@/components/mark";
import { logout } from "@/app/learn/actions";
import { isOwner } from "@/lib/learn/server";

// Private and unlisted: never indexed, never linked from the site, and kept
// out of robots.txt, since a Disallow line would advertise the path.
export const metadata: Metadata = {
  title: "Learning",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

const monoLabel = "font-mono text-[11px] uppercase tracking-[.16em]";

export default async function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const owner = await isOwner();

  return (
    <div className="min-h-screen bg-paper">
      {/* Plain <a> links throughout /learn: a full load always shows fresh
          progress, where the router cache could restore stale ticks on Back */}
      <header className="sticky top-0 z-50 flex h-[60px] items-center justify-between border-b border-paper/15 bg-ink/90 px-5 text-paper backdrop-blur-[14px] sm:px-8">
        <a
          href="/learn"
          className="inline-flex items-center gap-2.5 text-[17px] font-semibold"
        >
          <Mark />
          Learning
        </a>
        <div className={`flex items-center gap-6 text-ash ${monoLabel}`}>
          <a href="/" className="transition-colors hover:text-paper">
            ← Site
          </a>
          {owner && (
            <form action={logout}>
              <button
                type="submit"
                className={`transition-colors hover:text-paper ${monoLabel}`}
              >
                Log out
              </button>
            </form>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
