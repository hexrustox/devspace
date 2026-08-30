# Spec: Interactive one-page portfolio

Status: ready-for-agent

## Problem Statement

You have no web presence for your work. Recruiters and peers can't browse your projects, see screenshots, or contact you, and existing portfolio templates are static, boring, and don't reflect your front-end craft.

## Solution

A dark, animation-rich one-page portfolio in an awwwards style: a kinetic-typography hero, a scroll-highlighted about narrative, a hoverable skills grid with animated gradient popups, an editorial projects list leading to per-project detail pages that render the project's live GitHub readme (including repo-relative screenshots), and a static contact CTA. The page is disciplined grayscale; the skills' Brand Gradients are the only color on it. All content lives in one editable source file; the built site is fully static, deployable to a Caddy file server on a VPS.

## User Stories

**Hero & navigation**
1. As a visitor, I want the hero to reveal its headline with staggered kinetic typography, so that the site feels crafted within the first second.
2. As a visitor, I want hero content to parallax as I scroll, so that the page feels alive and dimensional.
3. As a visitor, I want a fixed minimal nav with anchor links, so that I can jump to any section from anywhere.
4. As a visitor, I want smooth scrolling when using nav anchors, so that navigation feels fluid rather than jumpy.
5. As a reduced-motion user, I want reveals and parallax reduced or removed when I prefer reduced motion, so that the site doesn't cause discomfort.

**About**
6. As a visitor, I want the about paragraph to highlight word-by-word as I scroll, so that reading it feels engaging.
7. As a visitor, I want a "currently building / stack" strip, so that I can quickly see what the owner is up to right now.

**Skills**
8. As a visitor, I want a grid of equal-size rectangles each showing a language/framework icon and name, so that I can scan the owner's stack at a glance.
9. As a desktop visitor, I want hovering a skill to scale it up and pop up a card with a one-line blurb, so that I can learn what they use it for.
10. As a desktop visitor, I want the hovered skill's background to animate from transparent to a gradient in that technology's brand colors, so that each skill feels branded.
11. As a visitor, I want color to appear nowhere else on the page, so that the skills section reads as the reward for exploring it.
12. As a touch visitor, I want tapping a skill to toggle its popup, so that I get the same information without hover.
13. As a keyboard-only visitor, I want to focus a skill and open its popup, so that the information is reachable without a mouse.
14. As a visitor, I want skills to enter with a quiet fade, so that the section appears without competing with the page's orchestrated moments.

**Projects list**
15. As a visitor, I want projects as editorial list rows whose index numbers encode recency (newest = 01), so that the numbering is information, not decoration.
16. As a visitor, I want rows to shift/underline on hover, so that they invite clicking.
17. As a visitor, I want clicking a project to animate a transition into its detail page, so that navigation feels seamless.
18. As a recruiter, I want each project to have a shareable deep-link URL, so that I can send a specific project to a colleague.

**Project detail (Readme Detail)**
19. As a visitor, I want the detail page to show the project's readme fetched from its repository URL, so that documentation is always current without site edits.
20. As a visitor, I want repo-relative images in the readme (screenshots) to display correctly, so that I can see what the project looks like.
21. As a visitor, I want GFM features (tables, task lists, fenced code) rendered, so that real-world readmes read properly.
22. As a visitor, I want code blocks syntax-highlighted in the site's dark theme, so that snippets are readable.
23. As a visitor, I want raw HTML embedded in readmes to render, so that projects using HTML in their readme don't break.
24. As a visitor, I want a loading state while the readme fetches, so that the page never looks broken.
25. As a visitor on a slow connection or with a bad URL, I want a clear error state with a link to the repository, so that I can still reach the source.
26. As a visitor, I want readme content styled to match the site's dark theme, so that the detail page doesn't feel like a bolted-on GitHub embed.
27. As a mobile visitor, I want readme screenshots and wide tables contained (max-width images, horizontally scrollable tables), so that user-authored content can't break the page layout.

**Contact**
28. As a visitor, I want to click the email address to copy it with visual confirmation, so that I can reach out without retyping it.
29. As a visitor, I want links to the owner's social profiles, so that I can find them elsewhere.

