import {
  lazy,
  Suspense,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import type { Project } from "../content";
import Glass from "./Glass";

const MarkdownRenderer = lazy(() => import("./MarkdownRenderer"));

type ReadmeState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; markdown: string };

type Phase =
  | { kind: "raw" }
  | { kind: "sweep"; dir: "forward" | "backward" }
  | { kind: "read" };

const SWEEP_MS = 700;
const SWEEP_MS_REDUCED = 200;
const RAW_HOLD = 400;
const SWEEP_EASING = "cubic-bezier(0.65, 0, 0.35, 1)";

const rawBase = (readmeUrl: string) => readmeUrl.replace(/[^/]*$/, "");

const FENCE = /^\s*(```|~~~)/;
const HEADING_RE = /^#{1,6}\s/;
const BLOCKQUOTE_RE = /^>/;

function RawSource({ markdown }: { markdown: string }) {
  let inFence = false;
  return (
    <pre className="font-mono text-caption leading-relaxed whitespace-pre-wrap wrap-break-word">
      {markdown.split("\n").map((line, i) => {
        const isEdge = FENCE.test(line);
        const wasFence = inFence;
        if (isEdge) inFence = !inFence;
        const cls =
          isEdge || wasFence
            ? "text-muted/70"
            : HEADING_RE.test(line)
              ? "text-text font-medium"
              : BLOCKQUOTE_RE.test(line)
                ? "text-muted italic"
                : "text-muted";
        return (
          <span key={i} className={`block ${cls}`}>
            {line === "" ? "\u00A0" : line}
          </span>
        );
      })}
    </pre>
  );
}

export default function ProjectBrowser({
  projects,
}: {
  projects: readonly Project[];
}) {
  const [selected, setSelected] = useState(0);
  const [state, setState] = useState<ReadmeState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [phase, setPhase] = useState<Phase>({ kind: "raw" });
  const [wipe, setWipe] = useState(0);
  const [seen, setSeen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [panelContent, setPanelContent] = useState<{
    url: string;
    markdown: string;
  } | null>(null);

  const cache = useRef(new Map<string, string>());
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const rawRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const mounted = useRef(false);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const project = projects[selected];
  const sweeping = phase.kind === "sweep";
  const sweepMs = reduced ? SWEEP_MS_REDUCED : SWEEP_MS;
  const phaseKind = phase.kind;
  const phaseDir = phase.kind === "sweep" ? phase.dir : null;
  const stateStatus = state.status;
  const stateMarkdown = state.status === "ready" ? state.markdown : null;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

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
    const controllers: AbortController[] = [];
    const toPrefetch = projects.filter(
      (p) => !cache.current.has(p.readmeUrl) && p.readmeUrl !== project?.readmeUrl,
    );
    for (const p of toPrefetch) {
      const controller = new AbortController();
      controllers.push(controller);
      fetch(p.readmeUrl, { signal: controller.signal })
        .then((res) => (res.ok ? res.text() : ""))
        .then((markdown) => {
          if (markdown) cache.current.set(p.readmeUrl, markdown);
        })
        .catch(() => {});
    }
    return () => {
      for (const c of controllers) c.abort();
    };
  }, [projects, project?.readmeUrl]);

  useEffect(() => {
    if (!seen || !project || phaseKind !== "raw" || stateStatus !== "ready")
      return;
    setPanelContent({ url: project.readmeUrl, markdown: stateMarkdown! });
    const t = setTimeout(() => {
      setPhase({ kind: "sweep", dir: "forward" });
      setWipe(1);
    }, RAW_HOLD);
    return () => clearTimeout(t);
  }, [seen, phaseKind, selected, attempt, stateStatus, stateMarkdown, project?.readmeUrl]);

  useEffect(() => {
    if (phaseKind !== "sweep") return;
    const t = setTimeout(() => {
      setPhase(phaseDir === "forward" ? { kind: "read" } : { kind: "raw" });
    }, sweepMs);
    return () => clearTimeout(t);
  }, [phaseKind, phaseDir, sweepMs]);

  useEffect(() => {
    rawRef.current?.scrollTo({ top: 0 });
    panelRef.current?.scrollTo({ top: 0 });
  }, [selected]);

  useEffect(() => {
    const behavior = mounted.current && !reduced ? "smooth" : "auto";
    mounted.current = true;
    tabRefs.current[selected]?.scrollIntoView({
      behavior,
      inline: "center",
      block: "nearest",
    });
  }, [selected, reduced]);

  const select = (i: number) => {
    if (i === selected) return;
    setSelected(i);
    if (!seen) return;
    if (phase.kind === "raw") return;
    if (phase.kind === "sweep" && phase.dir === "backward") return;
    setPhase({ kind: "sweep", dir: "backward" });
    setWipe(0);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = projects.length - 1;
    let next: number;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = Math.min(last, selected + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = Math.max(0, selected - 1);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    event.preventDefault();
    if (next === selected) return;
    select(next);
    tabRefs.current[next]?.focus();
  };

  if (!project) {
    return <p className="text-caption text-muted">No projects yet.</p>;
  }

  const sheetStyle = useMemo(
    () =>
      ({
        "--wipe": wipe,
        transition: reduced ? undefined : `--wipe ${SWEEP_MS}ms ${SWEEP_EASING}`,
      }) as CSSProperties,
    [wipe, reduced],
  );

  return (
    <>
      <div
        role="tablist"
        aria-label="Projects"
        onKeyDown={onKeyDown}
        className="flex gap-2"
      >
        {projects.map((p, i) => (
          <Glass key={p.readmeUrl} hover={i !== selected}>
            <button
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-selected={i === selected}
              aria-controls={`${uid}-panel`}
              tabIndex={i === selected ? 0 : -1}
              onClick={() => select(i)}
              className={`px-4 py-2 font-display font-bold transition-colors focus-visible:outline-none ${
                i === selected
                  ? "text-text"
                  : "text-muted hover:text-text cursor-pointer"
              }`}
            >
              {p.name}
            </button>
          </Glass>
        ))}
      </div>

      <div ref={wrapRef} className="flex mt-4">
        <Glass
          hover={false}
          style={sheetStyle}
          aria-busy={sweeping}
          className="relative h-[70vh] w-full overflow-hidden md:h-[75vh]"
        >
          <div
            ref={rawRef}
            data-lenis-prevent
            aria-hidden={state.status !== "error"}
            className={`scrollbar-subtle absolute inset-0 o px-6 py-6 md:px-10 md:py-8 ${
              phase.kind === "read" ? "invisible" : "visible"
            }`}
            style={{
              clipPath: "inset(0 0 0 calc((var(--wipe)) * 100%))",
            }}
          >
            {state.status === "loading" ? (
              <p className="animate-pulse font-mono text-caption text-muted">
                Loading README&hellip;
              </p>
            ) : state.status === "error" ? (
              <>
                <p className="font-mono text-caption text-muted">
                  Couldn&rsquo;t load the README.
                </p>
                <button
                  type="button"
                  onClick={() => setAttempt((n) => n + 1)}
                  className="mt-4 rounded-full border border-text/25 px-4 py-1.5 text-caption transition-colors hover:bg-text/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                >
                  Retry
                </button>
              </>
            ) : (
              <RawSource markdown={state.markdown} />
            )}
          </div>

          <div
            id={`${uid}-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${selected}`}
            className={`absolute inset-0 ${
              phase.kind === "raw" ? "invisible" : "visible"
            } ${reduced ? "transition-opacity" : ""}`}
            style={{
              clipPath: "inset(0 calc((1 - var(--wipe)) * 100%) 0 0)",
              opacity:
                reduced &&
                (phase.kind === "raw" ||
                  (phase.kind === "sweep" && phase.dir === "backward"))
                  ? 0
                  : 1,
            }}
          >
            <div
              ref={panelRef}
              data-lenis-prevent
              className="scrollbar-subtle h-full overflow-y-auto px-6 py-6 scrollbar-gutter-stable md:px-10 md:py-8"
            >
              {panelContent ? (
                <Suspense
                  fallback={
                    <p className="text-caption text-muted animate-pulse">
                      Rendering&hellip;
                    </p>
                  }
                >
                  <MarkdownRenderer
                    markdown={panelContent.markdown}
                    base={rawBase(panelContent.url)}
                  />
                </Suspense>
              ) : null}
            </div>
          </div>

          {!reduced && (
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-y-0 w-px bg-text transition-opacity ${
                sweeping ? "opacity-100" : "opacity-0"
              }`}
              style={{
                left: "calc(var(--wipe) * 100%)",
                boxShadow:
                  "0 0 12px 1px color-mix(in oklab, var(--color-text) 60%, transparent)",
              }}
            />
          )}
        </Glass>
      </div>
    </>
  );
}
