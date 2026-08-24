import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "../../lib/cn";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export function SectionHeader({
  title,
  actionLabel = "View all",
  actionHref = "#",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4",
        className
      )}
    >
      <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-gray-900 dark:text-white">
        {title}
      </h2>

      {actionLabel && (
        <Link
          to={actionHref}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-yegna-700 dark:text-yegna-300"
        >
          {actionLabel}

          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}