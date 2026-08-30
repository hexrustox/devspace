# Static site with runtime readme fetch

Project detail pages must show each project's live readme, including repo-relative screenshots, and the site must remain fully static for hosting on a plain Caddy file server. We decided to statically prerender detail-page shells from the Content Source and fetch the readme from its raw repository URL in the browser at view time, rewriting relative image/link paths against the repository's raw base URL so screenshots render.

Status: accepted

## Considered Options

- **Build-time vendoring** (bundle readmes into the build): no runtime dependency, but documentation goes stale and every project change forces a site rebuild. Rejected because live readme rendering was a hard requirement.
- **GitHub API auto-listing**: removes curation, but projects then appear in API order with uncontrolled metadata. Rejected in favor of the curated Content Source.

## Consequences

- The visitor's browser must be able to reach raw.githubusercontent.com; the fetch therefore needs explicit loading and error states.
- Relative path rewriting is mandatory — without it, repo-relative screenshots 404.
- The site gains a zero-backend deployment story: `dist/` is the entire artifact.
