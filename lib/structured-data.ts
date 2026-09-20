import {
  education,
  faqs,
  links,
  posts,
  projects,
  roles,
  site,
  toolkit,
} from "@/lib/content";

const personId = `${site.url}/#person`;

// schema.org graph: who Shishir is, what he knows and what he has built, in a
// form search engines and AI answer engines can read without parsing the page.
export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: site.name,
      url: site.url,
      image: `${site.url}/opengraph-image`,
      email: `mailto:${site.email}`,
      jobTitle: site.jobTitle,
      description: site.description,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kathmandu",
        addressCountry: "NP",
      },
      worksFor: { "@type": "Organization", name: roles[0].org },
      hasOccupation: {
        "@type": "Occupation",
        name: "AI Engineer",
        skills: toolkit.flatMap((t) => t.items).join(", "),
      },
      alumniOf: education.map((e) => ({
        "@type": "EducationalOrganization",
        name: e.school,
      })),
      knowsAbout: [
        "Artificial intelligence engineering",
        "Agentic AI systems",
        "Large language model applications",
        "Retrieval-augmented generation",
        "AI agents and tool calling",
        "LLM evaluation and tracing",
        "LangGraph",
        ...toolkit.map((t) => t.title),
      ],
      sameAs: links.map((l) => l.href),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.title,
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": personId },
    },
    {
      "@type": "ProfilePage",
      "@id": `${site.url}/#profile`,
      url: site.url,
      name: site.title,
      isPartOf: { "@id": `${site.url}/#website` },
      about: { "@id": personId },
      mainEntity: { "@id": personId },
    },
    {
      "@type": "ItemList",
      name: "Selected work",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "CreativeWork",
          name: p.name,
          description: p.tagline,
          dateCreated: p.year.slice(0, 4),
          keywords: p.tech.join(", "),
          creator: { "@id": personId },
          ...(p.links[0] && { url: p.links[0].href }),
        },
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    ...posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: p.href,
      datePublished: new Date(`${p.date} UTC`).toISOString().slice(0, 10),
      author: { "@id": personId },
    })),
  ],
};
