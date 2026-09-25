import type { Roadmap } from "../model";
import { phase1 } from "./p1";
import { phase2 } from "./p2";
import { phase3 } from "./p3";
import { phase4 } from "./p4";
import { phase5 } from "./p5";
import { phase6 } from "./p6";
import { phase7 } from "./p7";

export const aiSystemsArchitect: Roadmap = {
  slug: "ai-systems-architect",
  title: "From Programmer to AI Systems Architect",
  summary:
    "A deep, mastery-focused path from writing code to designing AI systems: distributed systems, data architecture, ML, RAG and agentic systems, event-driven services, cloud, security and cost. It ends with four complete capstone designs. The focus is architectural thinking and trade-offs, not implementation.",
  duration: "6–12 months",
  phases: [phase1, phase2, phase3, phase4, phase5, phase6, phase7],
  method: [
    {
      title: "Read foundational material",
      points: [
        "Books, papers and official docs",
        "Focus on why, not how",
        "Understand the trade-offs, not just the features",
      ],
    },
    {
      title: "Study reference architectures",
      points: [
        "AWS Architecture Center and the Google Cloud Architecture Framework",
        "For each one, ask what problem it solves and what it trades away",
      ],
    },
    {
      title: "Read case studies",
      points: [
        "Engineering blogs from Netflix, Uber, Airbnb, Palantir and Stripe",
        "Extract the key decisions, the failure modes and the lessons learned",
      ],
    },
    {
      title: "Draw architecture diagrams",
      points: [
        "Practise visualising systems",
        "Use a consistent notation: boxes for services, arrows for data flow",
      ],
    },
    {
      title: "Write design docs",
      points: [
        "Practise articulating trade-offs, technology choices and failure modes",
        "Get feedback from experienced architects (LinkedIn, X, Discord communities)",
      ],
    },
    {
      title: "Do mock architecture reviews",
      points: [
        "Present your designs to peers",
        "Practise defending decisions under pressure",
        "Learn to say “it depends”, then explain what it depends on",
      ],
    },
  ],
};
