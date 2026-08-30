# 09: QA sweep & Caddy deployment artifacts

**What to build:** The closing gate: a manual QA sweep against the spec's motion/a11y/mobile decisions, and the deployment artifacts — a Caddy file-server configuration with long cache headers for hashed assets and a clean static build ready to copy onto the VPS.

**Blocked by:** 02 (Hero), 03 (Anchor navbar & smooth scroll), 04 (About section), 05 (Contact section), 06 (Skills — Skill Badge grid & Skill Popup), 07 (Readme Detail renderer & the test seam), 08 (Projects list, detail routes & view transitions).

**Status:** ready-for-agent

- [ ] Exactly three orchestrated moments present (hero load, Skill Badge hover, project view-transition); everything else static or ≤150ms fades
- [ ] `prefers-reduced-motion` sweep passes across every animated surface
- [ ] Keyboard/a11y sweep: visible focus everywhere, Skill Popup tap-toggle verified on touch
- [ ] Mobile sweep: sections, nav, and readme containment verified at phone widths
- [ ] Grayscale discipline final check: Brand Gradients are the only saturated pixels
- [ ] Caddyfile snippet provided: static file serving + long cache headers for hashed assets
- [ ] Static build emits clean output deployable by copying to the VPS
