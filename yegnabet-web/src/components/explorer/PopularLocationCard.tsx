
import { MapPin } from "lucide-react";

import type {
  ListingLocation,
} from "../../types/customer/location";

interface PopularLocationCardProps {
  location: ListingLocation;
  selected: boolean;
  onClick: () => void;
}

export function PopularLocationCard({
  location,
  selected,
  onClick,
}: PopularLocationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`
        group relative flex mt-3 h-24 w-28
        shrink-0 flex-col items-center justify-center
        gap-2 overflow-hidden rounded-2xl border
        bg-white text-center shadow-sm
        transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-md
        dark:bg-white/4
        ${
          selected
            ? "border-yegna-600 ring-2 ring-yegna-600/20"
            : "border-gray-200/80 dark:border-white/10"
        }
      `}
    >
      <div className="
        flex size-10 items-center justify-center
        rounded-full bg-orange-50
        text-yegna-500
        transition-all duration-300
        group-hover:scale-110
        group-hover:bg-yegna-700
        group-hover:text-white
        dark:bg-orange-500/10
        dark:text-orange-400
        dark:group-hover:bg-orange-500
        dark:group-hover:text-white
      ">
        <MapPin
          size={20}
          strokeWidth={2.2}
        />
      </div>

      <div className="leading-none">
        <p className="text-xs font-semibold text-gray-900 dark:text-white">
          {location.area}, {location.city}
        </p>

        <p className="mt-1.5 text-[9px] font-medium text-gray-500 dark:text-white/50">
          {location.count} Listings
        </p>
      </div>

      {selected && (
        <span className="
          absolute right-1.5 top-1.5
          size-2 rounded-full
          bg-yegna-600
        " />
      )}
    </button>
  );
}
