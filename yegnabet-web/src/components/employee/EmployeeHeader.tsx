import {
  Bell,
  ChevronDown,
  Menu,
  MessageSquare,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { ProfileDropdown } from "./ProfileDropdown";
import { NotificationDropdown } from "./NotificationDropdown";

export function EmployeeHeader() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <header
      className="
        sticky top-0 z-30
        h-16
        border-b border-black/[0.05]
        bg-white/90
        backdrop-blur-xl

        dark:border-white/[0.06]
        dark:bg-[#101512]/90
      "
    >
      <div className="flex h-full items-center gap-3 px-4 sm:px-6">
        {/* MOBILE MENU */}

        <button
          type="button"
          className="
            grid size-9 place-items-center
            rounded-xl
            text-gray-500
            transition
            hover:bg-gray-100
            hover:text-gray-900
            lg:hidden

            dark:text-gray-400
            dark:hover:bg-white/[0.05]
            dark:hover:text-white
          "
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>

        {/* SEARCH */}

        <div className="relative max-w-md flex-1">
          <Search
            className="
              pointer-events-none
              absolute left-3 top-1/2
              size-4
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="search"
            placeholder="Search requests, properties, customers..."
            className="
              h-10
              w-full
              rounded-xl
              border
              border-black/[0.06]
              bg-gray-50
              pl-10
              pr-4
              text-xs
              outline-none
              transition

              placeholder:text-gray-400

              focus:border-yegna-500
              focus:bg-white
              focus:ring-2
              focus:ring-yegna-500/10

              dark:border-white/[0.06]
              dark:bg-white/[0.035]
              dark:text-white
              dark:focus:bg-white/[0.06]
            "
          />
        </div>

        <div className="ml-auto flex items-center gap-1">
          {/* NOTIFICATIONS */}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setNotificationsOpen((value) => !value)
              }
              className="
                relative
                grid size-9
                place-items-center
                rounded-xl
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-gray-900

                dark:text-gray-400
                dark:hover:bg-white/[0.05]
                dark:hover:text-white
              "
              aria-label="Notifications"
            >
              <Bell className="size-[18px]" />

              <span
                className="
                  absolute
                  right-1
                  top-1
                  grid
                  size-3.5
                  place-items-center
                  rounded-full
                  bg-red-500
                  text-[7px]
                  font-bold
                  text-white
                "
              >
                3
              </span>
            </button>

            {notificationsOpen && (
              <NotificationDropdown />
            )}
          </div>

          {/* MESSAGES */}

          <button
            type="button"
            className="
              relative
              grid size-9
              place-items-center
              rounded-xl
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-900

              dark:text-gray-400
              dark:hover:bg-white/[0.05]
              dark:hover:text-white
            "
            aria-label="Messages"
          >
            <MessageSquare className="size-[18px]" />

            <span
              className="
                absolute
                right-1
                top-1
                grid
                size-3.5
                place-items-center
                rounded-full
                bg-red-500
                text-[7px]
                font-bold
                text-white
              "
            >
              2
            </span>
          </button>

          {/* PROFILE */}

          <div className="relative ml-1">
            <button
              type="button"
              onClick={() =>
                setProfileOpen((value) => !value)
              }
              className="
                flex
                items-center
                gap-2
                rounded-xl
                p-1.5
                pr-2
                transition
                hover:bg-gray-100

                dark:hover:bg-white/[0.05]
              "
            >
              <div
                className="
                  grid
                  size-8
                  place-items-center
                  overflow-hidden
                  rounded-full
                  bg-yegna-100
                  text-[10px]
                  font-bold
                  text-yegna-700
                "
              >
                HT
              </div>

              <div className="hidden text-left xl:block">
                <p className="text-[11px] font-semibold">
                  Hana Tesfaye
                </p>

                <p className="text-[8px] text-gray-400">
                  Property Consultant
                </p>
              </div>

              <ChevronDown className="hidden size-3.5 text-gray-400 xl:block" />
            </button>

            {profileOpen && (
              <ProfileDropdown
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}