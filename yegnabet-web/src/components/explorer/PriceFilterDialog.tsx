import { useEffect, useState } from "react";
import { X } from "lucide-react";

import type { ListingFilters } from "../../types/explorer";

interface PriceFilterDialogProps {
  open: boolean;
  filters: ListingFilters;
  onClose: () => void;
  onApply: (
    minPrice: number | undefined,
    maxPrice: number | undefined
  ) => void;
}

export function PriceFilterDialog({
  open,
  filters,
  onClose,
  onApply,
}: PriceFilterDialogProps) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    if (!open) return;

    setMinPrice(
      filters.minPrice !== undefined
        ? String(filters.minPrice)
        : ""
    );

    setMaxPrice(
      filters.maxPrice !== undefined
        ? String(filters.maxPrice)
        : ""
    );
  }, [open, filters.minPrice, filters.maxPrice]);

  if (!open) return null;

  const handleApply = () => {
    const min =
      minPrice.trim() !== ""
        ? Number(minPrice)
        : undefined;

    const max =
      maxPrice.trim() !== ""
        ? Number(maxPrice)
        : undefined;

    if (
      min !== undefined &&
      max !== undefined &&
      min > max
    ) {
      return;
    }

    onApply(min, max);
  };

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
              Price range
            </h3>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Set your preferred price range
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="min-price"
              className="
                mb-1.5 block
                text-[11px]
                font-medium
                text-gray-500
                dark:text-gray-400
              "
            >
              Minimum
            </label>

            <input
              id="min-price"
              type="number"
              min={0}
              value={minPrice}
              onChange={(event) =>
                setMinPrice(event.target.value)
              }
              placeholder="0"
              className="
                h-11 w-full
                rounded-xl
                border border-gray-200
                bg-gray-50
                px-3
                text-sm
                outline-none
                transition
                focus:border-yegna-500
                focus:ring-2
                focus:ring-yegna-500/10
                dark:border-white/10
                dark:bg-white/[0.04]
                dark:text-white
              "
            />
          </div>

          <div>
            <label
              htmlFor="max-price"
              className="
                mb-1.5 block
                text-[11px]
                font-medium
                text-gray-500
                dark:text-gray-400
              "
            >
              Maximum
            </label>

            <input
              id="max-price"
              type="number"
              min={0}
              value={maxPrice}
              onChange={(event) =>
                setMaxPrice(event.target.value)
              }
              placeholder="No limit"
              className="
                h-11 w-full
                rounded-xl
                border border-gray-200
                bg-gray-50
                px-3
                text-sm
                outline-none
                transition
                focus:border-yegna-500
                focus:ring-2
                focus:ring-yegna-500/10
                dark:border-white/10
                dark:bg-white/[0.04]
                dark:text-white
              "
            />
          </div>
        </div>

        {minPrice &&
          maxPrice &&
          Number(minPrice) > Number(maxPrice) && (
            <p className="mt-2 text-[11px] text-red-500">
              Minimum price cannot be greater than maximum price.
            </p>
          )}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => onApply(undefined, undefined)}
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
            disabled={
              Boolean(minPrice) &&
              Boolean(maxPrice) &&
              Number(minPrice) > Number(maxPrice)
            }
            onClick={handleApply}
            className="
              h-10 flex-[1.5]
              rounded-xl
              bg-yegna-600
              text-xs font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-yegna-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}