import { useEffect, useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { FeaturedCard } from "./FeaturedCard";
import type { Listing, ListingMode } from "../../types/customer/listings";
import { ASSET_URL } from "../../types/api";
import { Fetch } from "../../lib/common/network";
import type { ListingPage } from "../../types/customer/listings";
import Loading from "../ui/common/Loading";

interface FeaturedSectionProps {
  listingMode: ListingMode;
  setDialog: any;
}

export function FeaturedSection({ listingMode, setDialog }: FeaturedSectionProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const onSuccess = (listingPage: ListingPage) => {
    listingPage.items.forEach((listing: Listing) => {
        if (listing.images) {
          listing.images = listing.images.map((img: string) => ASSET_URL + img);
        }
      });
    
    setListings(listingPage.items);
  };
  
  useEffect(() => {
    setLoading(true);
    Fetch(`/listings/get-listings?featured=true&method=${listingMode}`,
      onSuccess,
      setLoading,
      setDialog
    )
  }, [listingMode])

  const featured = listings.filter(
    (listing) => listing.featured
  );

  if (loading) {
    return (
      <Loading />
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