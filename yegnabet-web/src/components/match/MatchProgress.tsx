interface MatchProgressProps {
  current: number;
  total: number;
}

export function MatchProgress({
  current,
  total,
}: MatchProgressProps) {
  const percentage =
    (current / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-gray-400">
          Your preferences
        </span>

        <span className="text-[10px] font-semibold text-yegna-700 dark:text-yegna-300">
          {current} of {total}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.06]">
        <div
          className="
            h-full
            rounded-full
            bg-yegna-700
            transition-all
            duration-500
          "
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}