import {
  ChevronDown,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FilterChipProps {
  label: string;
  icon?: LucideIcon;
  value?: string;
  removable?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}

export function FilterChip({
  label,
  icon: Icon,
  value,
  removable = false,
  onClick,
  onRemove,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        inline-flex
        h-10
        shrink-0
        items-center
        gap-2
        rounded-xl
        border
        border-black/[0.06]
        bg-white
        px-3
        text-xs
        text-gray-700
        shadow-[0_2px_10px_rgba(0,0,0,0.025)]
        transition-all
        hover:border-yegna-200
        hover:bg-yegna-50/40
        dark:border-white/[0.07]
        dark:bg-white/[0.035]
        dark:text-gray-300
        dark:shadow-none
        dark:hover:border-yegna-800
        dark:hover:bg-yegna-900/20
      "
    >
      {Icon && (
        <Icon className="size-4 text-yegna-700 dark:text-yegna-400" />
      )}

      <span>{value ?? label}</span>

      {removable ? (
        <span
          onClick={(event) => {
            event.stopPropagation();
            onRemove?.();
          }}
          className="
            grid size-4 place-items-center
            rounded-full
            text-gray-400
            hover:bg-gray-200
            hover:text-gray-700
            dark:hover:bg-white/10
          "
        >
          <X className="size-3" />
        </span>
      ) : (
        <ChevronDown className="size-3.5 text-gray-400" />
      )}
    </button>
  );
}