import type { Listing } from "../../types/listings";
import type { MatchResult } from "../../types/match";

import { ListingGridCard } from "../explorer/ListingGridCard";

interface MatchListingCardProps {
  listing: Listing;
  result: MatchResult;
}

export function MatchListingCard({
  listing,
  result,
}: MatchListingCardProps) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-yegna-800 shadow-sm backdrop-blur dark:bg-black/70 dark:text-yegna-300">
        {result.score}% Match
      </div>

      <ListingGridCard
        listing={listing}
      />
    </div>
  );
}