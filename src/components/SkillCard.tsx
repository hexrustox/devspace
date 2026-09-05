import Glass from "./Glass";
import type { Skill } from "../content";

const CAN_HOVER =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover)").matches;

interface Props {
  skill: Skill;
}

export default function SkillCard({
  skill: { name, icon, blurb, colors },
}: Props) {
  const setAuroraColors = (value: Skill["colors"] | null) => {
    document.dispatchEvent(
      new CustomEvent("aurora:colors", { detail: { colors: value } }),
    );
  };

  return (
    <Glass
      onMouseEnter={() => {
        if (CAN_HOVER) setAuroraColors(colors);
      }}
      onMouseLeave={() => {
        if (CAN_HOVER) setAuroraColors(null);
      }}
      className="group aspect-square w-full"
    >
      <div className="p-4 aspect-square flex flex-col items-center justify-center text-center outline-none">
        <i className={`${icon} text-text text-4xl`}></i>
        <span className="mt-2 font-display text-body font-bold">{name}</span>
        <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-300 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 pointer-coarse:grid-rows-[1fr] pointer-coarse:opacity-100">
          <span className="min-h-0 overflow-hidden text-caption text-muted">
            {blurb}
          </span>
        </div>
      </div>
    </Glass>
  );
}
