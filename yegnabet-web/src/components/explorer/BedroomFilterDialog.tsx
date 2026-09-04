import { useEffect, useState } from "react";
import { BedDouble, X } from "lucide-react";

import type { ListingFilters } from "../../types/explorer";

interface BedroomFilterDialogProps {
  open: boolean;
  filters: ListingFilters;
  onClose: () => void;
  onApply: (bedrooms: number | undefined) => void;
}

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5, 6];

export function BedroomFilterDialog({
  open,
  filters,
  onClose,
  onApply,
}: BedroomFilterDialogProps) {
  const [bedrooms, setBedrooms] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    if (open) {
      setBedrooms(filters.bedrooms);
    }
  }, [open, filters.bedrooms]);

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-end justify-center
        bg-black/30
        p-4
        backdrop-blur-[2px]
        sm:items-center
      "
      onMouseDown={onClose}
    >
      <div
        className="
          w-full max-w-sm
          rounded-2xl
          border border-black/[0.06]
          bg-white
          p-5
          shadow-2xl
          dark:border-white/[0.08]
          dark:bg-zinc-900
        "
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Bedrooms
            </h3>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              How many bedrooms do you need?
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              grid size-8 place-items-center
              rounded-full
              text-gray-400
              hover:bg-gray-100
              hover:text-gray-700
              dark:hover:bg-white/10
              dark:hover:text-white
            "
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setBedrooms(undefined)}
            className={`
              flex h-16 flex-col
              items-center justify-center
              gap-1
              rounded-xl
              border
              text-xs
              transition
              ${
                bedrooms === undefined
                  ? `
                    border-yegna-500
                    bg-yegna-50
                    text-yegna-700
                    dark:bg-yegna-500/10
                    dark:text-yegna-400
                  `
                  : `
                    border-gray-200
                    text-gray-600
                    hover:border-yegna-300
                    dark:border-white/10
                    dark:text-gray-400
                  `
              }
            `}
          >
            <span className="font-semibold">
              Any
            </span>

            <span className="text-[9px] opacity-60">
              Bedrooms
            </span>
          </button>

          {BEDROOM_OPTIONS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setBedrooms(value)}
              className={`
                flex h-16 flex-col
                items-center justify-center
                gap-1
                rounded-xl
                border
                transition
                ${
                  bedrooms === value
                    ? `
                      border-yegna-500
                      bg-yegna-50
                      text-yegna-700
                      dark:bg-yegna-500/10
                      dark:text-yegna-400
                    `
                    : `
                      border-gray-200
                      text-gray-600
                      hover:border-yegna-300
                      dark:border-white/10
                      dark:text-gray-400
                    `
                }
              `}
            >
              <BedDouble className="size-4" />

              <span className="text-xs font-semibold">
                {value}+
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => onApply(undefined)}
            className="
              h-10 flex-1
              rounded-xl
              text-xs font-medium
              text-gray-600
              hover:bg-gray-100
              dark:text-gray-400
              dark:hover:bg-white/10
            "
          >
            Clear
          </button>

          <button
            type="button"
            onClick={() => onApply(bedrooms)}
            className="
              h-10 flex-[1.5]
              rounded-xl
              bg-yegna-600
              text-xs font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-yegna-700
            "
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}