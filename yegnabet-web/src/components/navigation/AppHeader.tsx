import { useEffect, useRef, useState } from "react";

import { NotificationMenu } from "./NotificationMenu";
import { ProfileMenu } from "./ProfileMenu";

export function AppHeader() {
  const [openMenu, setOpenMenu] = useState<
    "notifications" | "profile" | null
  >(null);

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenMenu(null);
      }
    }

    document.addEventListener(
      "mousedown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown
      );
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="
        sticky top-0 z-30
        border-b border-black/[0.04]
        bg-[#f7f8f6]/90
        backdrop-blur-xl
        dark:border-white/[0.04]
        dark:bg-[#101512]/90
      "
    >
      <div
        className="
          mx-auto flex h-[76px]
          max-w-7xl items-center
          justify-between
          px-5 sm:px-6 lg:px-8
        "
      >
        <div className="flex items-center gap-3">
          <YegnaLogo />

          <div className="hidden sm:block">
            <div className="text-[17px] font-bold tracking-[-0.03em] text-gray-900 dark:text-white">
              Yegna Bet
            </div>

            <div className="text-[9px] font-medium tracking-wide text-gray-400">
              Find it. Trust it. Own it.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <NotificationMenu
            open={openMenu === "notifications"}
            onToggle={() =>
              setOpenMenu((current) =>
                current === "notifications"
                  ? null
                  : "notifications"
              )
            }
          />

          <ProfileMenu
            open={openMenu === "profile"}
            onToggle={() =>
              setOpenMenu((current) =>
                current === "profile"
                  ? null
                  : "profile"
              )
            }
          />
        </div>
      </div>
    </header>
  );
}

function YegnaLogo() {
  return (
    <div className="grid size-11 place-items-center">
      <svg
        viewBox="0 0 48 48"
        className="size-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Yegna Bet"
      >
        <path
          d="M24 38V18"
          stroke="currentColor"
          className="text-yegna-700 dark:text-yegna-400"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          d="M24 21C18 16 11 18 9 24C15 25 20 25 24 21Z"
          fill="currentColor"
          className="text-yegna-600 dark:text-yegna-400"
        />

        <path
          d="M24 17C29 11 36 12 39 18C33 20 28 20 24 17Z"
          fill="currentColor"
          className="text-yegna-700 dark:text-yegna-300"
        />

        <path
          d="M24 29C29 24 35 26 37 31C32 33 28 33 24 29Z"
          fill="currentColor"
          className="text-yegna-500 dark:text-yegna-400"
        />

        <path
          d="M24 27C19 23 14 24 12 29C17 31 21 31 24 27Z"
          fill="currentColor"
          className="text-yegna-600 dark:text-yegna-300"
        />
      </svg>
    </div>
  );
}