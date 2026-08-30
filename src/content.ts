export type HexColor = `#${string}`;

export type ReadmeUrl = `https://${string}`;

export type SocialUrl = `https://${string}`;

export interface BrandGradient {
  start: HexColor;
  end: HexColor;
}

export interface SocialLink {
  label: string;
  href: SocialUrl;
}

export interface SiteIdentity {
  name: string;
  title: string;
  email: string;
  socials: SocialLink[];
}

export interface Skill {
  name: string;
  icon: string;
  blurb: string;
  gradient: BrandGradient;
}

export interface ProjectEntry {
  title: string;
  slug: string;
  blurb: string;
  tags: string[];
  readmeUrl: ReadmeUrl;
}

export const site = {
  name: "Alex Carter",
  title: "Full-stack developer",
  email: "alex@carter.dev",
  socials: [
    { label: "GitHub", href: "https://github.com/alexcarter" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/alexcarter" },
  ],
} satisfies SiteIdentity;

export const skills = [
  {
    name: "TypeScript",
    icon: "typescript",
    blurb: "Typed JavaScript for everything from islands to servers.",
    gradient: { start: "#3178c6", end: "#1a4c85" },
  },
  {
    name: "React",
    icon: "react",
    blurb: "Component UIs, islands-first, with Motion for animation.",
    gradient: { start: "#61dafb", end: "#0f7ea8" },
  },
  {
    name: "Astro",
    icon: "astro",
    blurb: "Static-first site architecture with zero-JS by default.",
    gradient: { start: "#bc52ee", end: "#ff5d01" },
  },
  {
    name: "Node.js",
    icon: "nodedotjs",
    blurb: "Servers, tooling, and build pipelines in JavaScript.",
    gradient: { start: "#83cd29", end: "#3f6e22" },
  },
  {
    name: "Rust",
    icon: "rust",
    blurb: "Fast, reliable systems code and CLI tooling.",
    gradient: { start: "#f74c00", end: "#8a2b02" },
  },
  {
    name: "Tailwind CSS",
    icon: "tailwindcss",
    blurb: "Utility-first styling driven by design tokens.",
    gradient: { start: "#38bdf8", end: "#0c71b8" },
  },
  {
    name: "PostgreSQL",
    icon: "postgresql",
    blurb: "Relational data modeled and queried properly.",
    gradient: { start: "#699eca", end: "#336791" },
  },
  {
    name: "Docker",
    icon: "docker",
    blurb: "Reproducible builds and deploys, from laptop to VPS.",
    gradient: { start: "#2496ed", end: "#0b5a94" },
  },
] satisfies Skill[];

export const projects = [
  {
    title: "Pulseboard",
    slug: "pulseboard",
    blurb: "Realtime status dashboard streaming service health into one view.",
    tags: ["React", "TypeScript", "Vite"],
    readmeUrl:
      "https://raw.githubusercontent.com/alexcarter/pulseboard/main/README.md",
  },
  {
    title: "Hexforge",
    slug: "hexforge",
    blurb: "CLI for hashing, encoding, and inspecting files at speed.",
    tags: ["Rust", "CLI"],
    readmeUrl:
      "https://raw.githubusercontent.com/alexcarter/hexforge/main/README.md",
  },
  {
    title: "Quiet Ink",
    slug: "quiet-ink",
    blurb: "Markdown-first writing space with a keyboard-only workflow.",
    tags: ["Astro", "TypeScript"],
    readmeUrl:
      "https://raw.githubusercontent.com/alexcarter/quiet-ink/main/README.md",
  },
] satisfies ProjectEntry[];
