import {
  Heart,
  MapPin,
  MessageCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Listing } from "../../types/customer/listings";
import {
  formatArea,
  formatPrice,
} from "../../lib/formatters";
import { cn } from "../../lib/cn";
import { updateSavedListing } from "../../lib/customer/customerApi";
import { resolveIcon } from "../../lib/IconResolver";
import type { AuthUser } from "../../types/auth/authTypes";
import ErrorBlock from "../ui/common/ErrorBlock";
import { useAuth } from "../../types/auth/authStore";
import { OkCancelDialog } from "../ui/common/OkCancelDialog";
import { removeManagedListing } from "../../lib/customer/customerApi";

interface ListingListCardProps {
  listing: Listing;
  user: AuthUser | null;
}

export function ListingListCard({
  listing,
  user,
}: ListingListCardProps) {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const canManage = user?.role === "Employee" || user?.role === "Owner";
  const isOwner = user?.role === "Owner";

  const [saved, setSaved] = useState(listing.saved ?? false);
  const [error, setError] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removed, setRemoved] = useState(false);

  const removeListing = async () => {
    if (!isOwner || !accessToken) return;
    setRemoving(true);
    try {
      await removeManagedListing(listing.id, accessToken);
      setRemoved(true);
      setConfirmRemove(false);
    } catch (removeError) {
      console.error("Failed to remove listing", removeError);
      setError("Could not remove this listing.");
    } finally {
      setRemoving(false);
    }
  };

  const saveListing = async () => {
    if (!user) {
      setSaved(!saved);
      return;
    }

    try {
      const savedListing = {
        userId: Number(user.id),
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
        user,
      },
    });
  };

  if (removed) return null;


  if (error) return <ErrorBlock message={error} />

  return (
    <>
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

            {canManage ? (
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                {listing.listingStatus && <span className="text-[9px] font-bold uppercase text-gray-400">{listing.listingStatus}</span>}
                <button
                  type="button"
                  onClick={() => navigate(`/listing/${listing.id}?edit=true`, { state: { listing, user } })}
                  className="inline-flex items-center gap-1 rounded-lg bg-yegna-50 px-2.5 py-2 text-[10px] font-semibold text-yegna-800 dark:bg-yegna-900/20 dark:text-yegna-300"
                >
                  <Pencil className="size-3" /> Edit
                </button>
                {isOwner && <button
                  type="button"
                  onClick={() => setConfirmRemove(true)}
                  className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-2 text-[10px] font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-300"
                >
                  <Trash2 className="size-3" /> Remove
                </button>}
              </div>
            ) : <button
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
            </button>}
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
    <OkCancelDialog
      open={confirmRemove}
      title="Remove this listing?"
      message={`“${listing.title}” will be removed from the marketplace.`}
      okText="Remove listing"
      variant="danger"
      busy={removing}
      onOk={() => void removeListing()}
      onCancel={() => !removing && setConfirmRemove(false)}
    />
    </>
  );
}
