import type { Listing } from "../../types/listings";

import { ListingListCard } from "./ListingListCard";

interface ListingListProps {
  listings: Listing[];
}

export function ListingList({
  listings,
}: ListingListProps) {
  return (
    <div className="mt-4 space-y-3">
      {listings.map((listing) => (
        <ListingListCard
          key={listing.id}
          listing={listing}
        />
      ))}
    </div>
  );
}