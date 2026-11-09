import type { AuthUser } from "../../types/auth/authTypes";
import type { Listing } from "../../types/customer/listings";
import { ListingGridCard } from "./ListingGridCard";

interface ListingGridProps {
  listings: Listing[];
  user: AuthUser | null;
}

export function ListingGrid({
  listings,
  user,
}: ListingGridProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <ListingGridCard
          key={listing.id}
          listing={listing}
          user={user}
        />
      ))}
    </div>
  );
}