import type { ListingMode } from "../../components/types/explorer";
import { cn } from "../lib/cn";

interface ListingTabsProps {
  value: ListingMode;
  onChange: (value: ListingMode) => void;
}

const tabs: {
  value: ListingMode;
  label: string;
}[] = [
  {
    value: "sale",
    label: "For Sale",
  },
  {
    value: "rent",
    label: "For Rent",
  },
  {
    value: "all",
    label: "All Houses",
  },
];

export function ListingTabs({
  value,
  onChange,
}: ListingTabsProps) {
  return (
    <div className="mt-4 flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            "rounded-full px-4 py-2",
            "text-xs font-medium",
            "transition-all duration-200",
            "active:scale-95",
            value === tab.value
              ? "bg-yegna-700 text-white shadow-sm"
              : "border border-black/6 bg-white text-gray-600 hover:bg-gray-50 dark:border-white/[0.07] dark:bg-white/[0.035] dark:text-gray-300 dark:hover:bg-white/6"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}