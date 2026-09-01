import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Project } from "../content";
import MarkdownRenderer from "./MarkdownRenderer";

type ReadmeState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; markdown: string };

const rawBase = (readmeUrl: string) => readmeUrl.replace(/[^/]*$/, "");

export default function ProjectBrowser({
  projects,
}: {
  projects: readonly Project[];
}) {
  const [selected, setSelected] = useState(0);
  const [state, setState] = useState<ReadmeState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const cache = useRef(new Map<string, string>());
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mounted = useRef(false);

  const project = projects[selected];
  const base = project ? rawBase(project.readmeUrl) : "";

  useEffect(() => {
    const behavior = mounted.current ? "smooth" : "auto";
    mounted.current = true;
    itemRefs.current[selected]?.scrollIntoView({
      behavior,
      inline: "center",
      block: "nearest",
    });
  }, [selected]);

  useEffect(() => {
    if (!project) return;
    const cached = cache.current.get(project.readmeUrl);
    if (cached !== undefined) {
      setState({ status: "ready", markdown: cached });
      return;
    }
    const controller = new AbortController();
    setState({ status: "loading" });
    fetch(project.readmeUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((markdown) => {
        cache.current.set(project.readmeUrl, markdown);
        setState({ status: "ready", markdown });
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "error" });
      });
    return () => controller.abort();
  }, [project, attempt]);

  useEffect(() => {
    for (const p of projects) {
      if (cache.current.has(p.readmeUrl)) continue;
      fetch(p.readmeUrl)
        .then((res) => (res.ok ? res.text() : ""))
        .then((markdown) => {
          if (markdown) cache.current.set(p.readmeUrl, markdown);
        })
        .catch(() => {});
    }
  }, [projects]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next = Math.min(projects.length - 1, Math.max(0, selected + delta));
    if (next === selected) return;
    setSelected(next);
    itemRefs.current[next]?.focus();
  };

  return (
    <>
      <div
        aria-label="Projects"
        className="flex snap-x snap-mandatory justify-center-safe gap-3 overflow-x-auto py-4"
        onKeyDown={onKeyDown}
      >
        {projects.map((p, i) => (
          <button
            key={p.readmeUrl}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            type="button"
            onClick={() => setSelected(i)}
            aria-pressed={i === selected}
            className={`shrink-0 snap-center rounded-full border px-6 py-2.5 font-display text-body transition-colors duration-300 ${
              i === selected
                ? "border-text/40 bg-surface text-text"
                : "border-text/10 text-muted hover:border-text/25 hover:bg-surface hover:text-text"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="mt-2 h-[80vh] overflow-auto rounded-2xl border border-text/10 bg-surface p-6">
        {!project ? (
          <p className="text-caption text-muted">No projects yet.</p>
        ) : state.status === "loading" ? (
          <p className="text-caption text-muted animate-pulse">
            Loading README&hellip;
          </p>
        ) : state.status === "error" ? (
          <div>
            <p className="text-caption text-muted">
              Couldn&rsquo;t load the README.
            </p>
            <button
              type="button"
              onClick={() => setAttempt((n) => n + 1)}
              className="mt-4 rounded-full border border-text/25 px-4 py-1.5 text-caption transition-colors hover:bg-text/10 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Retry
            </button>
          </div>
        ) : (
          <MarkdownRenderer markdown={state.markdown} base={base} />
        )}
      </div>
    </>
  );
}
