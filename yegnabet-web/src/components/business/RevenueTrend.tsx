
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Wallet,
} from "lucide-react";

interface RevenueTrendProps {
  current: number;
  previous: number;
  growth: number;
  onClick: () => void;
}

const formatETB = (value: number) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 2,
  }).format(value);

export function RevenueTrend({
  current,
  previous,
  growth,
  onClick,
}: RevenueTrendProps) {
  const difference = current - previous;

  const positive = growth > 0;
  const negative = growth < 0;
  const neutral = growth === 0;

  const trendColor = positive
    ? "text-emerald-600 dark:text-emerald-400"
    : negative
      ? "text-red-600 dark:text-red-400"
      : "text-slate-500 dark:text-slate-400";

  return (
    <button type="button" onClick={onClick} className="block w-full rounded-2xl border border-slate-200/80 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-white/10 dark:bg-white/4.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-orange-400/10 dark:text-orange-400">
            <Wallet size={19} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Commission generated
            </h3>
            <p className="text-xs text-slate-500">
              Selected period
            </p>
          </div>
        </div>

        <span className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
          {positive ? (
            <ArrowUpRight size={14} />
          ) : negative ? (
            <ArrowDownRight size={14} />
          ) : (
            <Minus size={14} />
          )}

          {previous === 0 && current > 0
            ? "New"
            : `${Math.abs(growth).toFixed(1)}%`}
        </span>
      </div>

      <div className="mt-7">
        <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {formatETB(current)}
        </div>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {neutral
            ? "No change compared with the previous period."
            : previous === 0 && current > 0
              ? "No commission was generated in the previous period."
              : `${positive ? "Up" : "Down"} ${formatETB(Math.abs(difference))} compared with the previous period.`}
        </p>
      </div>

      <p className="mt-5 border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-white/10">
        Based on successful deals. Generated commission is not necessarily collected revenue.
      </p>
    </button>
  );
}
