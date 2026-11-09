import type { AuthUser } from "../../types/auth/authTypes";
import type { Listing } from "../../types/customer/listings";

import { ListingListCard } from "./ListingListCard";

interface ListingListProps {
  listings: Listing[];
  user: AuthUser | null;
}

export function ListingList({
  listings,
  user,
}: ListingListProps) {
  return (
    <div className="mt-4 space-y-3">
      {listings.map((listing) => (
        <ListingListCard
          key={listing.id}
          listing={listing}
          user={user}
        />
      ))}
    </div>
  );
}