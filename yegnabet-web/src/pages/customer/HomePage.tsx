import { AppShell } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";

import { AdvertisementCarousel } from "../../components/discovery/AdvertisementCarousel";
import { CategorySection } from "../../components/discovery/CategorySection";
import { FeaturedSection } from "../../components/discovery/FeaturedSection";
import { HeroSection } from "../../components/discovery/HeroSection";
import { HowItWorks } from "../../components/discovery/HowItWorks";
import { PreferenceSection } from "../../components/discovery/PreferenceSection";

export default function HomePage() {
  return (
    <AppShell>
      <PageContainer>
        <HeroSection />

        <PreferenceSection />

        <CategorySection />

        <FeaturedSection />

        <AdvertisementCarousel />

        <HowItWorks />
      </PageContainer>
    </AppShell>
  );
}