import { ArrowUpRight } from "lucide-react";

interface RequestProps {
  name: string;
  detail: string;
  status: string;
}

export function Request({
  name,
  detail,
  status,
}: RequestProps) {
  const statusStyles: Record<string, string> = {
    New:
      "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",

    Contacted:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",

    Viewing:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",

    "In Progress":
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  };

  return (
    <button
      type="button"
      className="
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-2
        py-3
        text-left
        transition
        hover:bg-gray-50

        dark:hover:bg-white/[0.03]
      "
    >
      <div
        className="
          grid
          size-8
          shrink-0
          place-items-center
          rounded-full
          bg-gray-100
          text-[8px]
          font-bold
          text-gray-500

          dark:bg-white/[0.06]
        "
      >
        {name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-semibold">
          {name}
        </p>

        <p className="truncate text-[8px] text-gray-400">
          {detail}
        </p>
      </div>

      <span
        className={`
          rounded-full
          px-2
          py-1
          text-[7px]
          font-semibold
          ${statusStyles[status] ?? ""}
        `}
      >
        {status}
      </span>

      <ArrowUpRight className="size-3 text-gray-300" />
    </button>
  );
}