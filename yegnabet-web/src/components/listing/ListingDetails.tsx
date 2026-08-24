import { useState } from "react";

import type { Listing } from "../../types/listings";

import { ListingGallery } from "./ListingGallery";
import { ListingHeader } from "./ListingHeader";
import { ListingFacts } from "./ListingFacts";
import { ListingDescription } from "./ListingDescription";
import { ListingFeatures } from "./ListingFeatures";
import { ListingVerification } from "./ListingVerification";
import { ListingLocation } from "./ListingLocation";
import { ListingBroker } from "./ListingBroker";
import { ListingActionBar } from "./ListingActionBar";

interface ListingDetailProps {
  listing: Listing;
}

export function ListingDetail({
  listing,
}: ListingDetailProps) {
  const [saved, setSaved] = useState(
    listing.saved ?? false
  );

  const handleMessage = () => {
    console.log(
      "Message broker:",
      listing.id
    );
  };

  const handleViewing = () => {
    console.log(
      "Request viewing:",
      listing.id
    );
  };

  return (
    <div
      className="
        min-h-screen
        bg-gray-50
        pb-24
        dark:bg-[#0d0f0e]
        sm:pb-10
      "
    >
      <div
        className="
          mx-auto
          max-w-5xl
          sm:px-6
          lg:px-8
        "
      >
        <ListingGallery
          listing={listing}
          saved={saved}
          onSavedChange={setSaved}
        />

        <div
          className="
            mx-auto
            max-w-3xl
          "
        >
          <ListingHeader
            listing={listing}
          />

          <ListingFacts
            metadata={listing.metadata}
          />

          <ListingDescription
            description={
              listing.description
            }
          />

          <ListingFeatures
            features={listing.features}
          />

          <ListingVerification
            verified={listing.verified}
          />

          <ListingLocation
            location={listing.location}
          />

          <ListingBroker
            broker={listing.broker}
          />

          <ListingActionBar
            onMessage={handleMessage}
            onRequestViewing={
              handleViewing
            }
          />
        </div>
      </div>
    </div>
  );
}