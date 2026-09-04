import { useEffect, useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { FeaturedCard } from "./FeaturedCard";
import type { Listing, ListingMode } from "../../types/listings";
import { API, ASSET_URL } from "../../types/api";
import { AppShell } from "../layout/AppShell";

export function FeaturedSection({ listingMode }: { listingMode: ListingMode }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`/listings/get-listings?featured=true&method=${listingMode}`)
      .then((res) => {
        // correct image url if since its always relative
        if (res.data) {
          res.data.items.forEach((listing: Listing) => {
            if (listing.images) {
              listing.images = listing.images.map((img: string) => ASSET_URL + img);
            }
          });
          setListings(res.data.items);
        }
      })
      .catch((error) => {
        console.error("Failed to load listing", error);
        setListings([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [listingMode]);

  const featured = listings.filter(
    (listing) => listing.featured
  );

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500" />
        </div>
      </AppShell>
    );
  }
  
  return (
    <section className="mt-8">
      <SectionHeader
        title="Featured Properties"
        actionLabel="View all"
        actionHref={`/explore?featured=true&mode=${listingMode}`}
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
              max-w-82.5
              shrink-0
              snap-start
              sm:w-75
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