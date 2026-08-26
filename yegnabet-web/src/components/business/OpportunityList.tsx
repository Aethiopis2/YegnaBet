import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

import type { Opportunity } from "../../pages/owner/businessHealth";

interface OpportunityListProps {
  opportunities: Opportunity[];
  onSelect?: (opportunity: Opportunity) => void;
}

export function OpportunityList({
  opportunities,
  onSelect,
}: OpportunityListProps) {
  return (
    <section
      className="
        rounded-2xl
        border
        border-slate-200/80
        bg-white
        shadow-sm

        dark:border-white/10
        dark:bg-white/[0.045]
      "
    >
      <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-5 dark:border-white/10">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Opportunities & attention
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Things worth knowing about right now.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-white/10 dark:text-slate-400">
          {opportunities.length} insights
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {opportunities.map((item) => {
          const positive = item.severity === "positive";

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect?.(item)}
              className="
                group
                flex
                w-full
                items-start
                gap-4
                px-6
                py-5
                text-left
                transition-colors

                hover:bg-slate-50

                dark:hover:bg-white/[0.035]
              "
            >
              <div
                className={`
                  flex h-9 w-9 shrink-0 items-center justify-center
                  rounded-xl
                  ${
                    positive
                      ? "bg-emerald-50 text-emerald-600 dark:bg-orange-400/10 dark:text-orange-400"
                      : "bg-amber-50 text-amber-600 dark:bg-orange-400/10 dark:text-orange-400"
                  }
                `}
              >
                {positive ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertTriangle size={18} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {item.title}
                  </span>

                  {item.value && (
                    <span
                      className={`
                        shrink-0 text-sm font-bold
                        ${
                          positive
                            ? "text-emerald-600 dark:text-orange-400"
                            : "text-slate-900 dark:text-white"
                        }
                      `}
                    >
                      {item.value}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                )}

                {item.action && (
                  <span
                    className="
                      mt-3
                      inline-flex
                      items-center
                      gap-1
                      text-xs
                      font-semibold
                      text-emerald-700

                      dark:text-orange-400
                    "
                  >
                    {item.action}
                    <ArrowUpRight size={13} />
                  </span>
                )}
              </div>

              <ChevronRight
                size={18}
                className="
                  mt-1
                  text-slate-300
                  transition-transform
                  group-hover:translate-x-1
                  dark:text-slate-600
                "
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}