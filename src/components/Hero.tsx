import { useEffect, useRef } from "react";
import Glass from "./Glass";
import { motion, useMotionValue, useTransform } from "motion/react";
import { site } from "../content";

const ctas = [
  { label: "View projects", href: "#projects" },
  { label: "Contact me", href: "#contact" },
] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const scrollProgress = useMotionValue(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      const heroHeight = ref.current?.offsetHeight ?? window.innerHeight;
      const y = window.scrollY;
      const progress =
        heroHeight > 0 ? Math.min(Math.max(y / heroHeight, 0), 1) : 0;
      scrollProgress.set(progress);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [scrollProgress]);

  const opacity = useTransform(scrollProgress, [0.1, 1], [1, 0]);
  const scale = useTransform(scrollProgress, [0.1, 1], [1, 0.9]);
  const blur = useTransform(
    scrollProgress,
    [0.1, 1],
    ["blur(0px)", "blur(10px)"],
  );

  return (
    <motion.section
      ref={ref}
      id="hero"
      className="sticky top-0 grid min-h-screen place-items-center"
      style={{ opacity, scale, filter: blur }}
    >
      <div className="flex flex-col items-center px-6 text-center">
        <h1 className="font-display text-display font-bold">
          Hello, I am a<br />
          Software Engineer
        </h1>
        <p className="text-body text-muted mt-6 max-w-xl">{site.description}</p>
        <div className="mt-8 flex gap-4">
          {ctas.map((cta) => (
            <Glass key={cta.href}>
              <a
                href={cta.href}
                className="font-display flex min-w-40 items-center justify-center py-3 font-bold focus-visible:outline-none"
              >
                {cta.label}
              </a>
            </Glass>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
