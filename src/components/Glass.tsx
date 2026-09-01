import type { ReactNode } from "react";

interface Props {
  className?: string;
  children: ReactNode;
}

export default function Glass({ className = "", children }: Props) {
  return (
    <span
      className={`"inline-flex rounded-xl border border-text/15 bg-text/10 backdrop-blur-md transition-colors hover:bg-text/20 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-[:focus-visible]:outline-text" ${className}`}
    >
      {children}
    </span>
  );
}
