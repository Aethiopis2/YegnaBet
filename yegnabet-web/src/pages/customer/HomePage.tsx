import { AppShell, useAppContext } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";
import { AdvertisementCarousel } from "../../components/discovery/AdvertisementCarousel";
import { CategorySection } from "../../components/discovery/CategorySection";
import { FeaturedSection } from "../../components/discovery/FeaturedSection";
import { HeroSection } from "../../components/discovery/HeroSection";
import { HowItWorks } from "../../components/discovery/HowItWorks";
import { TransactionMode, } from "../../components/explorer/listing/TransactionMode";

function HomePageContent() {
  const { user, listingMode, setListingMode } = useAppContext();
    
  return (
    <PageContainer>
      <HeroSection />

      <TransactionMode 
        value={listingMode}
        onChange={(val) => setListingMode(val)} />

      <CategorySection 
        listingMode={listingMode}
        user={user} />

      <FeaturedSection 
        listingMode={listingMode}
        user={user} />

      <AdvertisementCarousel />

      <HowItWorks />
    </PageContainer>
  );
}

export default function HomePage() {
  return (
    <AppShell>
      <HomePageContent />
    </AppShell>
  )
}