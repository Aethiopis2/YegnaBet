import { ChevronRight, Sun, Moon } from "lucide-react";

interface PreferenceRowProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action: React.ReactNode;
}

export function PreferenceRow({
  icon: Icon,
  title,
  description,
  action,
}: PreferenceRowProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="grid size-9 place-items-center rounded-xl bg-gray-100 text-gray-500 dark:bg-white/[0.05] dark:text-gray-400">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-900 dark:text-white">
          {title}
        </p>

        <p className="mt-0.5 text-[9px] text-gray-400">
          {description}
        </p>
      </div>

      {action}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`
        relative
        h-6
        w-11
        rounded-full
        transition-colors
        ${
          checked
            ? "bg-yegna-700"
            : "bg-gray-200 dark:bg-white/[0.1]"
        }
      `}
    >
      <span
        className={`
          absolute
          top-1
          size-4
          rounded-full
          bg-white
          shadow-sm
          transition-transform
          ${
            checked
              ? "left-6"
              : "left-1"
          }
        `}
      />
    </button>
  );
}

export function ThemeToggle() {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-white/[0.05]">
      <button
        type="button"
        className="grid size-7 place-items-center rounded-md bg-white text-gray-700 shadow-sm dark:bg-transparent dark:text-gray-500"
      >
        <Sun className="size-3.5" />
      </button>

      <button
        type="button"
        className="grid size-7 place-items-center rounded-md text-gray-400 dark:bg-white/[0.08] dark:text-white"
      >
        <Moon className="size-3.5" />
      </button>
    </div>
  );
}

export function AccountAction({
  icon: Icon,
  title,
  danger = false,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  danger?: boolean;
  onClick: () => void;
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
        p-3
        text-left
        transition
        hover:bg-gray-50
        dark:hover:bg-white/[0.035]

        ${
          danger
            ? "text-red-500"
            : "text-gray-600 dark:text-gray-300"
        }
      `}
    >
      <Icon className="size-4" />

      <span className="flex-1 text-xs font-semibold">
        {title}
      </span>

      <ChevronRight className="size-4 text-gray-300" />
    </button>
  );
}