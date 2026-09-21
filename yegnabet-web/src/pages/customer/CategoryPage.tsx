import { useParams, useSearchParams } from "react-router-dom";

import { AppShell } from "../../components/layout/AppShell";
import { Explorer } from "../../components/explorer/Explorer";
import type { ListingMode } from "../../types/customer/listings";


export function CategoryPage() {
  const { category } = useParams();
  const [searchParam] = useSearchParams();
  const mode = searchParam.get("mode") ?? "Buy";

  const title = category ?? "All";

  return (
    <AppShell>
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
        }}
      />
    </AppShell>
  );
}