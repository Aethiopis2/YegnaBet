import { AppShell } from "../../components/layout/AppShell";
import { Explorer } from "../../components/explorer/Explorer";
import { useSearchParams } from "react-router-dom";

export function ExplorePage() {
  const [ searchParam ]= useSearchParams();
  const isFeatured = searchParam.get("featured") === "true";
  const isTrending = searchParam.get("trending") === "trending";
  const isVerified = searchParam.get("verified") === "true";
  const mode = searchParam.get("mode");
  const location = searchParam.get("location");


  return (
    <AppShell>
      <Explorer
        config={{
          title: "Explore",
          subtitle:
            "Find your next place with Yegna Bet",
          showPopularLocations: true,
          showModeTabs: true,
          showFilters: true,
          initialView: "grid",
          filters: {
            featured: isFeatured,
            trending: isTrending,
            verified: isVerified,
            location: location ?? undefined,
          },
          mode: mode as "Buy" | "Rent" | "All" | "Contract" | "Service",
          showMode: false,
        }}
      />
    </AppShell>
  );
}