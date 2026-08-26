import {
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";

interface ProfileDropdownProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ProfileDropdown({
  darkMode,
  setDarkMode,
}: ProfileDropdownProps) {
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
        border-black/[0.06]
        bg-white
        p-2
        shadow-xl
        shadow-black/10

        dark:border-white/[0.07]
        dark:bg-[#151b17]
      "
    >
      <div className="border-b border-black/[0.05] px-3 py-3 dark:border-white/[0.06]">
        <p className="text-xs font-bold">
          Hana Tesfaye
        </p>

        <p className="mt-0.5 text-[9px] text-gray-400">
          hana@yegnabet.com
        </p>
      </div>

      <div className="py-1">
        <ProfileMenuItem
          icon={User}
          label="My Profile"
        />

        <ProfileMenuItem
          icon={Settings}
          label="Settings"
        />

        <button
          type="button"
          onClick={() =>
            setDarkMode((value) => !value)
          }
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
            dark:hover:bg-white/[0.04]
          "
        >
          <span className="flex items-center gap-3">
            {darkMode ? (
              <Moon className="size-4" />
            ) : (
              <Sun className="size-4" />
            )}

            {darkMode
              ? "Dark theme"
              : "Light theme"}
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

      <div className="border-t border-black/[0.05] pt-1 dark:border-white/[0.06]">
        <ProfileMenuItem
          icon={LogOut}
          label="Sign out"
          destructive
        />
      </div>
    </div>
  );
}

function ProfileMenuItem({
  icon: Icon,
  label,
  destructive = false,
}: {
  icon: React.ElementType;
  label: string;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
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
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.04]"
        }
      `}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}