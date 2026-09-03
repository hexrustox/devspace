import {
  Children,
  cloneElement,
  isValidElement,
  memo,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Info,
  Lightbulb,
  Maximize2,
  MessageSquareWarning,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import Lightbox from "./Lightbox";

const resolveSrc = (src: string, base: string) => {
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(src) || src.startsWith("//")) {
    return src;
  }
  try {
    return new URL(src, base).href;
  } catch {
    return src;
  }
};

const resolveSrcSet = (value: string, base: string) =>
  value
    .split(",")
    .map((part) => {
      const [url, ...descriptors] = part.trim().split(/\s+/);
      if (!url) return "";
      return [resolveSrc(url, base), ...descriptors].join(" ");
    })
    .filter(Boolean)
    .join(", ");

const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeRaw, rehypeSanitize];

const cssVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

type HastNode = {
  type?: string;
  tagName?: string;
  value?: string;
  children?: HastNode[];
};

const ALERT_MARKER = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i;

const ALERT_TYPES = {
  NOTE: {
    label: "Note",
    className: "border-blue bg-blue/10",
    titleClassName: "text-blue",
    icon: Info,
  },
  TIP: {
    label: "Tip",
    className: "border-green bg-green/10",
    titleClassName: "text-green",
    icon: Lightbulb,
  },
  IMPORTANT: {
    label: "Important",
    className: "border-purple bg-purple/10",
    titleClassName: "text-purple",
    icon: MessageSquareWarning,
  },
  WARNING: {
    label: "Warning",
    className: "border-amber bg-amber/10",
    titleClassName: "text-amber",
    icon: TriangleAlert,
  },
  CAUTION: {
    label: "Caution",
    className: "border-red bg-red/10",
    titleClassName: "text-red",
    icon: OctagonAlert,
  },
} as const;

type AlertKey = keyof typeof ALERT_TYPES;

const findAlertKey = (node: unknown): AlertKey | null => {
  const siblings = (node as HastNode | undefined)?.children ?? [];
  let first: HastNode | undefined;
  for (const child of siblings) {
    if (child.type === "element") {
      first = child;
      break;
    }
  }
  if (!first || first.tagName !== "p") return null;
  for (const child of first.children ?? []) {
    if (child.type === "text") {
      const match = ALERT_MARKER.exec(child.value ?? "");
      return match ? (match[1].toUpperCase() as AlertKey) : null;
    }
  }
  return null;
};

const isEmptyLead = (child: ReactNode) =>
  typeof child === "string"
    ? child.trim() === ""
    : isValidElement(child) && child.type === "br";

const alertBody = (children: ReactNode): ReactNode[] | null => {
  const items = Children.toArray(children);
  const firstIndex = items.findIndex((item) => isValidElement(item));
  if (firstIndex === -1) return null;
  const first = items[firstIndex];
  if (!isValidElement<{ children?: ReactNode }>(first)) return null;
  const inner = first.props.children;
  let processed: ReactElement<{ children?: ReactNode }> | null;
  if (typeof inner === "string") {
    const rest = inner.replace(ALERT_MARKER, "");
    if (rest === inner) return null;
    processed = rest.trim() ? cloneElement(first, { children: rest }) : null;
  } else if (Array.isArray(inner)) {
    const markerIndex = inner.findIndex(
      (child) => typeof child === "string" && ALERT_MARKER.test(child),
    );
    if (markerIndex === -1) return null;
    let next: ReactNode[] = inner.map((child, i) =>
      i === markerIndex && typeof child === "string"
        ? child.replace(ALERT_MARKER, "")
        : child,
    );
    next = next.filter((child) => child !== "");
    while (next.length > 0 && isEmptyLead(next[0])) next = next.slice(1);
    processed =
      next.length > 0 ? cloneElement(first, { children: next }) : null;
  } else {
    return null;
  }
  return [
    ...items.slice(0, firstIndex),
    ...(processed ? [processed] : []),
    ...items.slice(firstIndex + 1),
  ];
};

