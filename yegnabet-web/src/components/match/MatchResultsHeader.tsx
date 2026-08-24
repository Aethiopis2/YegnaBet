import {
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

interface MatchResultsHeaderProps {
  count: number;
  score: number;
  onEdit: () => void;
}

export function MatchResultsHeader({
  count,
  score,
  onEdit,
}: MatchResultsHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-yegna-700 dark:text-yegna-300">
            <Sparkles className="size-4" />

            <span className="text-[10px] font-bold uppercase tracking-wider">
              Your matches
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {count} properties found
          </h1>

          <p className="mt-1 text-xs text-gray-400">
            Your best match is{" "}
            <span className="font-semibold text-yegna-700 dark:text-yegna-300">
              {score}%
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="
            inline-flex
            shrink-0
            items-center
            gap-1.5
            rounded-xl
            border
            border-black/[0.06]
            bg-white
            px-3
            py-2.5
            text-[10px]
            font-semibold
            text-gray-500
            dark:border-white/[0.07]
            dark:bg-white/[0.035]
            dark:text-gray-400
          "
        >
          <SlidersHorizontal className="size-3.5" />
          Edit
        </button>
      </div>
    </header>
  );
}