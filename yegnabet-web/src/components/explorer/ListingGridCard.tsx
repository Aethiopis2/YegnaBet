import {
  Heart,
  MapPin,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import type { Listing } from "../../types/listings";

import {
  formatPrice,
} from "../../lib/formatters";

import { cn } from "../../lib/cn";

import { resolveIcon } from "../../lib/IconResolver";


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
        border-black/5
        bg-white
        shadow-[0_4px_20px_rgba(0,0,0,0.035)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)]
        dark:border-white/6
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

        {listing.images?.length > 0 && (
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
        )}


        {/* Featured */}

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


        {/* Save */}

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

            setSaved(
              (value) => !value
            );
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
              "size-4.25 transition-all",
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

          {/* Title */}

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


          {/* Location */}

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


          {/* Price */}

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


          {/* Dynamic Metadata */}

          {listing.metadata?.length > 0 && (
            <div
              className="
                mt-3
                flex
                items-center
                gap-3
                overflow-hidden
                text-[10px]
                text-gray-500
                dark:text-gray-400
              "
            >

              {listing.metadata.map(
                (metadata) => {
                  const Icon =
                    resolveIcon(
                      metadata.name
                    );

                  return (
                    <span
                      key={
                        metadata.name
                      }
                      className="
                        inline-flex
                        shrink-0
                        items-center
                        gap-1
                      "
                    >
                      <Icon className="size-3.5" />

                      <span>
                        {metadata.value}
                      </span>
                    </span>
                  );
                }
              )}

            </div>
          )}

        </button>

      </div>

    </article>
  );
}