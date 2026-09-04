import { AppShell } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";

import { AdvertisementCarousel } from "../../components/discovery/AdvertisementCarousel";
import { CategorySection } from "../../components/discovery/CategorySection";
import { FeaturedSection } from "../../components/discovery/FeaturedSection";
import { HeroSection } from "../../components/discovery/HeroSection";
import { HowItWorks } from "../../components/discovery/HowItWorks";
import { TransactionMode, } from "../../components/discovery/TransactionMode";
import { useState } from "react";
import type { ListingMode } from "../../types/listings";

export default function HomePage() {
  const [listingMode, setListingMode] = useState<ListingMode>("Buy");

  return (
    <AppShell>
      <PageContainer>
        <HeroSection />

        <TransactionMode 
          value={listingMode}
          onChange={setListingMode}
        />

        <CategorySection listingMode={listingMode} />

        <FeaturedSection listingMode={listingMode} />

        <AdvertisementCarousel />

        <HowItWorks />
      </PageContainer>
    </AppShell>
  );
}