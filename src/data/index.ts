import { researchContent } from "./1-research";
import { businessContent } from "./2-business";
import { architectureContent } from "./3-architecture";
import { schemaContent } from "./4-schema";
import { uiContent } from "./5-ui";
import { deploymentContent } from "./6-deployment";

export const blueprintSections = [
  {
    id: "research",
    title: "Market Research for Afghanistan",
    icon: "Search",
    content: researchContent,
  },
  {
    id: "business",
    title: "Business & Monetization",
    icon: "Briefcase",
    content: businessContent,
  },
  {
    id: "architecture",
    title: "System Architecture",
    icon: "Cloud",
    content: architectureContent,
  },
  {
    id: "schema",
    title: "Database Schema & APIs",
    icon: "Database",
    content: schemaContent,
  },
  {
    id: "ui",
    title: "UI Flows & Low-Data Design",
    icon: "Smartphone",
    content: uiContent,
  },
  {
    id: "deployment",
    title: "Deployment, Security & Scaling",
    icon: "Shield",
    content: deploymentContent,
  },
];
