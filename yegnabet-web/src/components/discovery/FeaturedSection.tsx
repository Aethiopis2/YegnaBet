import { useEffect, useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { FeaturedCard } from "./FeaturedCard";
import type { Listing } from "../../types/listings";
import { API } from "../../types/api";

export function FeaturedSection() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    API.get(`/listings/featured-listings?page=0&pageSize=3`).then(r => setListings(r.data.items));
  });

  const featured = listings.filter(
    (listing) => listing.featured
  );

  return (
    <section className="mt-8">
      <SectionHeader
        title="Featured Properties"
        actionLabel="View all"
        actionHref="/explore?featured=true"
      />

      <div
        className="
          mt-4
          flex gap-4
          overflow-x-auto
          pb-2
          snap-x snap-mandatory
        "
      >
        {featured.map((listing) => (
          <FeaturedCard
            key={listing.id}
            listing={listing}
            className="
              w-[82vw]
              max-w-[330px]
              shrink-0
              snap-start
              sm:w-[300px]
            "
          />
        ))}
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {featured.map((listing, index) => (
          <span
            key={listing.id}
            className={`
              h-1.5 rounded-full
              transition-all duration-300
              ${
                index === 0
                  ? "w-5 bg-yegna-700 dark:bg-yegna-400"
                  : "w-1.5 bg-gray-200 dark:bg-white/15"
              }
            `}
          />
        ))}
      </div>
    </section>
  );
}