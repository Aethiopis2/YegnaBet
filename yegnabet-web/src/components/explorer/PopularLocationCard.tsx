import { useNavigate } from "react-router-dom";

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
          `/explore?location=${encodeURIComponent(
            location.name
          )}`
        )
      }
      className="
        group
        relative
        h-24
        w-28
        shrink-0
        overflow-hidden
        rounded-2xl
        text-left
        sm:h-28
        sm:w-32
      "
    >
      <img
        src={location.image}
        alt={location.name}
        className="
          absolute inset-0
          size-full
          object-cover
          transition-transform
          duration-500
          group-hover:scale-110
        "
        loading="lazy"
      />

      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-black/80
          via-black/15
          to-transparent
        "
      />

      <div className="absolute bottom-3 left-3 text-white">
        <p className="text-xs font-semibold">
          {location.name}
        </p>

        <p className="mt-0.5 text-[9px] text-white/70">
          {location.count} Houses
        </p>
      </div>
    </button>
  );
}