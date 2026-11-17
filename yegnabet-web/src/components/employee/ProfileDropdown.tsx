import {
  LogOut,
  Moon,
  Sun,
  User,
} from "lucide-react";
import type { AuthUser } from "../../types/auth/authTypes";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../types/auth/authStore";
import { useTheme } from "../hooks/useTheme";

interface ProfileDropdownProps {
  user: AuthUser | null;
  onClose?: () => void;
}

export function ProfileDropdown({
  user,
  onClose,
}: ProfileDropdownProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";
  return (
    <div
      className="
        absolute
        right-0
        top-12
        z-50
        w-64
        overflow-hidden
        rounded-2xl
        border
        border-black/6
        bg-white
        p-2
        shadow-xl
        shadow-black/10

        dark:border-white/[0.07]
        dark:bg-[#151b17]
      "
    >
      <div className="border-b border-black/5 px-3 py-3 dark:border-white/6">
        <p className="text-xs font-bold">
          {user?.fullName || "User"}
        </p>

        <p className="mt-0.5 text-[9px] text-gray-400">
          {user?.phoneNumber}
        </p>
      </div>

      <div className="py-1">
        <ProfileMenuItem
          icon={!user ? User : user.avatar ? () => (
            <img
              src={user.avatar}
              alt={user.fullName}
              className="size-full object-cover"
            />
          ) : (
            User
          )}
          label="My Profile"
          onClick={() => {
            const isEmployee = user?.role === "Employee";
            navigate(isEmployee ? "/employee/profile" : "/profile", {
              state: {
                user,
                ...(isEmployee ? { from: `${location.pathname}${location.search}${location.hash}` } : {}),
              },
            });
            onClose?.();
          }}
        />

        <button
          type="button"
          onClick={toggleTheme}
          className="
            flex
            w-full
            items-center
            justify-between
            rounded-xl
            px-3
            py-2.5
            text-left
            text-xs
            text-gray-600
            transition
            hover:bg-gray-100

            dark:text-gray-300
            dark:hover:bg-white/4
          "
        >
          <span className="flex items-center gap-3">
            {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}

            {darkMode ? "Light theme" : "Dark theme"}
          </span>

          <span
            className={`
              relative
              h-5
              w-9
              rounded-full
              transition
              ${
                darkMode
                  ? "bg-yegna-700"
                  : "bg-gray-200"
              }
            `}
          >
            <span
              className={`
                absolute
                top-0.5
                size-4
                rounded-full
                bg-white
                shadow-sm
                transition-transform
                ${
                  darkMode
                    ? "translate-x-4"
                    : "translate-x-0.5"
                }
              `}
            />
          </span>
        </button>
      </div>

      <div className="border-t border-black/5 pt-1 dark:border-white/6">
        <ProfileMenuItem
          icon={LogOut}
          label="Sign out"
          destructive
          onClick={() => {
            void logout();
            navigate("/login", { replace: true, state: null });
          }}
        />
      </div>
    </div>
  );
}

function ProfileMenuItem({
  icon: Icon,
  label,
  destructive = false,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  destructive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-3
        py-2.5
        text-left
        text-xs
        transition

        ${
          destructive
            ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/4"
        }
      `}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}
