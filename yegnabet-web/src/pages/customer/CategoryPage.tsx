import { useLocation, useParams, } from "react-router-dom";
import { AppShell, useAppContext } from "../../components/layout/AppShell";
import { Explorer } from "../../components/explorer/Explorer";


function CategoryPageComponent() {

  const { category } = useParams();
  const location = useLocation();
  
  const title = category ?? "All";
  const { user, listingMode } = useAppContext();

  return (
    <Explorer
      key={category ?? "all"}
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
        mode: listingMode,
        showMode: true,
        showPopularLocations: true,
        showModeTabs:
          category !== "services",
        showFilters: true,
        initialView: "grid",
        user: user ?? location.state?.user,
      }}
    />
  );
}

export function CategoryPage() {
  return (
    <AppShell>
      <CategoryPageComponent />
    </AppShell>
  );
}
