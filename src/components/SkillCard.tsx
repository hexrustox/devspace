import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Glass from "./Glass";
import type { Skill } from "../content";

interface Props {
  skill: Skill;
}

export default function SkillCard({
  skill: { name, icon, blurb, url },
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Glass
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="aspect-square w-full"
    >
      <a
        href={url ?? undefined}
        className="p-4 aspect-square flex flex-col items-center justify-center text-center outline-none"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className={`${icon} text-text text-4xl`}></i>
        <span className="mt-2 font-display text-body font-bold">{name}</span>
        <AnimatePresence initial={false}>
          {open && (
            <motion.span
              initial={{ opacity: 0, y: 4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 4, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-caption text-muted mt-2 block overflow-hidden"
            >
              {blurb}
            </motion.span>
          )}
        </AnimatePresence>
      </a>
    </Glass>
  );
}
