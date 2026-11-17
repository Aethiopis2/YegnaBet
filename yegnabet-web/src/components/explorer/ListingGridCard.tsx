import { Heart, MapPin, LucideFileExclamationPoint, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Listing } from "../../types/customer/listings";
import { formatArea, formatPrice, } from "../../lib/formatters";
import { cn } from "../../lib/cn";
import { resolveIcon } from "../../lib/IconResolver";
import VerifiedTag from "../common/VerifiedTag";
import { updateSavedListing } from "../../lib/customer/customerApi";
import type { AuthUser } from "../../types/auth/authTypes";
import { useAuth } from "../../types/auth/authStore";
import { OkCancelDialog } from "../ui/common/OkCancelDialog";
import { removeManagedListing } from "../../lib/customer/customerApi";


interface ListingGridCardProps {
  listing: Listing;
  user: AuthUser | null;
}


export function ListingGridCard({
  listing,
  user,
}: ListingGridCardProps) {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const canManage = user?.role === "Employee" || user?.role === "Owner";
  const isOwner = user?.role === "Owner";

  const [saved, setSaved] = useState(listing.saved ?? false);
  const [error, setError] = useState<string>("");
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

        {canManage && listing.listingStatus && (
          <span className="absolute bottom-3 left-3 rounded-lg bg-black/65 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
            {listing.listingStatus}
          </span>
        )}

        {/* Verified */}
        {listing.verified && (
          <VerifiedTag />
        )}
        
        {/* Save */}

        {canManage ? (
          <div className="absolute right-3 top-3 flex gap-2">
            <button
              type="button"
              onClick={event => {
                event.stopPropagation();
                navigate(`/listing/${listing.id}?edit=true`, { state: { listing, user } });
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/95 px-3 text-[10px] font-semibold text-gray-700 shadow-sm backdrop-blur hover:bg-white"
            >
              <Pencil className="size-3.5" /> Edit
            </button>
            {isOwner && (
              <button
                type="button"
                onClick={event => {
                  event.stopPropagation();
                  setConfirmRemove(true);
                }}
                aria-label="Remove listing"
                className="grid size-9 place-items-center rounded-full bg-white/95 text-red-600 shadow-sm backdrop-blur hover:bg-red-50"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        ) : <button
          type="button"
          aria-label={
            saved
              ? "Remove from saved listings"
              : "Save listing"
          }
          aria-pressed={saved}
          onClick={(event) => {
            event.stopPropagation();
            saveListing();
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
          {!error && <Heart
            className={cn(
              "size-4.25 transition-all",
              saved &&
                "fill-red-500 stroke-red-500"
            )}
          />}
          {error && <LucideFileExclamationPoint className="size-4.25 text-red-500" />}
        </button>}

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

        </button>

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
