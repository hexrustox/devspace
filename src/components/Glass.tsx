import type { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

export default function Glass({ className = "", children, ...props }: Props) {
  return (
    <div
      {...props}
      className={`inline-flex rounded-xl border border-text/15 bg-text/10 backdrop-blur-md transition-colors hover:bg-text/20 has-focus-visible:outline-2 has-focus-visible:outline-text has-focus-visible:outline-offset-2 ${className}`}
    >
      {children}
    </div>
  );
}
