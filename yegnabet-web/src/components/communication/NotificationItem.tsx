import {
  Bell,
  CheckCircle2,
  Home,
  Search,
  ShieldCheck,
} from "lucide-react";

import type {
  Notification,
} from "../../types/communication";

interface NotificationItemProps {
  notification: Notification;

  onClick?: (
    notification: Notification
  ) => void;
}

function getIcon(type: Notification["type"]) {
  switch (type) {
    case "verification":
      return ShieldCheck;

    case "request":
      return Search;

    case "match":
      return Home;

    case "listing":
      return Home;

    default:
      return Bell;
  }
}

export function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const Icon = getIcon(
    notification.type
  );

  return (
    <button
      type="button"
      onClick={() =>
        onClick?.(notification)
      }
      className={`
        group
        flex
        w-full
        gap-3
        rounded-2xl
        p-3
        text-left
        transition-all
        duration-200
        hover:bg-gray-50
        dark:hover:bg-white/[0.035]

        ${
          notification.read
            ? ""
            : "bg-yegna-50/50 dark:bg-yegna-900/[0.08]"
        }
      `}
    >
      <div
        className="
          relative
          grid
          size-11
          shrink-0
          place-items-center
          rounded-xl
          bg-yegna-50
          text-yegna-700

          dark:bg-yegna-900/20
          dark:text-yegna-300
        "
      >
        <Icon className="size-5" />

        {!notification.read && (
          <span
            className="
              absolute
              -right-0.5
              -top-0.5
              size-2.5
              rounded-full
              border-2
              border-white
              bg-yegna-700
              dark:border-[#111]
            "
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {notification.title}
          </p>

          <time className="shrink-0 text-[9px] text-gray-400">
            {formatTime(
              notification.createdAt
            )}
          </time>
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-400">
          {notification.message}
        </p>
      </div>
    </button>
  );
}

function formatTime(
  value: string
) {
  const date = new Date(value);

  return date.toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
    }
  );
}