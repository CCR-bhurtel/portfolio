This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## "Ask about me" chat

The hero chat answers visitor questions from the site content and resume: Upstash
Search for retrieval, Claude Haiku 4.5 for the answer, Upstash Redis for rate limits,
the daily spend cap and the answer cache. It stays hidden until every variable in
`.env.example` is set (locally in `.env.local`, and in the Vercel project).

```bash
npm run ingest              # upload the knowledge base (after content changes)
npm run ingest -- --dry-run # preview the chunks without uploading
npm run ask:eval            # 34 questions through the real pipeline, a few cents
npm test                    # guards and knowledge-base unit tests
```

Knowledge comes from `lib/content.ts` plus `content/extra.md`. Limits, model and
cache settings live in `lib/ask-config.ts`. An answer is only shown if it cites the
retrieved passages and every number in it appears in them; otherwise the visitor
gets a "not covered, email me" reply.
