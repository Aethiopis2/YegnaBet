import { useParams } from "react-router-dom";

import { AppShell } from "../../components/layout/AppShell";
import { Explorer } from "../../components/explorer/Explorer";

const categoryNames: Record<
  string,
  string
> = {
  houses: "Houses",
  apartments: "Apartments",
  land: "Land",
  commercial: "Commercial",
  services: "Services",
};

export function CategoryPage() {
  const { category } = useParams();

  const title =
    categoryNames[category ?? ""] ??
    "Listings";

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
          showPopularLocations: false,
          showModeTabs:
            category !== "services",
          showFilters: true,
          initialView: "grid",
        }}
      />
    </AppShell>
  );
}