import { ArrowRight, Search, Store } from "lucide-react";

interface MarketBalanceProps {
  searches: number;
  relevantResults: number;
  activeListings: number;
}

export function MarketBalance({
  searches,
  relevantResults,
  activeListings,
}: MarketBalanceProps) {
  const matchRate = Math.round(
    (relevantResults / searches) * 100
  );

  return (
    <section
      className="
        rounded-2xl
        border
        border-slate-200/80
        bg-white
        p-6
        shadow-sm

        dark:border-white/10
        dark:bg-white/[0.045]
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Marketplace balance
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            How well customer demand is being matched by supply.
          </p>
        </div>

        <div
          className="
            rounded-full
            bg-emerald-50
            px-3 py-1
            text-xs font-semibold
            text-emerald-700

            dark:bg-orange-400/10
            dark:text-orange-400
          "
        >
          {matchRate}% match
        </div>
      </div>

      <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-5">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Search size={15} />
            Demand
          </div>

          <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {searches.toLocaleString()}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            active searches
          </div>
        </div>

        <div
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full
            bg-slate-100
            text-slate-500

            dark:bg-white/10
            dark:text-orange-400
          "
        >
          <ArrowRight size={18} />
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-2 text-sm text-slate-500">
            Supply
            <Store size={15} />
          </div>

          <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {activeListings.toLocaleString()}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            active listings
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-slate-500">
            Relevant results
          </span>

          <span className="font-semibold text-slate-900 dark:text-white">
            {relevantResults.toLocaleString()}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <div
            className="
              h-full
              rounded-full
              bg-emerald-600
              transition-all
              duration-1000

              dark:bg-orange-400
            "
            style={{
              width: `${matchRate}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}