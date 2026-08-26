import type { LucideIcon } from "lucide-react";

interface InboxEmptyStateProps {
  icon: LucideIcon;

  title: string;

  description: string;
}

export function InboxEmptyState({
  icon: Icon,
  title,
  description,
}: InboxEmptyStateProps) {
  return (
    <div
      className="
        flex
        min-h-[300px]
        flex-col
        items-center
        justify-center
        rounded-3xl
        border
        border-black/[0.05]
        bg-white
        px-6
        text-center

        dark:border-white/[0.06]
        dark:bg-white/[0.035]
      "
    >
      <div
        className="
          grid
          size-14
          place-items-center
          rounded-2xl
          bg-yegna-50
          text-yegna-700

          dark:bg-yegna-900/20
          dark:text-yegna-300
        "
      >
        <Icon className="size-6" />
      </div>

      <h2 className="mt-5 text-sm font-bold text-gray-900 dark:text-white">
        {title}
      </h2>

      <p className="mt-2 max-w-sm text-xs leading-5 text-gray-400">
        {description}
      </p>
    </div>
  );
}