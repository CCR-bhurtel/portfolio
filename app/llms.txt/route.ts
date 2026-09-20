import {
  education,
  faqs,
  links,
  posts,
  projects,
  roles,
  site,
  stats,
  toolkit,
} from "@/lib/content";

export const dynamic = "force-static";

// https://llmstxt.org — a plain-markdown summary of the site for LLMs and
// AI agents, generated from the same content the page renders.
export function GET() {
  const body = `# ${site.name} — ${site.jobTitle}

> ${site.description}

- Location: ${site.location} (${site.timezone}), working with teams in the US and Europe
- Status: open to work, replies within a day
- Contact: ${site.email}
- Website: ${site.url}
- Resume: ${site.url}${site.resume}

## At a glance

${stats.map((s) => `- ${s.v}: ${s.t}`).join("\n")}

## What you can hire me for

${toolkit
  .map((t) => `### ${t.step}: ${t.title}\n\n${t.body}\n\n${t.items.map((i) => `- ${i}`).join("\n")}`)
  .join("\n\n")}

## Experience

${roles
  .map(
    (r) =>
      `### ${r.role} — ${r.org} (${r.period})\n\n${r.body}\n\nStack: ${r.tech.join(", ")}`
  )
  .join("\n\n")}

## Selected work

${projects
  .map(
    (p) =>
      `### ${p.name} (${p.kind}, ${p.year})\n\n${p.tagline}\n\n- Problem: ${p.problem}\n- What I built: ${p.built}\n${p.highlights
        .map((h) => `- ${h}`)
        .join("\n")}\n- Tech: ${p.tech.join(", ")}${p.links
        .map((l) => `\n- [${l.label}](${l.href})`)
        .join("")}`
  )
  .join("\n\n")}

## Writing

${posts.map((p) => `- [${p.title}](${p.href}) — ${p.date}, ${p.read} read`).join("\n")}

## FAQ

${faqs.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}

## Education

${education.map((e) => `- ${e.school} (${e.years}): ${e.detail}`).join("\n")}

## Elsewhere

${links.map((l) => `- [${l.label}](${l.href})`).join("\n")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
