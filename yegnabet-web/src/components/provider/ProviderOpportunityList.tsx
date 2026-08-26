import {
  AlertTriangle,
  Camera,
  ChevronRight,
  Flame,
} from "lucide-react";

import type {
  ProviderOpportunity,
} from "../../pages/provider/providerData";

interface Props {
  items: ProviderOpportunity[];
  onSelect?: (item: ProviderOpportunity) => void;
}

export function ProviderOpportunityList({
  items,
  onSelect,
}: Props) {
  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border border-slate-200/80
        bg-white
        shadow-sm

        dark:border-white/10
        dark:bg-white/[0.045]
      "
    >
      <div className="border-b border-slate-100 px-6 py-5 dark:border-white/10">
        <h2 className="font-semibold text-slate-900 dark:text-white">
          Opportunities
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          A few things that could improve your performance.
        </p>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {items.map((item) => {
          const Icon =
            item.type === "match"
              ? Flame
              : item.type === "improvement"
                ? Camera
                : AlertTriangle;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect?.(item)}
              className="
                group flex w-full
                items-start gap-4
                px-6 py-5
                text-left
                transition-colors
                hover:bg-slate-50
                dark:hover:bg-white/[0.035]
              "
            >
              <div
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-emerald-50
                  text-emerald-600

                  dark:bg-orange-400/10
                  dark:text-orange-400
                "
              >
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="font-medium text-slate-900 dark:text-white">
                  {item.title}
                </div>

                <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>

                <span
                  className="
                    mt-3 inline-flex
                    text-xs font-semibold
                    text-emerald-700
                    dark:text-orange-400
                  "
                >
                  {item.action}
                </span>
              </div>

              <ChevronRight
                size={18}
                className="
                  mt-1 shrink-0
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