import { ArrowUpRight } from "lucide-react";

interface DashboardPanelProps {
  title: string;
  action?: string;
  children: React.ReactNode;
}

export function DashboardPanel({
  title,
  action,
  children,
}: DashboardPanelProps) {
  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-black/[0.05]
        bg-white

        dark:border-white/[0.06]
        dark:bg-white/[0.035]
      "
    >
      <header
        className="
          flex
          items-center
          justify-between
          border-b
          border-black/[0.05]
          px-4
          py-3

          dark:border-white/[0.06]
        "
      >
        <h2 className="text-xs font-bold">
          {title}
        </h2>

        {action && (
          <button
            type="button"
            className="
              flex
              items-center
              gap-1
              text-[9px]
              font-semibold
              text-yegna-700
              transition-all
              hover:gap-1.5

              dark:text-yegna-400
            "
          >
            {action}

            <ArrowUpRight className="size-3" />
          </button>
        )}
      </header>

      <div className="p-2">
        {children}
      </div>
    </section>
  );
}