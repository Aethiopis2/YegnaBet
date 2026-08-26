import {
  Activity,
  MessageCircle,
  Target,
} from "lucide-react";

interface ProviderHealthProps {
  score: number;
}

export function ProviderHealth({
  score,
}: ProviderHealthProps) {
  const radius = 43;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <section
      className="
        relative overflow-hidden
        rounded-3xl
        border border-slate-200/80
        bg-white
        p-6
        shadow-sm
        dark:border-white/10
        dark:bg-white/[0.045]
      "
    >
      <div
        className="
          pointer-events-none
          absolute -right-24 -top-24
          h-64 w-64
          rounded-full
          bg-emerald-500/5
          blur-3xl
          dark:bg-orange-400/10
        "
      />

      <div className="relative flex flex-col gap-8 md:flex-row md:items-center">
        {/* Score */}

        <div className="relative h-32 w-32 shrink-0">
          <svg
            viewBox="0 0 100 100"
            className="-rotate-90"
          >
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-100 dark:text-white/10"
            />

            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={
                circumference - progress
              }
              className="
                text-emerald-600
                transition-all duration-1000
                dark:text-orange-400
              "
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-slate-900 dark:text-white">
              {score}
            </span>

            <span className="text-[11px] text-slate-400">
              / 100
            </span>
          </div>
        </div>

        {/* Description */}

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Provider Health
            </h2>

            <span
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
              Performing well
            </span>
          </div>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Your listings are getting good engagement. Keep
            your inventory fresh and respond quickly to
            enquiries to improve your score.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <HealthItem
              icon={<Activity size={15} />}
              label="Listing quality"
              value="91"
            />

            <HealthItem
              icon={<MessageCircle size={15} />}
              label="Response"
              value="88"
            />

            <HealthItem
              icon={<Target size={15} />}
              label="Conversion"
              value="79"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HealthItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/5">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon}
        <span className="text-[10px] uppercase tracking-wide">
          {label}
        </span>
      </div>

      <div className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}