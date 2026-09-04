import type { ListingMode } from "../../types/listings";
import { cn } from "../../lib/cn";

interface ListingTabsProps {
  value: ListingMode;
  onChange: (value: ListingMode) => void;
}

const tabs: {
  value: ListingMode;
  label: string;
}[] = [
  {
    value: "Buy",
    label: "For Sale",
  },
  {
    value: "Rent",
    label: "For Rent",
  },
  {
    value: "Contract",
    label: "Contract work",
  },
  {
    value: "All",
    label: "All Listings",
  },
  {
    value: "Service",
    label: "Service Providers",
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