import {
  ArrowLeft,
  Heart,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  ExplorerConfig,
  ListingFilters,
  ListingMode,
  ListingSort,
  ListingView,
} from "../../types/explorer";

import { useInfiniteListings } from "../hooks/useInfiniteListings";

import { SearchBar } from "../navigation/SearchBar";
import { PageContainer } from "../layout/PageContainer";

import { ListingTabs } from "./ListingTabs";
import { FilterBar } from "./FilterBar";
import { PopularLocations } from "./PopularLocations";
import { ExplorerToolbar } from "./ExplorerToolbar";
import { ListingGrid } from "./ListingGrid";
import { ListingList } from "./ListingList";
import { LoadMoreSentinel } from "./LoadMoreSentinel";

interface ExplorerProps {
  config: ExplorerConfig;
}

export function Explorer({
  config,
}: ExplorerProps) {
  const navigate = useNavigate();

  const [mode, setMode] =
    useState<ListingMode>(
      config.mode ?? "all"
    );

  const [filters, setFilters] =
    useState<ListingFilters>(
      config.filters ?? {}
    );

  const [sort, setSort] =
    useState<ListingSort>(
      config.sort ?? "recommended"
    );

  const [view, setView] =
    useState<ListingView>(
      config.initialView ?? "grid"
    );

  const {
    items,
    loading,
    hasMore,
    loadMore,
  } = useInfiniteListings({
    mode,
    filters,
    sort,
  });

  const title = useMemo(
    () => config.title,
    [config.title]
  );

  return (
    <div className="min-h-screen">
      <PageContainer>
        {/* Header */}
        <header className="pt-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                grid size-10
                place-items-center
                rounded-full
                transition-colors
                hover:bg-gray-100
                dark:hover:bg-white/5
              "
              aria-label="Go back"
            >
              <ArrowLeft className="size-5 text-gray-700 dark:text-gray-200" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-bold tracking-[-0.03em] text-gray-900 dark:text-white">
                {title}
              </h1>

              {config.subtitle && (
                <p className="mt-0.5 text-xs text-gray-400">
                  {config.subtitle}
                </p>
              )}
            </div>

            <button
              type="button"
              className="
                grid size-10
                place-items-center
                rounded-xl
                border
                border-black/[0.06]
                bg-white
                text-gray-600
                dark:border-white/[0.07]
                dark:bg-white/[0.035]
                dark:text-gray-300
              "
            >
              <Heart className="size-5" />
            </button>

            <button
              type="button"
              className="
                grid size-10
                place-items-center
                rounded-xl
                bg-yegna-700
                text-white
                transition-transform
                hover:scale-105
                active:scale-95
              "
            >
              <SlidersHorizontal className="size-5" />
            </button>
          </div>
        </header>

        {/* Search */}
        <div className="mt-5">
          <SearchBar />
        </div>

        {/* Sale / rent */}
        {config.showModeTabs !== false && (
          <ListingTabs
            value={mode}
            onChange={setMode}
          />
        )}

        {/* Filters */}
        {config.showFilters !== false && (
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
          />
        )}

        {/* Popular locations */}
        {config.showPopularLocations && (
          <PopularLocations />
        )}

        {/* Toolbar */}
        <ExplorerToolbar
          resultCount={items.length}
          sort={sort}
          view={view}
          onSortChange={setSort}
          onViewChange={setView}
        />

        {/* Listings */}
        {view === "grid" ? (
          <ListingGrid listings={items} />
        ) : (
          <ListingList listings={items} />
        )}

        {/* Infinite scroll */}
        <LoadMoreSentinel
          hasMore={hasMore}
          loading={loading}
          onLoadMore={loadMore}
        />
      </PageContainer>
    </div>
  );
}