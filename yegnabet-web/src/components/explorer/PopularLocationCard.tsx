import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

import type { PopularLocation } from "../../data/locations";

interface PopularLocationCardProps {
  location: PopularLocation;
}

export function PopularLocationCard({
  location,
}: PopularLocationCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() =>
        navigate(
          `/explore?location=${encodeURIComponent(location.name)}`
        )
      }
      className="
        group
        relative
        flex
        h-24
        w-28
        shrink-0
        flex-col
        items-center
        justify-center
        gap-2
        overflow-hidden
        rounded-2xl
        border
        border-gray-200/80
        bg-white
        text-center
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-md
        dark:border-white/10
        dark:bg-white/[0.04]
      "
    >
      {/* Location icon */}
      <div
        className="
          flex
          size-10
          items-center
          justify-center
          rounded-full
          bg-orange-50
          text-orange-500
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:bg-orange-500
          group-hover:text-white
          dark:bg-orange-500/10
          dark:text-orange-400
          dark:group-hover:bg-orange-500
          dark:group-hover:text-white
        "
      >
        <MapPin
          size={20}
          strokeWidth={2.2}
        />
      </div>

      {/* Location information */}
      <div className="leading-none">
        <p
          className="
            text-xs
            font-semibold
            text-gray-900
            dark:text-white
          "
        >
          {location.name}
        </p>

        <p
          className="
            mt-1.5
            text-[9px]
            font-medium
            text-gray-500
            dark:text-white/50
          "
        >
          {location.count} Houses
        </p>
      </div>
    </button>
  );
}