import {
  BedDouble,
  Heart,
  MapPin,
} from "lucide-react";
import { useState } from "react";

import type { Listing } from "../../types/customer/listings";
import { formatArea, formatPrice } from "../../lib/formatters";
import { cn } from "../../lib/cn";
import { resolveIcon } from "../../lib/IconResolver";
import { useNavigate } from "react-router-dom";
import type { AuthUser } from "../../types/auth/authTypes";
import { updateSavedListing } from "../../lib/customer/customerApi";

interface FeaturedCardProps {
  listing: Listing;
  user: AuthUser | null;
  className?: string;
}

export function FeaturedCard({
  listing,
  user,
  className,
}: FeaturedCardProps) {
  const navigate = useNavigate();
  const [savedState, setSavedState] = useState({
    listingId: listing.id,
    userId: user?.id,
    value: Boolean(listing.saved),
  });
  const saved = savedState.listingId === listing.id && savedState.userId === user?.id
    ? savedState.value
    : Boolean(listing.saved);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const toggleSaved = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!user || saving) return;
    const nextSaved = !saved;
    setSaving(true);
    setSaveError("");
    try {
      await updateSavedListing({
        userId: Number(user.id),
        listingId: listing.id,
        saved: nextSaved,
      });
      setSavedState({ listingId: listing.id, userId: user.id, value: nextSaved });
    } catch (error) {
      console.error("Failed to save featured listing", error);
      setSaveError("Could not update saved listing.");
    } finally {
      setSaving(false);
    }
  };
  const image = listing.images?.find((url) => typeof url === "string" && url.trim().length > 0);

  return (
    <article
      onClick={() => navigate(`/listing/${listing.id}`)}
      className={cn(
        "group overflow-hidden",
        "rounded-2xl",
        "border border-black/[0.05]",
        "bg-white",
        "shadow-[0_5px_25px_rgba(0,0,0,0.045)]",
        "dark:border-white/[0.06]",
        "dark:bg-white/[0.035]",
        "dark:shadow-none",
        className
      )}
    >
      <div className="relative aspect-[1.35/1] overflow-hidden">
        {image && (
          <img
            src={image}
            alt={listing.title}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
        )}

        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-black/35
            via-transparent
            to-transparent
          "
        />

        {listing.featured && (
          <span
            className="
              absolute left-3 top-3
              rounded-lg
              bg-yegna-700
              px-2.5 py-1
              text-[10px] font-bold
              uppercase tracking-wide
              text-white
            "
          >
            Featured
          </span>
        )}

        <button
          type="button"
          aria-label={
            saved
              ? "Remove from saved"
              : "Save listing"
          }
          onClick={toggleSaved}
          disabled={!user || saving}
          aria-pressed={saved}
          className="
            absolute right-3 top-3
            grid size-9 place-items-center
            rounded-full
            border border-white/60
            bg-white/85
            text-gray-700
            backdrop-blur-md
            transition-all duration-200
            hover:scale-110
            active:scale-90
            dark:bg-black/30
            dark:text-white
          "
        >
          <Heart
            className={cn(
              "size-[18px] transition-all",
              saved &&
                "fill-red-500 stroke-red-500"
            )}
          />
        </button>
        {saveError && <span role="status" className="absolute right-3 top-14 rounded-md bg-white px-2 py-1 text-xs text-red-600">{saveError}</span>}
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {listing.title}
            </h3>

            <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
              <MapPin className="size-3.5" />

              <span className="truncate">
                {formatArea(Number(listing.location.area) || 0)},{" "}
                {listing.location.city}
              </span>
            </div>
          </div>

          <span className="shrink-0 text-sm font-bold text-yegna-700 dark:text-yegna-300">
            {formatPrice(
              listing.price,
              listing.currency
            )}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-500 dark:text-gray-400">
          {listing.metadata.map(v => (
            <Feature key={v.name}
              icon={resolveIcon(v.name)}
              value={v.value}
            />
          ))
          }
        </div>
      </div>
    </article>
  );
}

function Feature({
  icon: Icon,
  value,
}: {
  icon: typeof BedDouble;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <Icon className="size-3.5" />
      {value}
    </span>
  );
}
