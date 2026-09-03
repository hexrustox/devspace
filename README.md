<div align="center">

# Devspace

**A single-page portfolio that introduces me, my skills, and my projects.**

[![Live site](https://img.shields.io/badge/live%20site-ckhgy.com-2ea44f?style=flat-square)](https://ckhgy.com)
[![Astro](https://img.shields.io/badge/Astro-ff5d01?style=flat-square&logo=astro&logoColor=fff)](https://astro.build)
[![React](https://img.shields.io/badge/React-20232a?style=flat-square&logo=react&logoColor=61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=fff)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06b6d4?style=flat-square&logo=tailwindcss&logoColor=fff)](https://tailwindcss.com)

</div>

This repository holds my personal portfolio: a single web page that tells a visitor everything they need to know about me as a developer. It shows who I am, the technologies I work with, the projects I have built, and how to reach me — all in one place, with a clean design and a few tasteful animations.

The site is live at [ckhgy.com](https://ckhgy.com).

> [!TIP]
> Every word on the site — the intro, the skill descriptions, the project list, the contact links — lives in one content file (`src/content.ts`). Keeping the site up to date means editing that single file, never the page itself.

## What a visitor sees

The page reads top to bottom like a short introduction:

```mermaid
flowchart LR
    A["Hero<br/>full-screen intro"] --> B["Skills<br/>15 technology cards"] --> C["Projects<br/>write-ups from GitHub"] --> D["Contact<br/>say hello"] --> E["Footer<br/>copyright"]
```

- **Hero** — a full-screen introduction that gently fades as you start scrolling.
- **Skills** — a grid of fifteen technology cards, each with its official icon and a one-line description.
- **Projects** — the centerpiece. Each project's write-up is read live from its GitHub page and shown right on the site, with a short animated reveal as it loads. Any image or diagram inside a write-up can be clicked to open it full-screen.
- **Contact** — a friendly closing section with direct links: email, GitHub, and GitLab.

The whole page sits on a slowly shifting aurora background, with frosted-glass panels and smooth scrolling.

## Built to a professional standard

- **Fast** — the pages are pre-built in advance, so visitors download plain files rather than waiting for anything to be assembled.
- **Works everywhere** — designed to look and behave well on phones, tablets, and desktops.
- **Easy to find** — set up so search engines can read it properly: a sitemap, page descriptions, and structured data.
- **Respectful of preferences** — visitors who turn on "reduce motion" in their system settings get the same page with the animation switched off.
- **Tested** — an automated test suite and strict type checking catch mistakes before they reach the page.
