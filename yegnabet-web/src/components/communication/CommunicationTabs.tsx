import {
  Bell,
  Inbox,
  MessageCircle,
} from "lucide-react";

import type {
  CommunicationTab,
} from "../../types/communication";

interface CommunicationTabsProps {
  active: CommunicationTab;

  onChange: (
    tab: CommunicationTab
  ) => void;

  unreadMessages?: number;

  unreadNotifications?: number;
}

export function CommunicationTabs({
  active,
  onChange,
  unreadMessages = 0,
  unreadNotifications = 0,
}: CommunicationTabsProps) {
  const tabs = [
    {
      id: "all" as const,
      label: "All",
      icon: Inbox,
      count:
        unreadMessages +
        unreadNotifications,
    },
    {
      id: "messages" as const,
      label: "Messages",
      icon: MessageCircle,
      count: unreadMessages,
    },
    {
      id: "notifications" as const,
      label: "Notifications",
      icon: Bell,
      count: unreadNotifications,
    },
  ];

  return (
    <div
      className="
        flex
        gap-1
        rounded-2xl
        border
        border-black/[0.05]
        bg-gray-100/70
        p-1

        dark:border-white/[0.06]
        dark:bg-white/[0.035]
      "
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;

        const selected =
          active === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() =>
              onChange(tab.id)
            }
            className={`
              relative
              flex
              flex-1
              items-center
              justify-center
              gap-1.5
              rounded-xl
              px-3
              py-2.5
              text-xs
              font-semibold
              transition-all
              duration-200

              ${
                selected
                  ? "bg-white text-gray-900 shadow-sm dark:bg-white/[0.09] dark:text-white"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              }
            `}
          >
            <Icon className="size-4" />

            {tab.label}

            {tab.count > 0 && (
              <span
                className={`
                  rounded-full
                  px-1.5
                  py-0.5
                  text-[8px]
                  font-bold

                  ${
                    selected
                      ? "bg-yegna-700 text-white"
                      : "bg-gray-200 text-gray-500 dark:bg-white/[0.08] dark:text-gray-400"
                  }
                `}
              >
                {tab.count > 99
                  ? "99+"
                  : tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}