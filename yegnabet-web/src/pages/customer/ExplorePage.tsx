import { AppShell } from "../../components/layout/AppShell";
import { Explorer } from "../../components/explorer/Explorer";
import { useLocation, useSearchParams } from "react-router-dom";
import { fromQueryString } from "../../lib/common/utils";
import type { ListingMode } from "../../types/customer/listings";

export function ExplorePage() {
  const locations = useLocation();

  const [ searchParam ]= useSearchParams();
  const mode = searchParam.get("mode");
  
  const filters = fromQueryString(locations.search);
  return (
    <AppShell currentUser={locations.state?.currentUser} mode={mode as ListingMode}>
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
          mode: mode as "Buy" | "Rent" | "All" | "Contract" | "Service",
          showMode: false,
          currentUser: locations.state?.currentUser,
        }}
      />
    </AppShell>
  );
}