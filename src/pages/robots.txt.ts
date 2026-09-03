import type { APIRoute } from "astro";
import { site } from "../content";

export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap-index.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
