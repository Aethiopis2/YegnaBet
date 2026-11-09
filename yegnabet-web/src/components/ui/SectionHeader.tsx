import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { cn } from "../../lib/cn";
import type { TaxonomyNode } from "../../types/customer/taxonomy";
import type { AuthUser } from "../../types/auth/authTypes";
import type { ListingMode } from "../../types/customer/listings";

interface SectionHeaderProps {
  title: string;
  listingMode: ListingMode;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  user: AuthUser| null;
  categories?: TaxonomyNode[] | null;
}

export function SectionHeader({
  title,
  listingMode,
  actionLabel = "View all",
  actionHref = "#",
  className,
  user,
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
              user,
              listingMode,
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