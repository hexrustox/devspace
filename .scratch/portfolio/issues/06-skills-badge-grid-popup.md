# 06: Skills — Skill Badge grid & Skill Popup

**What to build:** The signature section: a grid of equal-size rectangles, each a Skill Badge (technology icon + name) from the Content Source. Hovering scales the badge and shows a Skill Popup with the one-line blurb while its background animates from transparent to the skill's Brand Gradient — the only saturated pixels on the page. Touch devices toggle the popup by tap; keyboard users focus in. Entrance is a quiet fade.

**Blocked by:** 01 (Scaffold, theme tokens & Content Source).

**Status:** ready-for-agent

- [ ] Grid of equal-size rectangles rendered from the Content Source skills list
- [ ] Hover: badge scales up, Skill Popup shows the one-line blurb, background animates transparent → Brand Gradient (orchestrated moment #2)
- [ ] Tap toggles the popup on touch devices
- [ ] Badges are keyboard focusable; popup opens on focus/Enter
- [ ] Entrance is a ≤150ms quiet fade, not staggered
- [ ] Grayscale discipline verified: no saturated color anywhere except Brand Gradients
- [ ] With `prefers-reduced-motion`, scale/gradient animation is reduced to an instant state change
