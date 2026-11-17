import { useEffect, useState } from "react";

import { AppShell } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";
import { Explorer } from "../../components/explorer/Explorer";
import ErrorBlock from "../../components/ui/common/ErrorBlock";
import Loading from "../../components/ui/common/Loading";
import { getMatchExplorerFilters } from "../../lib/customer/customerApi";
import type { ListingFilters } from "../../types/customer/explorer";
import { useAuth } from "../../types/auth/authStore";
import type { MatchPreferences } from "../../types/match";

function readMatchPreferences(): MatchPreferences {
  try {
    const stored = sessionStorage.getItem("yegna-match-preferences");
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<MatchPreferences>;
      return {
        ...parsed,
        areas: Array.isArray(parsed.areas) ? parsed.areas : [],
        features: Array.isArray(parsed.features) ? parsed.features : [],
        verifiedOnly: Boolean(parsed.verifiedOnly),
      } as MatchPreferences;
    }
  } catch (error) {
    console.warn("Could not read saved match preferences", error);
  }

  return { areas: [], features: [], verifiedOnly: false };
}

function MatchResultsContent() {
  const { user } = useAuth();
  const [preferences] = useState(readMatchPreferences);
  const [filters, setFilters] = useState<ListingFilters | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void getMatchExplorerFilters(preferences)
      .then(initialFilters => {
        if (!cancelled) setFilters(initialFilters);
      })
      .catch(loadError => {
        console.error("Failed to prepare match filters", loadError);
        if (!cancelled) setError("We could not prepare your matches. Please try again.");
      });

    return () => { cancelled = true; };
  }, [preferences]);

  if (error) {
    return <PageContainer><ErrorBlock message={error} /></PageContainer>;
  }

  if (!filters) {
    return <PageContainer><Loading /></PageContainer>;
  }

  return (
    <Explorer
      config={{
        title: "Your matches",
        subtitle: "Browse properties based on your preferences. Refine the search to find the right fit.",
        mode: "All",
        filters,
        matchPreferences: preferences,
        showMode: false,
        showModeTabs: true,
        showFilters: true,
        showPopularLocations: false,
        initialView: "grid",
        user: user ?? undefined,
      }}
    />
  );
}

export function MatchResultsPage() {
  return (
    <AppShell>
      <MatchResultsContent />
    </AppShell>
  );
}
