import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { getLenis } from "../lib/lenis";

type Props = ({ src: string; alt?: string } | { svg: string }) & {
  onClose: () => void;
};

function DiagramContent({ svg }: { svg: string }) {
  const viewBox = svg.match(/viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/);
  const ratio = viewBox ? Number(viewBox[1]) / Number(viewBox[2]) : null;
  const widthCapped =
    ratio !== null &&
    ratio > window.innerWidth / window.innerHeight &&
    window.innerWidth * 0.8 > 1024;
  return (
    <div
      className="max-w-full rounded-xl border border-text/10 bg-base p-4 [&_svg]:h-auto [&_svg]:w-full [&_svg]:max-h-[80vh] [&_svg]:max-w-full!"
      style={
        ratio
          ? {
              width: widthCapped
                ? "80vw"
                : `min(100%, calc(80vh * ${ratio}))`,
            }
          : undefined
      }
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function ImageContent({ src, alt }: { src: string; alt?: string }) {
  return (
    <img
      src={src}
      alt={alt ?? ""}
      className="max-h-[80vh] max-w-full min-[1281px]:max-w-[80vw] rounded-xl object-contain"
    />
  );
}

export default function Lightbox(props: Props) {
  const { onClose } = props;
  const [shown, setShown] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const lenis = getLenis();
    const root = document.documentElement;
    let prevOverflow: string | null = null;
    if (lenis) {
      lenis.stop();
    } else {
      prevOverflow = root.style.overflow;
      root.style.overflow = "hidden";
    }
    // Fallback event for Lenis instances initialized via Astro island
    document.dispatchEvent(new CustomEvent("lenis:stop"));
    const raf = requestAnimationFrame(() => setShown(true));
    return () => {
      cancelAnimationFrame(raf);
      document.dispatchEvent(new CustomEvent("lenis:start"));
      if (lenis) {
        lenis.start();
      } else if (prevOverflow !== null) {
        root.style.overflow = prevOverflow;
      }
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") event.preventDefault();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Portaled to document.body: the README pane's clip-path and overflow-hidden
  // ancestors (the sweep layers) would clip a fixed-position overlay rendered in place.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={
        "svg" in props ? "Fullscreen diagram" : props.alt || "Fullscreen image"
      }
      onClick={onClose}
      className={`fixed inset-0 flex items-center justify-center bg-black/75 p-6 transition-opacity duration-150 motion-reduce:transition-none backdrop-blur-xs ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      <figure
        onClick={(event) => event.stopPropagation()}
        className={`flex w-full max-h-full max-w-full flex-col items-center gap-4 transition-transform duration-150 motion-reduce:transition-none ${
          shown ? "scale-100" : "scale-95"
        }`}
      >
        {"svg" in props ? (
          <DiagramContent svg={props.svg} />
        ) : (
          <ImageContent src={props.src} alt={props.alt} />
        )}
        {"src" in props && props.alt ? (
          <figcaption className="max-w-full">{props.alt}</figcaption>
        ) : null}
      </figure>
      <button
        ref={closeRef}
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 cursor-pointer rounded border border-text/25 bg-base/60 p-2 text-text transition-colors hover:bg-text/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>,
    document.body,
  );
}
