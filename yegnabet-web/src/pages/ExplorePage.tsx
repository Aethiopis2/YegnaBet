import { AppShell } from "../components/layout/AppShell";
import { Explorer } from "../components/explorer/Explorer";

export function ExplorePage() {
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
        }}
      />
    </AppShell>
  );
}