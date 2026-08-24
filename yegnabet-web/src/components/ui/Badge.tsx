import type { ReactNode } from "react";

import { cn } from "../lib/cn";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full",
        "px-2.5 py-1 text-[11px] font-semibold",
        "bg-yegna-700 text-white",
        className
      )}
    >
      {children}
    </span>
  );
}