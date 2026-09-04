import { cn } from "../../lib/cn";
import type { ListingMode } from "../../types/listings";


interface TransactionModeProps {
  value: ListingMode;
  onChange: (value: ListingMode) => void;
}

export function TransactionMode({
  value,
  onChange,
}: TransactionModeProps) {
  return (
    <section className="mt-6">
      <div
        className="
          mx-auto
          w-full
          max-w-md
          overflow-hidden
          rounded-xl
          border border-black/8
          bg-white
          shadow-[0_4px_20px_rgba(0,0,0,0.06)]
          dark:border-white/8
          dark:bg-white/[0.035]
          dark:shadow-none
        "
      >
        <div className="grid grid-cols-2 p-1.5">
          <button
            type="button"
            onClick={() => onChange("Buy")}
            className={cn(
              "rounded-lg px-4 py-2.5",
              "text-sm font-semibold",
              "transition-all duration-200",
              value === "Buy"
                ? `
                  bg-yegna-50
                  text-yegna-700
                  shadow-sm
                  dark:bg-yegna-900/30
                  dark:text-yegna-300
                `
                : `
                  text-gray-500
                  hover:bg-gray-50
                  hover:text-gray-700
                  dark:text-gray-400
                  dark:hover:bg-white/5
                  dark:hover:text-gray-200
                `
            )}
          >
            Buy
          </button>

          <button
            type="button"
            onClick={() => onChange("Rent")}
            className={cn(
              "rounded-lg px-4 py-2.5",
              "text-sm font-semibold",
              "transition-all duration-200",
              value === "Rent"
                ? `
                  bg-yegna-50
                  text-yegna-700
                  shadow-sm
                  dark:bg-yegna-900/30
                  dark:text-yegna-300
                `
                : `
                  text-gray-500
                  hover:bg-gray-50
                  hover:text-gray-700
                  dark:text-gray-400
                  dark:hover:bg-white/5
                  dark:hover:text-gray-200
                `
            )}
          >
            Rent
          </button>
        </div>
      </div>
    </section>
  );
}