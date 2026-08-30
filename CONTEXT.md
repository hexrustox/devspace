# Portfolio

A one-page, animation-led portfolio website for showcasing the owner's skills and projects, built as a fully static site. This glossary defines the language of the site's content model and its two interactive surfaces: the skills grid and the project detail view.

## Language

### Content

**Content Source**:
The single file that holds every piece of site content: site identity, skills, and projects. Editing content never touches components.
_Avoid_: config, data file, CMS

**Project Entry**:
One project as declared in the Content Source: title, slug, blurb, tags, and a readme URL.
_Avoid_: repo, work item, card

### Skills grid

**Skill Badge**:
A rectangular tile in the skills grid showing one technology's icon and name; the only hover/tap target of the skills section.
_Avoid_: chip, pill, card

**Skill Popup**:
The card that appears when a Skill Badge is hovered (or tapped on touch devices), showing the technology's one-line blurb over its Brand Gradient.
_Avoid_: tooltip, popover, modal

**Brand Gradient**:
The hand-tuned start/end color pair for a technology, sourced from its brand palette; animates the Skill Badge background from transparent on hover.
_Avoid_: theme color, accent, brand colors

### Project detail

**Readme Detail**:
The rendered view of a Project Entry's readme, fetched at runtime from its repository URL and styled to the site's dark theme.
_Avoid_: article, blog post, embed
