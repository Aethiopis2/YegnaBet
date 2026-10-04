import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { cn } from "../../lib/cn";
import type { UserProfile } from "../../types/customer/profile";
import type { TaxonomyNode } from "../../types/common/taxonomy";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  currentUser: UserProfile | null;
  categories?: TaxonomyNode[] | null;
}

export function SectionHeader({
  title,
  actionLabel = "View all",
  actionHref = "#",
  className,
  currentUser,
  categories
}: SectionHeaderProps) {
  const navigate = useNavigate();

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
        <span
          onClick={() => navigate(actionHref, {
            state: {
              currentUser,
              categories
            }
          })} 
          className="group inline-flex shrink-0 items-center gap-1 cursor-pointer
            text-sm font-medium text-yegna-700 dark:text-yegna-300"
        >
          {actionLabel}

          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </span>
      )}
    </div>
  );
}