function Mermaid({
  chart,
  onFullscreen,
}: {
  chart: string;
  onFullscreen?: (svg: string) => void;
}) {
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  useEffect(() => {
    let cancelled = false;
    setSvg(null);
    setFailed(false);
    import("mermaid")
      .then(({ default: mermaid }) => {
        if (cancelled) return;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "dark",
          themeVariables: {
            background: cssVar("--color-base"),
            primaryColor: cssVar("--color-surface"),
            secondaryColor: cssVar("--color-surface"),
            tertiaryColor: cssVar("--color-surface"),
            primaryTextColor: cssVar("--color-text"),
            mainBkg: cssVar("--color-surface"),
            nodeBorder: cssVar("--color-muted"),
            textColor: cssVar("--color-text"),
            lineColor: cssVar("--color-muted"),
            fontSize: "0.875rem",
          },
        });
        return mermaid.render(`mermaid-${uid}`, chart).then(({ svg }) => {
          if (!cancelled) setSvg(svg);
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [chart, uid]);

  if (failed) {
    return (
      <pre className="text-caption my-4 overflow-x-auto rounded-xl border border-text/10 bg-base p-4 font-mono leading-relaxed">
        {chart}
      </pre>
    );
  }
  if (!svg) {
    return (
      <p className="text-caption text-muted my-4 animate-pulse">
        Rendering diagram&hellip;
      </p>
    );
  }
  return (
    <div className="group relative my-4">
      <div
        className="[&_svg]:mx-auto overflow-x-auto rounded-xl border border-text/10 bg-base p-4"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {onFullscreen ? (
        <button
          type="button"
          aria-label="View fullscreen"
          onClick={() => onFullscreen(svg)}
          className="pointer-coarse:opacity-100 absolute top-2 right-2 cursor-pointer rounded border border-text/25 bg-base/60 p-1.5 text-text opacity-0 transition-opacity focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text group-hover:opacity-100"
        >
          <Maximize2 className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

type Viewing =
  | { kind: "image"; src: string; alt: string }
  | { kind: "diagram"; svg: string };

interface Props {
  markdown: string;
  base: string;
}

export default memo(function MarkdownRenderer({ markdown, base }: Props) {
  const [viewing, setViewing] = useState<Viewing | null>(null);

  const components: Components = useMemo(
    () => ({
      a: ({ node, children, ...props }) => (
        <a {...props} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
      img: ({ node, alt, src, ...props }) => {
        const resolved = typeof src === "string" ? resolveSrc(src, base) : null;
        const canFullscreen =
          resolved !== null && /\.(png|jpg)$/i.test(resolved);
        return (
          <span className="group relative w-fit">
            <img
              {...props}
              src={resolved ?? src}
              alt={alt ?? ""}
              loading="lazy"
              className="rounded-lg inline-block h-auto max-w-full align-middle"
            />
            {canFullscreen ? (
              <button
                type="button"
                aria-label="View fullscreen"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setViewing({ kind: "image", src: resolved, alt: alt ?? "" });
                }}
                className="pointer-coarse:opacity-100 absolute mt-2 right-2 cursor-pointer rounded border border-text/25 bg-base/60 p-1.5 text-text opacity-0 transition-opacity focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text group-hover:opacity-100"
              >
                <Maximize2 className="size-4" aria-hidden="true" />
              </button>
            ) : null}
          </span>
        );
      },
      source: ({ node, srcSet, ...props }) => (
        <source
          {...props}
          srcSet={
            typeof srcSet === "string" ? resolveSrcSet(srcSet, base) : srcSet
          }
        />
      ),
      kbd: ({ node, ...props }) => (
        <kbd
          {...props}
          className="text-caption rounded border border-text/10 bg-base px-1.5 py-0.5 font-mono"
        />
      ),
      summary: ({ node, ...props }) => (
        <summary {...props} className="cursor-pointer" />
      ),
      input: ({ node, ...props }) => (
        <input {...props} className="mr-1.5 align-middle" />
      ),
      h1: ({ node, ...props }) => (
        <h1
          {...props}
          className="font-display font-bold text-heading mt-8 mb-4 first:mt-0"
        />
      ),
      h2: ({ node, ...props }) => (
        <h2
          {...props}
          className="font-display font-bold text-xl mt-8 mb-3 first:mt-0"
        />
      ),
      h3: ({ node, ...props }) => (
        <h3
          {...props}
          className="font-display font-bold text-lg mt-6 mb-2 first:mt-0"
        />
      ),
      h4: ({ node, ...props }) => (
        <h4
          {...props}
          className="font-display font-bold text-body mt-6 mb-2 first:mt-0"
        />
      ),
      p: ({ node, ...props }) => (
        <p {...props} className="text-body my-3 first:mt-0" />
      ),
      strong: ({ node, ...props }) => (
        <strong {...props} className="font-semibold text-text" />
      ),
      ul: ({ node, ...props }) => (
        <ul
          {...props}
          className="text-body my-3 list-disc space-y-1 pl-6 marker:text-muted"
        />
      ),
      ol: ({ node, ...props }) => (
        <ol
          {...props}
          className="text-body my-3 list-decimal space-y-1 pl-6 marker:text-muted"
        />
      ),
      li: ({ node, ...props }) => <li {...props} className="pl-1" />,
      blockquote: ({ node, children, ...props }) => {
        const alertKey = findAlertKey(node);
        const body = alertKey ? alertBody(children) : null;
        if (alertKey && body) {
          const {
            label,
            icon: Icon,
            className,
            titleClassName,
          } = ALERT_TYPES[alertKey];
          return (
            <blockquote
              {...props}
              className={`my-4 rounded-r-xl border-l-4 px-4 py-3 not-italic ${className}`}
            >
              <p
                className={`text-body m-0 mb-1.5 flex items-center gap-2 font-semibold ${titleClassName}`}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {label}
              </p>
              {body}
            </blockquote>
          );
        }
        return (
          <blockquote
            {...props}
            className="text-muted my-4 border-l-2 border-text/20 pl-4 italic"
          >
            {children}
          </blockquote>
        );
      },
      code: ({ node, ...props }) => (
        <code
          {...props}
          className="text-caption rounded border border-text/10 bg-base px-1.5 py-0.5 font-mono"
        />
      ),
      pre: ({ node, ...props }) => {
        const { children } = props;
        const child = Array.isArray(children) ? children[0] : children;
        if (
          isValidElement<{ className?: string; children?: ReactNode }>(child) &&
          /language-mermaid/.test(child.props.className ?? "")
        ) {
          return (
            <Mermaid
              chart={String(child.props.children).replace(/\n$/, "")}
              onFullscreen={(svg) => setViewing({ kind: "diagram", svg })}
            />
          );
        }
        return (
          <pre
            {...props}
            className="[&>code]:rounded-none [&>code]:border-0 [&>code]:bg-transparent [&>code]:px-0 [&>code]:py-0 my-4 overflow-x-auto rounded-xl border border-text/10 bg-base p-4 text-caption leading-relaxed"
          />
        );
      },
      table: ({ node, ...props }) => (
        <table
          {...props}
          className="text-caption my-4 w-full border-collapse"
        />
      ),
      th: ({ node, ...props }) => (
        <th
          {...props}
          className="border border-text/10 px-3 py-2 text-left font-semibold"
        />
      ),
      td: ({ node, ...props }) => (
        <td {...props} className="border border-text/10 px-3 py-2 align-top" />
      ),
      hr: ({ node, ...props }) => (
        <hr {...props} className="my-6 border-text/10" />
      ),
    }),
    [base],
  );

  return (
    <>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
      {viewing ? (
        viewing.kind === "image" ? (
          <Lightbox
            src={viewing.src}
            alt={viewing.alt}
            onClose={() => setViewing(null)}
          />
        ) : (
          <Lightbox svg={viewing.svg} onClose={() => setViewing(null)} />
        )
      ) : null}
    </>
  );
});
