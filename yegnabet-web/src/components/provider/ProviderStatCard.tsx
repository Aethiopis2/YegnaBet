import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

interface ProviderStatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
}

export function ProviderStatCard({
  label,
  value,
  change,
  icon: Icon,
}: ProviderStatCardProps) {
  return (
    <div
      className="
        group
        rounded-2xl
        border border-slate-200/80
        bg-white
        p-5
        shadow-sm
        transition-all duration-300
        hover:-translate-y-0.5
        hover:shadow-lg

        dark:border-white/10
        dark:bg-white/[0.045]
        dark:hover:border-orange-400/20
      "
    >
      <div className="flex items-start justify-between">
        <div
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            bg-emerald-50
            text-emerald-700
            dark:bg-orange-400/10
            dark:text-orange-400
          "
        >
          <Icon size={19} />
        </div>

        {change && (
          <span
            className="
              flex items-center gap-1
              text-xs font-semibold
              text-emerald-600
              dark:text-orange-400
            "
          >
            <ArrowUpRight size={13} />
            {change}
          </span>
        )}
      </div>

      <div className="mt-5">
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </div>

        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {label}
        </div>
      </div>
    </div>
  );
}