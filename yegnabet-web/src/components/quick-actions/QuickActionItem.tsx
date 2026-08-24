import type { LucideIcon } from "lucide-react";

interface QuickActionItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

export function QuickActionItem({
  icon: Icon,
  title,
  description,
  onClick,
}: QuickActionItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        w-full
        items-center
        gap-3
        rounded-2xl
        border
        border-black/[0.05]
        bg-white
        p-3
        text-left
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-yegna-200
        hover:shadow-md
        active:scale-[0.98]

        dark:border-white/[0.06]
        dark:bg-[#151515]
        dark:hover:border-yegna-700/50
      "
    >
      <div
        className="
          grid
          size-11
          shrink-0
          place-items-center
          rounded-xl
          bg-yegna-50
          text-yegna-700
          transition-colors

          group-hover:bg-yegna-700
          group-hover:text-white

          dark:bg-yegna-900/20
          dark:text-yegna-300
        "
      >
        <Icon className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="
            text-sm
            font-semibold
            text-gray-900
            dark:text-white
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            text-[10px]
            leading-4
            text-gray-400
          "
        >
          {description}
        </p>
      </div>
    </button>
  );
}