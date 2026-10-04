import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { Explorer } from "../../components/explorer/Explorer";
import type { ListingMode } from "../../types/customer/listings";



export function CategoryPage() {

  const { category } = useParams();
  const location = useLocation();
  const [searchParam] = useSearchParams();
  const mode = searchParam.get("mode") ?? "Buy";
  const title = category ?? "All";


  return (
    <AppShell currentUser={location.state?.currentUser}>
      <Explorer
        config={{
          title,
          subtitle:
            `Find ${title.toLowerCase()} that fit your needs`,
          filters: {
            category:
              category === "houses"
                ? "house"
                : category,
          },
          mode: mode as ListingMode,
          showMode: false,
          showPopularLocations: true,
          showModeTabs:
            category !== "services",
          showFilters: true,
          initialView: "grid",
          currentUser: location.state?.currentUser,
        }}
      />
    </AppShell>
  );
}