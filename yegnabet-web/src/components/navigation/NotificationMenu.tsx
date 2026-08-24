import {
  Bell,
  CheckCircle2,
  Heart,
  MessageCircle,
  Plus,
  Tag,
} from "lucide-react";

import { notifications } from "../../data/Notifications";
import type { Notification } from "../types/notification";

import { Avatar } from "../ui/Avatar";
import { Dropdown } from "../ui/Dropdown";
import  IconButton  from "../ui/IconButton";

interface NotificationMenuProps {
  open: boolean;
  onToggle: () => void;
}

export function NotificationMenu({
  open,
  onToggle,
}: NotificationMenuProps) {
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="relative">
      <IconButton
        label="Notifications"
        active={open}
        onClick={onToggle}
      >
        <Bell className="size-[21px]" />

        {unreadCount > 0 && (
          <span
            className="
              absolute right-1.5 top-1
              grid min-w-4.5 h-4.5
              place-items-center
              rounded-full
              border-2 border-white
              bg-red-500
              px-1
              text-[9px]
              font-bold
              leading-none
              text-white
              dark:border-[#121914]
            "
          >
            {unreadCount}
          </span>
        )}
      </IconButton>

      <Dropdown open={open}>
        <div className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-black/5 px-4 py-3.5 dark:border-white/8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>

              <p className="mt-0.5 text-xs text-gray-400">
                {unreadCount} unread
              </p>
            </div>

            <button
              type="button"
              className="text-xs font-medium text-yegna-700 dark:text-yegna-300"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>

          <div className="border-t border-black/5 p-3 dark:border-white/8">
            <button
              type="button"
              className="
                w-full rounded-xl
                py-2.5
                text-sm font-medium
                text-yegna-700
                transition-colors
                hover:bg-yegna-50
                dark:text-yegna-300
                dark:hover:bg-yegna-900/20
              "
            >
              View all notifications
            </button>
          </div>
        </div>
      </Dropdown>
    </div>
  );
}

function NotificationItem({
  notification,
}: {
  notification: Notification;
}) {
  return (
    <button
      type="button"
      className="
        flex w-full gap-3
        px-4 py-3.5
        text-left
        transition-colors
        hover:bg-black/[0.025]
        dark:hover:bg-white/[0.025]
      "
    >
      <NotificationIcon type={notification.type} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
            {notification.title}
          </p>

          {!notification.read && (
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-yegna-600" />
          )}
        </div>

        <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
          {notification.message}
        </p>

        <p className="mt-1.5 text-[10px] text-gray-400">
          {notification.createdAt}
        </p>
      </div>
    </button>
  );
}

function NotificationIcon({
  type,
}: {
  type: Notification["type"];
}) {
  const common =
    "grid size-9 shrink-0 place-items-center rounded-full";

  switch (type) {
    case "verified":
      return (
        <div className={`${common} bg-yegna-50 text-yegna-700 dark:bg-yegna-900/30 dark:text-yegna-300`}>
          <CheckCircle2 className="size-4.5" />
        </div>
      );

    case "saved":
      return (
        <div className={`${common} bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-300`}>
          <Heart className="size-4.5" />
        </div>
      );

    case "message":
      return (
        <div className={`${common} bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300`}>
          <MessageCircle className="size-4.5" />
        </div>
      );

    case "request":
      return (
        <div className={`${common} bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300`}>
          <Plus className="size-4.5" />
        </div>
      );

    case "listing":
    default:
      return (
        <div className={`${common} bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300`}>
          <Tag className="size-4.5" />
        </div>
      );
  }
}