# 01: Scaffold, theme tokens & Content Source

**What to build:** The project skeleton end-to-end: an Astro app with React islands, TypeScript strict, Tailwind v4, Motion, and Lenis installed; the dark grayscale palette and pinned type scale defined as theme tokens; Space Grotesk display and Inter body self-hosted; a typed Content Source holding placeholder site identity, skills, and projects; and a stub page that renders the site title from the Content Source, proving the content pipe. The Vitest + React Testing Library + jsdom test rig is configured and a smoke test passes.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Build passes clean; dev server shows a dark page using the theme tokens
- [ ] Palette tokens defined: base `#0A0A0B`, surface `#131316`, text `#EDEDEF`, muted `#8A8A93`
- [ ] Pinned type scale (display / body / caption) exists; Space Grotesk + Inter load via fontsource
- [ ] Content Source schema typed: site identity (name, title, email, socials), skills (name, icon, one-line blurb, Brand Gradient start/end hexes), projects (title, slug, blurb, tags, readme URL)
- [ ] Placeholder content filled in and structured identically to real content
- [ ] Stub page renders the site title from the Content Source (no hardcoded copy)
- [ ] Vitest + React Testing Library + jsdom run via one command; smoke test green
- [ ] Content Source shape enforced by types; malformed entries fail typecheck/build
