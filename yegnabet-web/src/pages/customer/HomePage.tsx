import { AppShell } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";
import { AdvertisementCarousel } from "../../components/discovery/AdvertisementCarousel";
import { CategorySection } from "../../components/discovery/CategorySection";
import { FeaturedSection } from "../../components/discovery/FeaturedSection";
import { HeroSection } from "../../components/discovery/HeroSection";
import { HowItWorks } from "../../components/discovery/HowItWorks";
import { TransactionMode, } from "../../components/explorer/listing/TransactionMode";
import { useState } from "react";
import type { ListingMode } from "../../types/customer/listings";
import { OkDialog } from "../../components/ui/common/okDialog";

export default function HomePage() {
  const [listingMode, setListingMode] = useState<ListingMode>("Buy");
  const [dialog, setDialog] = useState({
      open: false,
      message: ""
    });

  return (
    <AppShell>
      <PageContainer>
        <HeroSection />

        <TransactionMode 
          value={listingMode}
          onChange={(val) => setListingMode(val)} />

        <CategorySection 
          listingMode={listingMode}
          setDialog={setDialog} />

        <FeaturedSection 
          listingMode={listingMode}
          setDialog={setDialog} />

        <AdvertisementCarousel />

        <HowItWorks />

        <OkDialog
            open={dialog.open}
            message={dialog.message}
            onOk={() =>
              setDialog({
                open: false,
                message: "",
              })
            }
          />
      </PageContainer>
    </AppShell>
  );
}