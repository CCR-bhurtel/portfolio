import { readFileSync } from "node:fs";
import path from "node:path";
import {
  education,
  faqs,
  links,
  posts,
  projects,
  roles,
  site,
  stack,
  stats,
  toolkit,
} from "@/lib/content";

// Knowledge base for the "Ask about me" chat. Used by the ingest script only,
// never at request time. Chunks are built from the same content the page
// renders, so the assistant can't drift from the site.

export type Chunk = {
  id: string;
  text: string;
  metadata: { title: string; section: string; href: string };
};

// The hosted BGE model truncates at 512 tokens, which would silently embed
// only part of a chunk. Stay well below it.
export const MAX_CHUNK_TOKENS = 450;

export const estimateTokens = (text: string) => Math.ceil(text.length / 4);

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const chunk = (
  section: string,
  title: string,
  href: string,
  text: string
): Chunk => ({
  id: `${slug(section)}-${slug(title)}`,
  text: text.replace(/\s+/g, " ").trim(),
  metadata: { title, section, href },
});

// "## Title | #anchor" sections of a markdown file, one chunk each
function markdownChunks(file: string): Chunk[] {
  const raw = readFileSync(path.join(process.cwd(), "content", file), "utf8")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
  return raw
    .split(/^## /m)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [heading, ...body] = part.split("\n");
      const [title, href = "#top"] = heading.split("|").map((s) => s.trim());
      return chunk("More", title, href, `${title}. ${body.join(" ")}`);
    });
}

export function buildChunks(): Chunk[] {
  const chunks: Chunk[] = [
    chunk(
      "About",
      "Who Shishir is",
      "#about",
      `Shishir Bhurtel is an ${site.jobTitle} based in ${site.location} (${site.timezone}). His current job is ${roles[0].role} at ${roles[0].org}. ${site.description} Email: ${site.email}. Website: ${site.url}.`
    ),
    chunk(
      "About",
      "Track record at a glance",
      "#about",
      `Shishir Bhurtel's track record: ${stats
        .map((s) => `${s.v} — ${s.t}`)
        .join(". ")}. He is currently open to work.`
    ),
    chunk(
      "About",
      "Profiles and links",
      "#contact",
      `Where to find Shishir Bhurtel online: ${links
        .map((l) => `${l.label}: ${l.href}`)
        .join(", ")}. Resume: ${site.url}${site.resume}. Email: ${site.email}.`
    ),

    // The single most-asked question gets one passage that answers it whole
    chunk(
      "Services",
      "Tech stack",
      "#skills",
      `Shishir's tech stack, the technologies and tools he works with. His backend stack: ${toolkit[3].items.join(", ")}. His AI and LLM stack: ${toolkit[0].items.join(", ")}, ${toolkit[1].items.join(", ")}. Everything he works with day to day: ${stack.join(", ")}.`
    ),

    ...toolkit.map((t) =>
      chunk(
        "Services",
        t.title,
        "#skills",
        `Service Shishir offers — ${t.step}: ${t.title}. ${t.body} Skills and tools he uses for this: ${t.items.join(", ")}.`
      )
    ),

    ...roles.map((r, i) =>
      chunk(
        "Experience",
        `${r.role} at ${r.org}`,
        "#experience",
        `${
          i === 0
            ? `Where Shishir works now, his current job and employer`
            : `Shishir's past work experience`
        }: ${r.role} at ${r.org}, ${r.period}. ${r.body} Technologies used: ${r.tech.join(", ")}.`
      )
    ),

    // Two chunks per project so a question pulls in the half it needs
    ...projects.flatMap((p) => [
      chunk(
        "Work",
        p.name,
        "#work",
        `Project by Shishir: ${p.name} (${p.kind}, ${p.year}). ${p.tagline} The problem: ${p.problem} What Shishir built: ${p.built} Technologies: ${p.tech.join(", ")}.${
          p.links.length
            ? ` Links: ${p.links.map((l) => `${l.label} ${l.href}`).join(", ")}.`
            : ""
        }`
      ),
      chunk(
        "Work",
        `${p.name} highlights`,
        "#work",
        `Highlights of Shishir's project ${p.name} (${p.kind}): ${p.highlights.join("; ")}.`
      ),
    ]),

    ...faqs.map((f) =>
      chunk("FAQ", f.q, "#faq", `Question: ${f.q} Shishir's answer: ${f.a}`)
    ),

    chunk(
      "Writing",
      "Articles Shishir has written",
      "#writing",
      `Shishir writes technical articles on Medium: ${posts
        .map((p) => `"${p.title}" (${p.date}, ${p.read} read) ${p.href}`)
        .join("; ")}.`
    ),
    chunk(
      "Education",
      "Education",
      "#writing",
      `Shishir's education: ${education
        .map((e) => `${e.school} (${e.years}): ${e.detail}`)
        .join(" ")}`
    ),

    ...markdownChunks("extra.md"),
  ];

  const ids = new Set<string>();
  for (const c of chunks) {
    if (ids.has(c.id)) throw new Error(`Duplicate chunk id: ${c.id}`);
    ids.add(c.id);
    const tokens = estimateTokens(c.text);
    if (tokens > MAX_CHUNK_TOKENS) {
      throw new Error(
        `Chunk "${c.id}" is ~${tokens} tokens (limit ${MAX_CHUNK_TOKENS}). Split it.`
      );
    }
  }
  return chunks;
}
