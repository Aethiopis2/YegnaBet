import {
  Activity,
  BriefcaseBusiness,
  Building2,
  Search,
  Users,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

import type { HealthMetric } from "../../pages/owner/businessHealth";

const icons = {
  search: Search,
  building: Building2,
  activity: Activity,
  wallet: Wallet,
  users: Users,
  briefcase: BriefcaseBusiness,
};

interface HealthMetricCardProps {
  metric: HealthMetric;
  onClick?: () => void;
}

export function HealthMetricCard({
  metric,
  onClick,
}: HealthMetricCardProps) {
  const Icon = icons[metric.icon as keyof typeof icons];

  const TrendIcon =
    metric.trendDirection === "up"
      ? ArrowUpRight
      : metric.trendDirection === "down"
        ? ArrowDownRight
        : Minus;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        w-full
        rounded-2xl
        border
        border-slate-200/80
        bg-white
        p-5
        text-left
        shadow-sm
        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:shadow-lg

        dark:border-white/10
        dark:bg-white/[0.045]
        dark:hover:border-orange-400/30
        dark:hover:bg-white/[0.065]
      "
    >
      <div className="flex items-start justify-between">
        <div
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl
            bg-emerald-50
            text-emerald-700

            dark:bg-orange-400/10
            dark:text-orange-400
          "
        >
          <Icon size={19} />
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {metric.score}
          </div>

          <div className="text-[11px] text-slate-400">
            HEALTH
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="font-semibold text-slate-900 dark:text-white">
          {metric.label}
        </div>

        <div className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {metric.description}
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {metric.value}
          </div>

          {metric.trend && (
            <div
              className={`
                mt-1 flex items-center gap-1 text-xs font-medium
                ${
                  metric.trendDirection === "down"
                    ? "text-rose-500"
                    : "text-emerald-600 dark:text-orange-400"
                }
              `}
            >
              <TrendIcon size={13} />
              {metric.trend}
            </div>
          )}
        </div>

        <span
          className="
            text-xs font-medium
            text-slate-400
            transition-transform
            group-hover:translate-x-1
          "
        >
          Details →
        </span>
      </div>
    </button>
  );
}