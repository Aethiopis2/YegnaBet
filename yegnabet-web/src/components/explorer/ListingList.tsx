import type { Listing } from "../../types/customer/listings";
import type { UserProfile } from "../../types/customer/profile";

import { ListingListCard } from "./ListingListCard";

interface ListingListProps {
  listings: Listing[];
  currentUser: UserProfile | null;
}

export function ListingList({
  listings,
  currentUser,
}: ListingListProps) {
  return (
    <div className="mt-4 space-y-3">
      {listings.map((listing) => (
        <ListingListCard
          key={listing.id}
          listing={listing}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}