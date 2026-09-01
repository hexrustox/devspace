import {
  isValidElement,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

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

const mermaidThemeVariables = {
  background: "#0a0a0b",
  primaryColor: "#131316",
  secondaryColor: "#131316",
  tertiaryColor: "#131316",
  primaryTextColor: "#ededef",
  textColor: "#ededef",
  lineColor: "#8a8a93",
  mainBkg: "#131316",
  nodeBorder: "#8a8a93",
  fontSize: "0.875rem",
} as const;

function Mermaid({ chart }: { chart: string }) {
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
          themeVariables: { ...mermaidThemeVariables },
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
    <div
      className="[&_svg]:mx-auto my-4 overflow-x-auto rounded-xl border border-text/10 bg-base p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

interface RendererProps {
  markdown: string;
  base: string;
}

export default function MarkdownRenderer({ markdown, base }: RendererProps) {
  const components: Components = {
    a: ({ node, children, ...props }) => (
      <a {...props} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    img: ({ node, alt, src, ...props }) => (
      <img
        {...props}
        src={typeof src === "string" ? resolveSrc(src, base) : src}
        alt={alt ?? ""}
        loading="lazy"
        className="inline-block h-auto max-w-full align-middle"
      />
    ),
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
        className="font-display text-heading mt-8 mb-4 first:mt-0"
      />
    ),
    h2: ({ node, ...props }) => (
      <h2 {...props} className="font-display text-xl mt-8 mb-3 first:mt-0" />
    ),
    h3: ({ node, ...props }) => (
      <h3 {...props} className="font-display text-lg mt-6 mb-2 first:mt-0" />
    ),
    h4: ({ node, ...props }) => (
      <h4 {...props} className="font-display text-body mt-6 mb-2 first:mt-0" />
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
    blockquote: ({ node, ...props }) => (
      <blockquote
        {...props}
        className="text-muted my-4 border-l-2 border-text/20 pl-4 italic"
      />
    ),
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
          <Mermaid chart={String(child.props.children).replace(/\n$/, "")} />
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
      <table {...props} className="text-caption my-4 w-full border-collapse" />
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
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={components}
    >
      {markdown}
    </ReactMarkdown>
  );
}
