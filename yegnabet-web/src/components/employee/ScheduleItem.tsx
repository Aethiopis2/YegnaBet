import { Clock } from "lucide-react";

interface ScheduleItemProps {
  time: string;
  title: string;
  description: string;
}

export function ScheduleItem({
  time,
  title,
  description,
}: ScheduleItemProps) {
  return (
    <div className="flex gap-3 px-2 py-2.5">
      <div className="flex w-14 shrink-0 items-start gap-1 pt-1 text-[8px] text-gray-400">
        <Clock className="size-3" />
        {time}
      </div>

      <div
        className="
          min-w-0
          flex-1
          rounded-xl
          bg-gray-50
          px-3
          py-2.5

          dark:bg-white/[0.035]
        "
      >
        <p className="text-[10px] font-semibold">
          {title}
        </p>

        {description && (
          <p className="mt-0.5 truncate text-[8px] text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}