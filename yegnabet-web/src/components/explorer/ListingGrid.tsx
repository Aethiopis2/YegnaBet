import type { Listing } from "../../types/customer/listings";
import type { UserProfile } from "../../types/customer/profile";
import { ListingGridCard } from "./ListingGridCard";

interface ListingGridProps {
  listings: Listing[];
  currentUser: UserProfile | null;
}

export function ListingGrid({
  listings,
  currentUser,
}: ListingGridProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <ListingGridCard
          key={listing.id}
          listing={listing}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}