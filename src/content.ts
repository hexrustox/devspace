export const identity = {
  title: "software engineer",
  bio: "I turn ambiguous problems into shipped software. TypeScript-first, design-minded, allergic to accidental complexity.",
} as const;

export const skills = [
  {
    name: "TypeScript",
    icon: "file-code",
    blurb: "Types that make invalid states unrepresentable.",
    description:
      "My default language for anything that runs. I use the type system as a design tool — modeling the domain first so refactors stay boring.",
    url: "https://www.typescriptlang.org",
  },
  {
    name: "React",
    icon: "atom",
    blurb: "Composable UI, minimal ceremony.",
    description:
      "Component architecture, hooks, and server-aware rendering patterns. I care about hydration cost and interfaces that hold up as they grow.",
    url: "https://react.dev",
  },
  {
    name: "Astro",
    icon: "rocket",
    blurb: "Static-first, interactive where it counts.",
    description:
      "Content-driven sites with zero JS by default and islands only when needed. This portfolio is built on it.",
    url: "https://astro.build",
  },
  {
    name: "Node.js",
    icon: "hexagon",
    blurb: "APIs, tooling, and automation.",
    description:
      "Services and CLIs on the JS runtime — streams, workers, and the npm ecosystem's sharp edges included.",
    url: "https://nodejs.org",
  },
  {
    name: "Tailwind CSS",
    icon: "wind",
    blurb: "Design tokens as utilities.",
    description:
      "Design systems expressed as utility classes over a token layer — consistent scales without leaving the markup.",
    url: "https://tailwindcss.com",
  },
  {
    name: "Testing",
    icon: "flask-conical",
    blurb: "Tests as a design pressure.",
    description:
      "Vitest, Testing Library, and CI gates. I test behavior, not implementation, and let the suite shape the architecture.",
    url: "https://vitest.dev",
  },
] as const;
