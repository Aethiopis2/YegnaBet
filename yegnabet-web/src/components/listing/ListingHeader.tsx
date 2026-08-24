import {
  BadgeCheck,
  MapPin,
  TrendingUp,
} from "lucide-react";

import type { Listing } from "../../types/listings";

import {
  formatPrice,
} from "../../lib/formatters";

interface ListingHeaderProps {
  listing: Listing;
}

export function ListingHeader({
  listing,
}: ListingHeaderProps) {
  return (
    <section className="px-4 pt-5 sm:px-0">
      <div className="flex flex-wrap items-center gap-2">
        {listing.verified && (
          <span
            className="
              inline-flex
              items-center
              gap-1
              rounded-full
              bg-yegna-50
              px-2.5
              py-1
              text-[10px]
              font-semibold
              text-yegna-800
              dark:bg-yegna-900/25
              dark:text-yegna-300
            "
          >
            <BadgeCheck className="size-3.5" />
            Verified
          </span>
        )}

        {listing.trending && (
          <span
            className="
              inline-flex
              items-center
              gap-1
              rounded-full
              bg-orange-50
              px-2.5
              py-1
              text-[10px]
              font-semibold
              text-orange-700
              dark:bg-orange-900/20
              dark:text-orange-300
            "
          >
            <TrendingUp className="size-3.5" />
            Trending
          </span>
        )}

        <span
          className="
            rounded-full
            bg-gray-100
            px-2.5
            py-1
            text-[10px]
            font-medium
            capitalize
            text-gray-500
            dark:bg-white/[0.06]
            dark:text-gray-400
          "
        >
          {listing.status === "sale"
            ? "For Sale"
            : "For Rent"}
        </span>
      </div>

      <h1
        className="
          mt-3
          text-2xl
          font-bold
          tracking-[-0.035em]
          text-gray-900
          dark:text-white
          sm:text-3xl
        "
      >
        {listing.title}
      </h1>

      <div
        className="
          mt-2
          flex
          items-center
          gap-1.5
          text-sm
          text-gray-400
        "
      >
        <MapPin className="size-4" />

        <span>
          {listing.location.area},{" "}
          {listing.location.city}
        </span>
      </div>

      <div
        className="
          mt-4
          text-2xl
          font-bold
          tracking-[-0.025em]
          text-yegna-700
          dark:text-yegna-300
        "
      >
        {formatPrice(
          listing.price,
          listing.currency
        )}

        {listing.status === "rent" && (
          <span className="ml-1 text-xs font-medium text-gray-400">
            / month
          </span>
        )}
      </div>
    </section>
  );
}