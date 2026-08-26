import { Check } from "lucide-react";

interface TaskProps {
  title: string;
  subtitle: string;
  time: string;
  priority: "High" | "Medium" | "Low";
  completed?: boolean;
}

export function Task({
  title,
  subtitle,
  time,
  priority,
  completed = false,
}: TaskProps) {
  const priorityClass = {
    High: "text-red-500",
    Medium: "text-amber-500",
    Low: "text-emerald-600",
  }[priority];

  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        px-2
        py-3
        transition
        hover:bg-gray-50

        dark:hover:bg-white/[0.03]
      "
    >
      <button
        type="button"
        className={`
          grid
          size-4
          shrink-0
          place-items-center
          rounded
          border
          transition
          ${
            completed
              ? "border-yegna-600 bg-yegna-600 text-white"
              : "border-gray-300 dark:border-gray-600"
          }
        `}
      >
        {completed && (
          <Check className="size-3" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`
            text-[10px]
            font-semibold
            ${
              completed
                ? "text-gray-400 line-through"
                : ""
            }
          `}
        >
          {title}
        </p>

        <p className="mt-0.5 truncate text-[8px] text-gray-400">
          {subtitle}
        </p>
      </div>

      <span
        className={`
          hidden
          text-[8px]
          font-semibold
          sm:block
          ${priorityClass}
        `}
      >
        {priority}
      </span>

      <span className="w-14 text-right text-[8px] text-gray-400">
        {time}
      </span>
    </div>
  );
}