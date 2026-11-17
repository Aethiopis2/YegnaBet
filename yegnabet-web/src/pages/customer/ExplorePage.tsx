import { AppShell, useAppContext } from "../../components/layout/AppShell";
import { Explorer } from "../../components/explorer/Explorer";
import { useLocation } from "react-router-dom";
import { fromQueryString } from "../../lib/common/utils";


function ExplorePageComponent() {
  const locations = useLocation();
  const { user, listingMode } = useAppContext();
  
  const filters = fromQueryString(locations.search);

  return (
    <Explorer
      config={{
        title: "Explore",
        subtitle:
          "Find your next place with Yegna Bet",
        showPopularLocations: true,
        showModeTabs: true,
        showFilters: true,
        initialView: "grid",
        filters: filters,
        mode: filters.saved ? "All" : listingMode,
        showMode: false,
        user: user ?? locations.state?.user,
      }}
    />
  );
}


export function ExplorePage() {
  return (
    <AppShell>
      <ExplorePageComponent />
    </AppShell>
  )
}
