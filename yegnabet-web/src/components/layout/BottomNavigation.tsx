import {
  Compass,
  Heart,
  Home,
  UserRound,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { cn } from "../../lib/cn";
import { QuickActionSheet } from "../quick-actions/QuickActionSheet";
import type { UserProfile } from "../../types/customer/profile";
import type { ListingMode } from "../../types/customer/listings";

const navigation = [
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    label: "Explore",
    icon: Compass,
    href: "/explore",
  },
  {
    label: "Favorites",
    icon: Heart,
    href: "/explore?saved=true",
  },
  {
    label: "Profile",
    icon: UserRound,
    href: "/profile",
  },
];

interface Props {
  currentUser: UserProfile | null;
  mode?: ListingMode;
}

export function BottomNavigation({ currentUser, mode }: Props) {
  return (
    <nav
      className="
        fixed inset-x-0 bottom-0 z-40
        border-t border-black/5
        bg-white/90
        px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))]
        pt-2
        shadow-[0_-10px_40px_rgba(0,0,0,0.06)]
        backdrop-blur-xl
        dark:border-white/8
        dark:bg-[#121914]/90
      "
    >
      <div className="relative mx-auto flex h-14 max-w-xl items-center justify-between">
        {navigation.map((item) => (
          <NavigationItem
            key={item.href}
            {...item}
            currentUser={currentUser}
            mode={mode}
          />
        ))}

        <QuickActionSheet />
      </div>
    </nav>
  );
}

interface NavigationItemProps {
  label: string;
  icon: typeof Home;
  href: string;
  currentUser: UserProfile | null;
  mode?: ListingMode;
}

function NavigationItem({
  label,
  icon: Icon,
  href,
  currentUser,
  mode,
}: NavigationItemProps) {
  return (
    <NavLink
      to={href + (mode ? `?mode=${mode}` : "")}
      state={{ currentUser: currentUser }}
      className={({ isActive }) =>
        cn(
          "flex min-w-16 flex-col items-center gap-1",
          "text-[10px] font-medium",
          "transition-colors duration-200",

          isActive
            ? "text-yegna-700 dark:text-yegna-300"
            : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              "size-5.25",
              isActive && "stroke-[2.5]"
            )}
          />

          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}