**Content & deployment (owner)**
30. As the site owner, I want every piece of copy, every skill with its gradient colors, and every project entry defined in one content source file, so that I never touch components to change content.
31. As the site owner, I want to add a project by appending an entry (title, slug, blurb, tags, readme URL), so that publishing a new project is a two-minute edit.
32. As the site owner, I want placeholder content structured identically to real content, so that swapping in my real copy is a pure data edit.
33. As the site owner, I want the build to emit a static bundle, so that I can deploy by copying files to my VPS.
34. As the site owner, I want a Caddy file-server configuration with cache headers for hashed assets, so that deployment to my VPS is turnkey.
35. As a visitor typing an unknown project URL, I want a styled 404, so that the site never shows a bare error.

## Implementation Decisions

- **Rendering**: Astro static output with React islands; TypeScript strict; Tailwind v4; Motion for React for all component animation; Lenis for smooth scroll. No SPA framework shell.
- **Structure**: a single one-page route (Hero, About, Skills, Projects, Contact) plus statically prerendered project detail routes derived from the Content Source, entered via animated view transitions. Deep links per Project Entry.
- **Content Source (`content.ts`, single source of content)**: site identity (name, title, email, socials); skills (name, icon, one-line blurb, gradient start/end hexes — the Brand Gradient, hand-tuned, simple-icons palette as source); projects (title, slug, blurb, tags, readme URL). Types enforce the schema; prerendering fails the build on malformed content.
- **Skill Badge contract**: equal-size rectangle, icon + name visible at rest; on hover scales up and shows a Skill Popup with the blurb while the background animates transparent → Brand Gradient; tap toggles on touch; keyboard focusable.
- **Readme Detail pipeline**: detail page island fetches the readme from its raw repository URL at mount; relative image/link paths are rewritten against the repo's raw base URL (this is what makes repo screenshots render); rendered via react-markdown with GFM, raw-HTML passthrough, syntax highlighting, and dark-theme prose styles; distinct loading and error states. User-authored content is contained: max-width images, wide tables scroll horizontally on mobile.
- **Theme**: dark-only; Space Grotesk display, Inter body, self-hosted via fontsource.
- **Visual direction — "color is earned" (signature)**: a grayscale site — base `#0A0A0B`, surface `#131316`, text `#EDEDEF`, muted `#8A8A93` — where the only saturated pixels on the page are the Skill Badge Brand Gradients; links, CTAs, and focus rings stay grayscale. Space Grotesk display is set oversized, tight-tracked, and heavy; Inter body; a pinned type scale (display / body / caption) makes the pairing read as a deliberate choice. Copy is design material: plain verbs, sentence case, no lorem; the contact CTA is literal ("Copy email" → "Copied").
- **Motion policy**: exactly three orchestrated moments — page-load hero, Skill Badge hover, project view-transition; everything else is static or a ≤150ms opacity fade; every animation gated behind a reduced-motion check.
- **Deployment**: static `dist/` served by Caddy file server on a self-hosted VPS; long cache headers for hashed assets.

## Testing Decisions

- **What makes a good test here**: asserts external behavior only — given a readme URL and markdown, the rendered output resolves relative images, renders GFM/HTML/highlighted code, and shows loading/error states; never asserts component internals or class names.
- **The one seam**: the Readme Detail renderer, tested with fixture readmes covering: relative image paths (the screenshot case), raw-HTML `<img>`, GFM tables/task lists, fenced code, already-absolute URLs, and fetch failure.
- **Prior art**: none — greenfield; this spec establishes the codebase's first test seam.
- **Framework**: Vitest + React Testing Library in a jsdom environment; `fetch` mocked for the failure case. Chosen for Vite-native fit and rendered-output assertions.
- **Not automated**: all visual/motion behavior (hero, popups, transitions) — covered by a manual QA checklist; content correctness — enforced by types + build-time prerender failure.

## Out of Scope

- Contact form / any backend (static copy-email only)
- CMS, analytics, search, blog, i18n, light theme or theme toggle
- Custom cursor (explicitly declined)
- WebGL / three.js (pure-DOM motion only in v1)
- GitHub API auto-listing of repos; build-time readme vendoring (superseded by runtime fetch — see ADR-0001)
- CI/CD pipeline and domain/DNS setup
- OG-image generation beyond basic meta tags

## Further Notes

- Repo-relative image rendering is a hard requirement, not polish — it motivates the runtime-fetch decision, captured as `docs/adr/0001-static-site-with-runtime-readme-fetch.md`.
- The domain glossary lives in `CONTEXT.md` at the repo root (Skill Badge, Skill Popup, Brand Gradient, Project Entry, Readme Detail, Content Source).
- Signature element: "color is earned" — adopted from a frontend-design review; the skills section is the one place color appears.
- The dev shell already provides node/pnpm wrappers via the existing flake — no tooling changes needed.
