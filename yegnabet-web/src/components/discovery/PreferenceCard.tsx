import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { cn } from "../../lib/cn";

interface PreferenceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
  className?: string;
}

export function PreferenceCard({
  title,
  description,
  icon: Icon,
  route,
  className,
}: PreferenceCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(route)}
      className={cn(
        "group flex min-w-0 flex-1 flex-col items-center",
        "rounded-2xl border border-black/5",
        "bg-white px-3 py-4",
        "text-center",
        "shadow-[0_4px_20px_rgba(0,0,0,0.035)]",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.07)]",
        "active:scale-[0.97]",
        "dark:border-white/6",
        "dark:bg-white/[0.035]",
        "dark:shadow-none",
        "dark:hover:bg-white/5.5",
        className
      )}
    >
      <span
        className="
          grid size-11 place-items-center
          rounded-full
          bg-yegna-50
          text-yegna-700
          transition-all duration-300
          group-hover:scale-110
          group-hover:bg-yegna-100
          dark:bg-yegna-900/30
          dark:text-yegna-300
          dark:group-hover:bg-yegna-900/50
        "
      >
        <Icon className="size-5" />
      </span>

      <span className="mt-3 text-xs font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </span>

      <span className="mt-1 line-clamp-2 text-[10px] leading-4 text-gray-400 dark:text-gray-500">
        {description}
      </span>
    </button>
  );
}