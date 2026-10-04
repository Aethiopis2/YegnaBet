import {
  Bath,
  BedDouble,
  Heart,
  MapPin,
  Maximize,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Listing } from "../../types/customer/listings";
import {
  formatArea,
  formatPrice,
} from "../../lib/formatters";
import { cn } from "../../lib/cn";
import type { UserProfile } from "../../types/customer/profile";
import { updateSavedListing } from "../../lib/customer/customerApi";
import { resolveIcon } from "../../lib/IconResolver";

interface ListingListCardProps {
  listing: Listing;
  currentUser: UserProfile | null;
}

export function ListingListCard({
  listing,
  currentUser,
}: ListingListCardProps) {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(listing.saved ?? false);
  const [error, setError] = useState("");

  const saveListing = async () => {
    if (!currentUser)
      return;

    try {
      const savedListing = {
        userId: Number(currentUser.id),
        listingId: listing.id,
        saved: !saved,
      };

      await updateSavedListing(savedListing);

      setSaved(!saved);
    } catch (err) {
      console.error(err);
      setError(String(err || "An error occurred while saving the listing."));
    }
  };

  const openListing = () => {
    navigate(`/listing/${listing.id}`, {
      state: {
        listing,
        currentUser,
      },
    });
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
        shadow-[0_3px_18px_rgba(0,0,0,0.03)]
        transition-all
        hover:shadow-[0_10px_30px_rgba(0,0,0,0.07)]
        dark:border-white/6
        dark:bg-white/[0.035]
        dark:shadow-none
      "
    >
      <div className="flex">
        <button
          type="button"
          onClick={openListing}
          className="
            relative
            w-[42%]
            shrink-0
            overflow-hidden
            text-left
            sm:w-[38%]
            lg:w-[34%]
          "
        >
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="
              absolute
              inset-0
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
                text-white
              "
            >
              Featured
            </span>
          )}
        </button>

        <div className="min-w-0 flex-1 p-3.5 sm:p-4">
          <div className="flex justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                {listing.title}
              </h3>

              <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-400 sm:text-xs">
                <MapPin className="size-3.5" />

                <span className="truncate">
                  {listing.location.area},{" "}
                  {listing.location.city}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={saveListing}
              className="
                grid size-8 shrink-0
                place-items-center
                rounded-full
                border
                border-black/5
                text-gray-500
                dark:border-white/8
                dark:text-gray-300
              "
            >
              <Heart
                className={cn(
                  "size-4",
                  saved &&
                    "fill-red-500 stroke-red-500"
                )}
              />
            </button>
          </div>

          <p className="mt-2 text-sm font-bold text-yegna-700 dark:text-yegna-300 sm:text-base">
            {formatPrice(
              listing.price,
              listing.currency
            )}
          </p>

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-500 dark:text-gray-400">
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
                        className="inline-flex items-center gap-1"> 
                        <Icon className="size-3.5" />
                        {metadata.name} :
  
                        <span>
                          {metadata.name === "Area" ? formatArea(Number(metadata.value)) : metadata.value}
                        </span>
                      </span>
                    );
                  }
                )}
  
              </div>
            )}
          </div>

          <p className="mt-3 hidden text-xs leading-5 text-gray-400 sm:line-clamp-2">
            {listing.description}
          </p>

          <button
            type="button"
            className="
              mt-3
              inline-flex
              items-center
              gap-1.5
              rounded-xl
              border
              border-yegna-100
              bg-yegna-50
              px-3
              py-2
              text-[10px]
              font-semibold
              text-yegna-800
              transition-colors
              hover:bg-yegna-100
              dark:border-yegna-900
              dark:bg-yegna-900/20
              dark:text-yegna-300
            "
          >
            <MessageCircle className="size-3.5" />
            Contact
          </button>
        </div>
      </div>
    </article>
  );
}