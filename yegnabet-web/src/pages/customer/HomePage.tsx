import { AppShell } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";
import { AdvertisementCarousel } from "../../components/discovery/AdvertisementCarousel";
import { CategorySection } from "../../components/discovery/CategorySection";
import { FeaturedSection } from "../../components/discovery/FeaturedSection";
import { HeroSection } from "../../components/discovery/HeroSection";
import { HowItWorks } from "../../components/discovery/HowItWorks";
import { TransactionMode, } from "../../components/explorer/listing/TransactionMode";
import { useEffect, useState } from "react";
import { useAuth } from "../../types/auth/authContext";
import type { ListingMode } from "../../types/customer/listings";
import { getCustomerAuth } from "../../lib/customer/customerApi";
import type { UserProfile } from "../../types/customer/profile";

export default function HomePage() {
  const { accessToken } = useAuth();

  const [loggedUser, setLoggedUser] = useState<UserProfile | null>(null);
  const [listingMode, setListingMode] = useState<ListingMode>("Buy");

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const loadLoggedUser = async () => {
      try {
        const user = await getCustomerAuth(accessToken);
        setLoggedUser(user);
      } catch (err) {
        console.error(err);
      }
    };

    loadLoggedUser();
  }, [accessToken]);

  return (
    <AppShell currentUser={loggedUser} mode={listingMode}>
      <PageContainer>
        <HeroSection />

        <TransactionMode 
          value={listingMode}
          onChange={(val) => setListingMode(val)} />

        <CategorySection 
          listingMode={listingMode}
          currentUser={loggedUser} />

        <FeaturedSection 
          listingMode={listingMode}
          currentUser={loggedUser} />

        <AdvertisementCarousel />

        <HowItWorks />
      </PageContainer>
    </AppShell>
  );
}