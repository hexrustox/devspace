import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Glass from "./Glass";
import type { Skill } from "../content";

interface Props {
  skill: Skill;
}

export default function SkillCard({
  skill: { name, icon, blurb, colors },
}: Props) {
  const [open, setOpen] = useState(false);

  const setAuroraColors = (value: Skill["colors"] | null) => {
    document.dispatchEvent(
      new CustomEvent("aurora:colors", { detail: { colors: value } }),
    );
  };

  return (
    <Glass
      onMouseEnter={() => {
        setOpen(true);
        setAuroraColors(colors);
      }}
      onMouseLeave={() => {
        setOpen(false);
        setAuroraColors(null);
      }}
      className="aspect-square w-full"
    >
      <div className="p-4 aspect-square flex flex-col items-center justify-center text-center outline-none">
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
      </div>
    </Glass>
  );
}
