import type { Listing } from "../../types/customer/listings";
import type { MatchResult } from "../../types/match";
import type { AuthUser } from "../../types/auth/authTypes";

import { ListingGridCard } from "../explorer/ListingGridCard";

interface MatchListingCardProps {
  listing: Listing;
  result: MatchResult;
  user: AuthUser | null;
}

export function MatchListingCard({
  listing,
  result,
  user,
}: MatchListingCardProps) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-yegna-800 shadow-sm backdrop-blur dark:bg-black/70 dark:text-yegna-300">
        {result.score}% Match
      </div>

      <ListingGridCard
        listing={listing}
        user={user}
      />
    </div>
  );
}
