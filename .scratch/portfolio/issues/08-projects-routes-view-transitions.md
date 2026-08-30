# 08: Projects list, detail routes & view transitions

**What to build:** Projects end-to-end: editorial list rows on the one-pager (index numeral encoding recency — newest is 01 — large title, tags right-aligned, hover shift/underline), where clicking a row animates a view transition into a statically prerendered, deep-linkable project detail page that renders that Project Entry's readme through the Readme Detail renderer. Unknown slugs get a styled 404. Orchestrated moment #3 of three.

**Blocked by:** 03 (Anchor navbar & smooth scroll), 07 (Readme Detail renderer & the test seam).

**Status:** ready-for-agent

- [ ] Editorial rows rendered from the Content Source: recency index numeral (newest = 01), large title, tags right-aligned
- [ ] Row hover: shift/underline invites clicking
- [ ] Click → animated view transition into the detail route (orchestrated moment #3)
- [ ] Detail routes prerendered per Project Entry; direct deep links load them correctly
- [ ] Detail page renders the entry's readme via the Readme Detail renderer
- [ ] Unknown project URL shows a styled 404
- [ ] With `prefers-reduced-motion`, transitions reduce to instant navigation
