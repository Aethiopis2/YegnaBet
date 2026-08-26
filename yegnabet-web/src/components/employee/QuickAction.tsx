import {
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
}

export function QuickAction({
  icon: Icon,
  label,
}: QuickActionProps) {
  return (
    <button
      type="button"
      className="
        group
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-2
        py-2.5
        text-left
        transition

        hover:bg-gray-50

        dark:hover:bg-white/[0.03]
      "
    >
      <span
        className="
          grid
          size-8
          place-items-center
          rounded-lg
          bg-yegna-50
          text-yegna-700
          transition

          group-hover:scale-105

          dark:bg-yegna-900/20
          dark:text-yegna-400
        "
      >
        <Icon className="size-4" />
      </span>

      <span className="flex-1 text-[10px] font-medium">
        {label}
      </span>

      <ArrowRight
        className="
          size-3
          text-gray-300
          transition-transform
          group-hover:translate-x-0.5
        "
      />
    </button>
  );
}