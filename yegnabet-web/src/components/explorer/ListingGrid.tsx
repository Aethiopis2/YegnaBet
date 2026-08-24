import type { Listing } from "../../types/listings";

import { ListingGridCard } from "./ListingGridCard";

interface ListingGridProps {
  listings: Listing[];
}

export function ListingGrid({
  listings,
}: ListingGridProps) {
  return (
    <div
      className="
        mt-4
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {listings.map((listing) => (
        <ListingGridCard
          key={listing.id}
          listing={listing}
        />
      ))}
    </div>
  );
}