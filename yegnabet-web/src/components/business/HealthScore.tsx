interface HealthScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function HealthScore({
  score,
  size = "lg",
}: HealthScoreProps) {
  const dimensions = {
    sm: {
      outer: "h-20 w-20",
      text: "text-xl",
      stroke: 6,
    },
    md: {
      outer: "h-28 w-28",
      text: "text-3xl",
      stroke: 7,
    },
    lg: {
      outer: "h-40 w-40",
      text: "text-5xl",
      stroke: 8,
    },
  }[size];

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div
      className={`relative ${dimensions.outer} shrink-0`}
    >
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full -rotate-90"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={dimensions.stroke}
          className="text-black/5 dark:text-white/10"
        />

        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={dimensions.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="
            text-emerald-600
            transition-all
            duration-1000
            ease-out
            dark:text-orange-400
          "
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`${dimensions.text} font-bold tracking-tight text-slate-900 dark:text-white`}
        >
          {score}
        </span>

        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          / 100
        </span>
      </div>
    </div>
  );
}