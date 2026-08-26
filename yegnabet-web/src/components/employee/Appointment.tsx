import { CalendarDays } from "lucide-react";

interface AppointmentProps {
  time: string;
  title: string;
  customer: string;
}

export function Appointment({
  time,
  title,
  customer,
}: AppointmentProps) {
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
          size-9
          shrink-0
          place-items-center
          rounded-xl
          bg-yegna-50
          text-yegna-700

          dark:bg-yegna-900/20
          dark:text-yegna-400
        "
      >
        <CalendarDays className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold">
          {title}
        </p>

        <p className="mt-0.5 text-[8px] text-gray-400">
          {customer}
        </p>
      </div>

      <span className="text-[8px] font-medium text-gray-400">
        {time}
      </span>
    </button>
  );
}