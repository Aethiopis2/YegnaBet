import type { LucideIcon } from "lucide-react";

import { Check } from "lucide-react";

interface MatchOptionCardProps {
  label: string;
  description?: string;
  icon?: LucideIcon;
  selected: boolean;
  onClick: () => void;
}

export function MatchOptionCard({
  label,
  description,
  icon: Icon,
  selected,
  onClick,
}: MatchOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`
        group
        relative
        flex
        w-full
        items-center
        gap-3
        rounded-2xl
        border
        p-4
        text-left
        transition-all
        duration-200

        ${
          selected
            ? `
              border-yegna-600
              bg-yegna-50
              shadow-sm
              dark:border-yegna-500
              dark:bg-yegna-900/20
            `
            : `
              border-black/[0.05]
              bg-white
              hover:border-yegna-200
              hover:-translate-y-0.5
              dark:border-white/[0.06]
              dark:bg-white/[0.035]
            `
        }
      `}
    >
      {Icon && (
        <div
          className={`
            grid
            size-10
            shrink-0
            place-items-center
            rounded-xl
            transition-colors

            ${
              selected
                ? "bg-yegna-700 text-white"
                : "bg-gray-100 text-gray-500 dark:bg-white/[0.06]"
            }
          `}
        >
          <Icon className="size-5" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p
          className={`
            text-sm
            font-semibold
            ${
              selected
                ? "text-yegna-900 dark:text-yegna-200"
                : "text-gray-900 dark:text-white"
            }
          `}
        >
          {label}
        </p>

        {description && (
          <p className="mt-0.5 text-[10px] text-gray-400">
            {description}
          </p>
        )}
      </div>

      {selected && (
        <div className="grid size-6 place-items-center rounded-full bg-yegna-700 text-white">
          <Check className="size-3.5" />
        </div>
      )}
    </button>
  );
}