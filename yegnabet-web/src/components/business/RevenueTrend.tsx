import { ArrowUpRight, Wallet } from "lucide-react";

interface RevenueTrendProps {
  current: number;
  previous: number;
  growth: number;
}

export function RevenueTrend({
  current,
  previous,
  growth,
}: RevenueTrendProps) {
  const difference = current - previous;

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl
              bg-purple-50
              text-purple-600

              dark:bg-orange-400/10
              dark:text-orange-400
            "
          >
            <Wallet size={19} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Revenue momentum
            </h3>

            <p className="text-xs text-slate-500">
              This period
            </p>
          </div>
        </div>

        <span
          className="
            flex items-center gap-1
            text-xs font-semibold
            text-emerald-600

            dark:text-orange-400
          "
        >
          <ArrowUpRight size={14} />
          {growth}%
        </span>
      </div>

      <div className="mt-7">
        <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {current.toLocaleString()} ETB
        </div>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Up {difference.toLocaleString()} ETB compared with the previous
          period.
        </p>
      </div>

      <div className="mt-6 flex h-20 items-end gap-2">
        {[35, 42, 38, 51, 48, 63, 58, 72, 68, 81, 77, 92].map(
          (height, index) => (
            <div
              key={index}
              className="
                flex-1
                rounded-t-md
                bg-emerald-100

                dark:bg-orange-400/15
              "
              style={{
                height: `${height}%`,
              }}
            >
              <div
                className="
                  h-full
                  rounded-t-md
                  bg-emerald-600

                  dark:bg-orange-400
                "
                style={{
                  opacity: 0.35 + index / 20,
                }}
              />
            </div>
          )
        )}
      </div>
    </section>
  );
}