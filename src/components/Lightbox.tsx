import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function Lightbox({ src, alt, onClose }: LightboxProps) {
  const [shown, setShown] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => setShown(true));
    return () => {
      cancelAnimationFrame(raf);
      root.style.overflow = prevOverflow;
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
      aria-label={alt || "Fullscreen image"}
      onClick={onClose}
      className={`fixed inset-0 flex items-center justify-center bg-black/75 p-6 transition-opacity duration-150 motion-reduce:transition-none backdrop-blur-xs ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      <figure
        onClick={(event) => event.stopPropagation()}
        className={`flex max-h-full max-w-full flex-col items-center gap-4 transition-transform duration-150 motion-reduce:transition-none ${
          shown ? "scale-100" : "scale-95"
        }`}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[85vh] max-w-full rounded-xl object-contain"
        />
        {alt ? (
          <figcaption className="max-w-full text-caption text-muted">
            {alt}
          </figcaption>
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
