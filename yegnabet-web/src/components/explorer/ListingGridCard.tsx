import {
  Bath,
  BedDouble,
  Heart,
  MapPin,
  Maximize,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import type { Listing } from "../../types/listings";
import {
  formatArea,
  formatPrice,
} from "../../lib/formatters";
import { cn } from "../../lib/cn";

interface ListingGridCardProps {
  listing: Listing;
}

export function ListingGridCard({
  listing,
}: ListingGridCardProps) {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(
    listing.saved ?? false
  );

  const openListing = () => {
    navigate(`/listing/${listing.id}`);
  };

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-black/[0.05]
        bg-white
        shadow-[0_4px_20px_rgba(0,0,0,0.035)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)]
        dark:border-white/[0.06]
        dark:bg-white/[0.035]
        dark:shadow-none
      "
    >
      {/* Image */}
      <div
        role="button"
        tabIndex={0}
        onClick={openListing}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            openListing();
          }
        }}
        className="
          relative
          aspect-[1.35/1]
          cursor-pointer
          overflow-hidden
          focus:outline-none
          focus:ring-2
          focus:ring-yegna-500
          focus:ring-inset
        "
        aria-label={`View ${listing.title}`}
      >
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="
            size-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
          loading="lazy"
        />

        {listing.featured && (
          <span
            className="
              absolute
              left-3
              top-3
              rounded-lg
              bg-yegna-700
              px-2
              py-1
              text-[9px]
              font-bold
              uppercase
              tracking-wide
              text-white
            "
          >
            Featured
          </span>
        )}

        {/* Save button */}
        <button
          type="button"
          aria-label={
            saved
              ? "Remove from saved listings"
              : "Save listing"
          }
          aria-pressed={saved}
          onClick={(event) => {
            event.stopPropagation();
            setSaved((value) => !value);
          }}
          className="
            absolute
            right-3
            top-3
            grid
            size-9
            place-items-center
            rounded-full
            bg-white/90
            text-gray-600
            backdrop-blur
            transition-all
            hover:scale-110
            active:scale-95
            dark:bg-black/40
            dark:text-white
          "
        >
          <Heart
            className={cn(
              "size-[17px] transition-all",
              saved &&
                "fill-red-500 stroke-red-500"
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <button
          type="button"
          onClick={openListing}
          className="
            block
            w-full
            text-left
            focus:outline-none
          "
        >
          <h3
            className="
              truncate
              text-sm
              font-semibold
              text-gray-900
              dark:text-white
            "
          >
            {listing.title}
          </h3>

          <div
            className="
              mt-1
              flex
              items-center
              gap-1
              text-[11px]
              text-gray-400
            "
          >
            <MapPin className="size-3.5 shrink-0" />

            <span className="truncate">
              {listing.location.area},{" "}
              {listing.location.city}
            </span>
          </div>

          <p
            className="
              mt-2
              text-sm
              font-bold
              text-yegna-700
              dark:text-yegna-300
            "
          >
            {formatPrice(
              listing.price,
              listing.currency
            )}
          </p>

          <div
            className="
              mt-3
              flex
              items-center
              gap-3
              text-[10px]
              text-gray-500
              dark:text-gray-400
            "
          >
            {listing.metadata.bedrooms !==
              undefined && (
              <span className="inline-flex items-center gap-1">
                <BedDouble className="size-3.5" />
                {listing.metadata.bedrooms}
              </span>
            )}

            {listing.metadata.bathrooms !==
              undefined && (
              <span className="inline-flex items-center gap-1">
                <Bath className="size-3.5" />
                {listing.metadata.bathrooms}
              </span>
            )}

            {listing.metadata.area !==
              undefined && (
              <span className="inline-flex items-center gap-1">
                <Maximize className="size-3.5" />
                {formatArea(
                  listing.metadata.area
                )}
              </span>
            )}
          </div>
        </button>
      </div>
    </article>
  );
}