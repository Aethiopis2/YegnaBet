import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";
import { PageContainer } from "../components/layout/PageContainer";

import { MatchListingCard } from "../components/match/MatchListingCard";
import { MatchResultsHeader } from "../components/match/MatchResultsHeader";

import {
  findMatches,
} from "../lib/matching";

import type { MatchPreferences } from "../types/match";

import { listings } from "../data/listings";

export function MatchResultsPage() {
  const navigate = useNavigate();

  const preferences =
    useMemo<MatchPreferences>(() => {
      const stored =
        sessionStorage.getItem(
          "yegna-match-preferences"
        );

      if (stored) {
        return JSON.parse(stored);
      }

      return {
        areas: [],
        features: [],
        verifiedOnly: false,
      };
    }, []);

  const results = useMemo(
    () =>
      findMatches(
        listings,
        preferences
      ),
    [preferences]
  );

  const resultListings = results
    .map((result) => {
      const listing = listings.find(
        (item) =>
          item.id === result.listingId
      );

      return listing
        ? {
            listing,
            result,
          }
        : null;
    })
    .filter(
      (
        item
      ): item is NonNullable<typeof item> =>
        item !== null
    );

  const bestScore =
    results[0]?.score ?? 0;

  return (
    <AppShell>
      <PageContainer>
        <main className="mx-auto max-w-6xl px-1 py-6">
          <MatchResultsHeader
            count={resultListings.length}
            score={bestScore}
            onEdit={() =>
              navigate(
                "/match/preferences"
              )
            }
          />

          {resultListings.length > 0 ? (
            <div
              className="
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-3
                lg:grid-cols-4
              "
            >
              {resultListings.map(
                ({ listing, result }) => (
                  <MatchListingCard
                    key={listing.id}
                    listing={listing}
                    result={result}
                  />
                )
              )}
            </div>
          ) : (
            <div
              className="
                rounded-3xl
                border
                border-black/[0.05]
                bg-white
                p-10
                text-center
                dark:border-white/[0.06]
                dark:bg-white/[0.035]
              "
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                No strong matches yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-gray-400">
                Try relaxing your budget,
                location or property
                requirements.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/match/preferences"
                  )
                }
                className="
                  mt-5
                  rounded-xl
                  bg-yegna-700
                  px-5
                  py-3
                  text-xs
                  font-bold
                  text-white
                "
              >
                Adjust preferences
              </button>
            </div>
          )}
        </main>
      </PageContainer>
    </AppShell>
  );
}