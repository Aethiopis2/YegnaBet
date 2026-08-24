import {
  ChevronDown,
  Grid2X2,
  List,
} from "lucide-react";

import type {
  ListingSort,
  ListingView,
} from "../../types/explorer";

import { cn } from "../../lib/cn";

interface ExplorerToolbarProps {
  resultCount: number;
  sort: ListingSort;
  view: ListingView;
  onSortChange: (
    sort: ListingSort
  ) => void;
  onViewChange: (
    view: ListingView
  ) => void;
}

const sortLabels: Record<
  ListingSort,
  string
> = {
  recommended: "Recommended",
  newest: "Newest",
  "price-low": "Price: Low to High",
  "price-high": "Price: High to Low",
};

export function ExplorerToolbar({
  resultCount,
  sort,
  view,
  onSortChange,
  onViewChange,
}: ExplorerToolbarProps) {
  return (
    <div className="mt-6 flex items-center justify-between gap-3">
      <button
        type="button"
        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          border
          border-black/[0.06]
          bg-white
          px-3
          py-2.5
          text-xs
          text-gray-600
          dark:border-white/[0.07]
          dark:bg-white/[0.035]
          dark:text-gray-300
        "
      >
        <span className="font-medium">
          Sort by:
        </span>

        <span>
          {sortLabels[sort]}
        </span>

        <ChevronDown className="size-3.5 text-gray-400" />

        <select
          value={sort}
          onChange={(event) =>
            onSortChange(
              event.target.value as ListingSort
            )
          }
          className="
            absolute
            h-0
            w-0
            cursor-pointer
            opacity-0
          "
          aria-label="Sort listings"
        >
          {Object.entries(sortLabels).map(
            ([value, label]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            )
          )}
        </select>
      </button>

      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-gray-400 sm:inline">
          {resultCount} Results
        </span>

        <div
          className="
            flex
            rounded-xl
            border
            border-black/[0.06]
            bg-white
            p-1
            dark:border-white/[0.07]
            dark:bg-white/[0.035]
          "
        >
          <ViewButton
            active={view === "grid"}
            onClick={() => onViewChange("grid")}
          >
            <Grid2X2 className="size-4" />
          </ViewButton>

          <ViewButton
            active={view === "list"}
            onClick={() => onViewChange("list")}
          >
            <List className="size-4" />
          </ViewButton>
        </div>
      </div>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "grid size-8 place-items-center rounded-lg",
        "transition-all duration-200",
        active
          ? "bg-yegna-700 text-white"
          : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      )}
    >
      {children}
    </button>
  );
}