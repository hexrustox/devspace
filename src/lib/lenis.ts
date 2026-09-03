import Lenis from "lenis";

let lenis: Lenis | null = null;

export function initLenis(options?: ConstructorParameters<typeof Lenis>[0]): Lenis | null {
  if (typeof window === "undefined") return null;
  if (lenis) return lenis;
  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.1,
    duration: 1.2,
    gestureOrientation: "vertical",
    smoothWheel: true,
    syncTouch: false,
    anchors: true,
    allowNestedScroll: true,
    // respectReducedMotion true (default) — Lenis disables smoothing when
    // prefers-reduced-motion is set, matching Aurora/ProjectBrowser guards
    ...options,
  });
  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function destroyLenis(): void {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}
