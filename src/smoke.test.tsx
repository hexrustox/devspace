import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { projects, site } from "./content";

function SiteTitle() {
  return <h1>{site.name}</h1>;
}

test("test rig renders a React component fed by the Content Source", () => {
  render(<SiteTitle />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    site.name,
  );
});

test("project slugs are unique so deep links stay unambiguous", () => {
  const slugs = projects.map((project) => project.slug);
  expect(slugs.length).toBeGreaterThan(0);
  expect(new Set(slugs).size).toBe(slugs.length);
});
