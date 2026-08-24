import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

interface DropdownProps {
  open: boolean;
  children: ReactNode;
  className?: string;
  align?: "left" | "right";
}

export function Dropdown({
  open,
  children,
  className,
  align = "right",
}: DropdownProps) {
  return (
    <div
      className={cn(
        "absolute top-[calc(100%+0.75rem)] z-50",
        "w-[min(22rem,calc(100vw-2rem))]",
        "origin-top",
        "rounded-2xl border",
        "border-black/7 dark:border-white/10",
        "bg-white/95 dark:bg-[#17201b]/95",
        "shadow-[0_20px_60px_rgba(0,0,0,0.12)]",
        "backdrop-blur-xl",
        "transition-all duration-200 ease-out",

        align === "right" && "right-0",
        align === "left" && "left-0",

        open
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none -translate-y-2 scale-[0.97] opacity-0",

        className
      )}
    >
      {children}
    </div>
  );
}