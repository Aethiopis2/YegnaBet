import {
  ChevronRight,
  Heart,
  LogOut,
  Moon,
  Sun,
  User,
  UserRound,
} from "lucide-react";

import { useTheme } from "../hooks/useTheme";

import { Avatar } from "../ui/Avatar";
import { Dropdown } from "../ui/Dropdown";
import IconButton  from "../ui/IconButton";
import { useNavigate } from "react-router-dom";
import type { ListingMode } from "../../types/customer/listings";
import type { AuthUser } from "../../types/auth/authTypes";

interface ProfileMenuProps {
  open: boolean;
  onToggle: () => void;
  user: AuthUser | null;
  openSignin: boolean;
  setOpenSignin: any;
  mode?: ListingMode;
}

export function ProfileMenu({ open, onToggle, user,
  openSignin, setOpenSignin, mode }: ProfileMenuProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative">
      <IconButton
        label="Profile"
        active={open}
        onClick={onToggle}
        className="p-0.5"
      >
        {user ?
          <Avatar
            name={user.fullName}
            size="md"
            src="/images/avatars/user.jpg"
          />
          :
          <Avatar size="md" />}
      </IconButton>

      <Dropdown open={open} className="w-64">
        <div className="p-2">

          {user &&
            <div className="flex items-center gap-3 rounded-xl px-2 py-2.5">
              <Avatar
                name={user.fullName}
                size="lg"
                src="/images/avatars/user.jpg"
              />

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {user.fullName}
                </p>

                <p className="truncate text-xs text-gray-400">
                  Customer account
                </p>
              </div>
            </div>
          }
          <div className="my-2 h-px bg-black/5 dark:bg-white/8" />

          {user ? 
            <>
              <ProfileItem
                icon={UserRound}
                label={"My profile"}
                onclick={() => navigate('/profile', {
                  state: { 
                    user
                  }
                })}
              />

              <ProfileItem
                icon={Heart}
                label="Saved listings"
                onclick={() => user && navigate(`/explore?saved=true` + (mode && `&mode=${mode}`), {
                  state: { 
                    user 
                  }
                })}
              />

              {/* <ProfileItem
                icon={Settings}
                label="Settings"
              /> */}
            </>
            :
            <ProfileItem
              icon={User}
              label="Sign In | Create New" 
              chevronOff={true}
              onclick={() => setOpenSignin(!openSignin)}
              />
          }
          <div className="my-2 h-px bg-black/5 dark:bg-white/8" />

          <button
            type="button"
            onClick={toggleTheme}
            className="
              flex w-full items-center gap-3
              rounded-xl px-3 py-2.5
              text-sm
              text-gray-600
              transition-colors
              hover:bg-black/5
              dark:text-gray-300
              dark:hover:bg-white/8
            "
          >
            {theme === "light" ? (
              <Moon className="size-4.5" />
            ) : (
              <Sun className="size-4.5" />
            )}

            <span className="flex-1 text-left">
              {theme === "light"
                ? "Dark theme"
                : "Light theme"}
            </span>

            <span className="text-xs text-gray-400">
              {theme === "light" ? "Off" : "On"}
            </span>
          </button>

          <div className="my-2 h-px bg-black/5 dark:bg-white/8" />

          {user &&
            <button type="button"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm 
                text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/15">
              <LogOut className="size-4.5" />
              <span className="flex-1 text-left">
                Log out
              </span>
              <ChevronRight className="size-4 opacity-40" />
            </button>
          }
        </div>
      </Dropdown>
    </div>
  );
}


function ProfileItem({ icon: Icon, label, chevronOff, onclick }: {
  icon: typeof UserRound;
  label: string;
  chevronOff?: boolean;
  onclick?: any;
}) {
  return (
    <button type="button" onClick={onclick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm 
        text-gray-600 transition-colors hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/8">
      <Icon className="size-4.5" />

      <span className="flex-1 text-left">
        {label}
      </span>

      {!chevronOff && <ChevronRight className="size-4 opacity-30" />}
    </button>
  );
}