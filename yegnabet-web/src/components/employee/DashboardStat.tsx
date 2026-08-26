import type { LucideIcon } from "lucide-react";

interface DashboardStatProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: string;
}

export function DashboardStat({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: DashboardStatProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-black/[0.05]
        bg-white
        p-4
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md

        dark:border-white/[0.06]
        dark:bg-white/[0.035]
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-medium text-gray-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight">
            {value}
          </p>

          {trend && (
            <p className="mt-1 text-[9px] font-medium text-emerald-600">
              ↑ {trend}
            </p>
          )}

          {description && (
            <p className="mt-1 text-[9px] text-gray-400">
              {description}
            </p>
          )}
        </div>

        <div
          className="
            grid
            size-10
            place-items-center
            rounded-xl
            bg-yegna-50
            text-yegna-700

            dark:bg-yegna-900/20
            dark:text-yegna-300
          "
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}