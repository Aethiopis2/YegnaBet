import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";

export function NotificationDropdown() {
  return (
    <div
      className="
        absolute
        right-0
        top-12
        z-50
        w-80
        overflow-hidden
        rounded-2xl
        border
        border-black/[0.06]
        bg-white
        shadow-xl
        shadow-black/10

        dark:border-white/[0.07]
        dark:bg-[#151b17]
      "
    >
      <div className="flex items-center justify-between border-b border-black/[0.05] px-4 py-3 dark:border-white/[0.06]">
        <div>
          <h3 className="text-xs font-bold">
            Notifications
          </h3>

          <p className="mt-0.5 text-[9px] text-gray-400">
            You have 3 unread notifications
          </p>
        </div>

        <button
          type="button"
          className="text-[9px] font-semibold text-yegna-700 dark:text-yegna-400"
        >
          Mark all read
        </button>
      </div>

      <div>
        <NotificationItem
          icon={CheckCircle2}
          title="Request verified"
          description="Sara Alemu's request has been verified."
          time="5 min ago"
        />

        <NotificationItem
          icon={CalendarDays}
          title="Appointment reminder"
          description="House viewing with Daniel at 9:30 AM."
          time="22 min ago"
        />

        <NotificationItem
          icon={ClipboardList}
          title="New request"
          description="A new property request was assigned to you."
          time="1 hr ago"
        />
      </div>

      <button
        type="button"
        className="
          flex
          w-full
          items-center
          justify-center
          gap-1
          border-t
          border-black/[0.05]
          py-3
          text-[10px]
          font-semibold
          text-yegna-700
          transition
          hover:bg-gray-50

          dark:border-white/[0.06]
          dark:hover:bg-white/[0.03]
        "
      >
        <Bell className="size-3" />
        View all notifications
      </button>
    </div>
  );
}

function NotificationItem({
  icon: Icon,
  title,
  description,
  time,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <button
      type="button"
      className="
        flex
        w-full
        gap-3
        px-4
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
          rounded-xl
          bg-yegna-50
          text-yegna-700

          dark:bg-yegna-900/20
          dark:text-yegna-400
        "
      >
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold">
          {title}
        </p>

        <p className="mt-0.5 text-[9px] leading-relaxed text-gray-400">
          {description}
        </p>

        <p className="mt-1 text-[8px] text-gray-400">
          {time}
        </p>
      </div>

      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-yegna-600" />
    </button>
  );
}