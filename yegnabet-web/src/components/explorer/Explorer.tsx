import {
  ArrowLeft,
  Heart,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  ExplorerConfig,
  ListingFilters,
  ListingSort,
  ListingView,
  TaxonomyFilterDefinition,
} from "../../types/customer/explorer";

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
import type { ListingMode } from "../../types/customer/listings";
import { TransactionMode } from "./listing/TransactionMode";
import { OkDialog } from "../ui/common/okDialog";

import type {
  ListingLocation,
} from "../../types/customer/location";

import { getLocations, getTaxonomyNodeAttributes, getTaxonomyNodeId, getTaxonomyTree } from "../../lib/customer/customerApi";
import type { TaxonomyNode } from "../../types/customer/taxonomy";
import { findMatches } from "../../lib/matching";

function toTaxonomySlug(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function toFilterDefinitions(attributes: Awaited<ReturnType<typeof getTaxonomyNodeAttributes>>): TaxonomyFilterDefinition[] {
  return attributes.flatMap(attribute => {
    if (!attribute.filterable) return [];
    const type = attribute.type.toLowerCase();
    const dataType: TaxonomyFilterDefinition["dataType"] | null = type === "integer" || type === "decimal"
      ? "number"
      : type === "boolean"
        ? "boolean"
        : type === "choice"
          ? "select"
          : null;
    if (!dataType) return [];
    const min = attribute.minValue == null ? undefined : Number(attribute.minValue);
    const max = attribute.maxValue == null ? undefined : Number(attribute.maxValue);
    return [{
      id: Number(attribute.id),
      key: attribute.key,
      name: attribute.name.replace(/[_-]+/g, " ").replace(/\b\w/g, letter => letter.toUpperCase()),
      dataType,
      options: attribute.options,
      min: min !== undefined && Number.isFinite(min) ? min : undefined,
      max: max !== undefined && Number.isFinite(max) ? max : undefined,
    }];
  });
}

interface ExplorerProps {
  config: ExplorerConfig;
}

export function Explorer({ config }: ExplorerProps) {
  const navigate = useNavigate();
  
  const [mode, setMode] =
    useState<ListingMode>(
      config.mode ?? "Buy"
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

  const [locations, setLocations] = useState<ListingLocation[]>([]);
  const [taxonomyNodes, setTaxonomyNodes] = useState<TaxonomyNode[]>([]);
  const categoryFilter = filters.category?.trim() ?? "";
  const taxonomyOverride = filters.taxonomyNodeId;
  const taxonomyKey = taxonomyOverride !== undefined
    ? taxonomyOverride > 0 ? `node:${taxonomyOverride}` : ""
    : config.taxonomyNodeId !== undefined
      ? `node:${config.taxonomyNodeId}`
      : categoryFilter
        ? `category:${toTaxonomySlug(categoryFilter)}`
        : "";
  const [resolvedTaxonomy, setResolvedTaxonomy] = useState<{
    key: string;
    nodeId: number | null;
    definitions: TaxonomyFilterDefinition[];
  } | null>(null);
  const resolved = resolvedTaxonomy?.key === taxonomyKey ? resolvedTaxonomy : null;
  const activeTaxonomyNodeId = taxonomyOverride !== undefined
    ? taxonomyOverride > 0 ? taxonomyOverride : undefined
    : config.taxonomyNodeId ?? resolved?.nodeId ?? undefined;
  const activeAttributeFilters = taxonomyOverride !== undefined
    ? resolved?.definitions ?? []
    : config.attributeFilters ?? resolved?.definitions ?? [];
  const taxonomyOptions = useMemo(() => {
    const options: { id: number; name: string; depth: number }[] = [];
    const visit = (nodes: TaxonomyNode[], depth: number) => {
      nodes.forEach(node => {
        options.push({ id: node.id, name: node.name, depth });
        visit(node.children ?? [], depth + 1);
      });
    };
    visit(taxonomyNodes, 0);
    return options;
  }, [taxonomyNodes]);

  const [dialog, setDialog] = useState({
    open: false,
    message: ""
  });

  const {
  items,
  loading,
  hasMore,
  loadMore,
  error: listingLoadError,
  retry: retryListingLoad,
} = useInfiniteListings({
  mode,
  filters,
  sort,
  user: config.user,
  taxonomyNodeId: activeTaxonomyNodeId,
  providerId: config.providerId,
});

  const visibleItems = useMemo(() => {
    if (!config.matchPreferences) return items;
    const listingsById = new Map(items.map(listing => [listing.id, listing]));
    return findMatches(items, config.matchPreferences)
      .flatMap(result => {
        const listing = listingsById.get(result.listingId);
        return listing ? [listing] : [];
      });
  }, [config.matchPreferences, items]);

  const title = useMemo(
    () => config.title,
    [config.title]
  );
  
  useEffect(() => {
    if (!taxonomyKey) return;
    let cancelled = false;
    const loadCategoryFilters = async () => {
      try {
        const nodeId = taxonomyOverride !== undefined
          ? taxonomyOverride > 0 ? taxonomyOverride : null
          : config.taxonomyNodeId ?? await getTaxonomyNodeId(toTaxonomySlug(categoryFilter));
        if (cancelled) return;
        if (nodeId === null) {
          setResolvedTaxonomy({ key: taxonomyKey, nodeId: null, definitions: [] });
          return;
        }
        const attributes = await getTaxonomyNodeAttributes(nodeId);
        if (!cancelled) {
          setResolvedTaxonomy({ key: taxonomyKey, nodeId, definitions: toFilterDefinitions(attributes) });
        }
      } catch (error) {
        console.error("Failed to load category filters", error);
        if (!cancelled) setResolvedTaxonomy({ key: taxonomyKey, nodeId: config.taxonomyNodeId ?? null, definitions: [] });
      }
    };
    void loadCategoryFilters();
    return () => { cancelled = true; };
  }, [taxonomyKey, config.taxonomyNodeId, categoryFilter, taxonomyOverride]);

  useEffect(() => {
    let active = true;

    const loadLocations = async () => {
      try {
        const data = await getLocations();

        if (active) {
          setLocations(data);
        }
      } catch (err) {
        console.error(
          "Failed to load locations",
          err
        );
      }
    };

    const loadTaxonomies = async () => {
      try {
        const data = await getTaxonomyTree();
        if (active) setTaxonomyNodes(data);
      } catch (err) {
        console.error("Failed to load taxonomies", err);
      }
    };

    loadLocations();
    loadTaxonomies();

    return () => {
      active = false;
    };
  }, []);
  
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
                border-black/6
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
          <SearchBar
            value={filters.search ?? ""}
            onSearch={search => setFilters(current => {
              const next = { ...current };
              if (search) next.search = search;
              else delete next.search;
              return next;
            })}
          />
        </div>

        {/* Sale / rent */}
        {config.showMode !== false && (
          <TransactionMode
            value={mode}
            onChange={(val) => setMode(val)}
          />
        )}

        {/* Sale / rent */}
        {config.showModeTabs !== false && (
          <ListingTabs
            value={mode}
            onChange={setMode}
          />
        )}

        {(config.user?.role === "Employee" || config.user?.role === "Owner") && (
          <label className="mt-4 flex max-w-xs items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
            <span>Listing status</span>
            <select
              value={filters.status ?? ""}
              onChange={event => setFilters(current => ({
                ...current,
                status: event.target.value
                  ? event.target.value as NonNullable<ListingFilters["status"]>
                  : undefined,
              }))}
              className="h-10 min-w-44 flex-1 rounded-xl border border-black/6 bg-white px-3 text-xs text-gray-700 outline-none focus:border-yegna-500 dark:border-white/[0.07] dark:bg-white/[0.035] dark:text-gray-200"
            >
              <option value="All">All statuses</option>
              <option value="">Active and pending</option>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </label>
        )}

        {config.user?.role === "Employee" && (
          <label className="mt-3 inline-flex cursor-pointer items-center gap-3 rounded-xl border border-black/6 bg-white px-3 py-2.5 text-xs font-medium text-gray-600 dark:border-white/[0.07] dark:bg-white/[0.035] dark:text-gray-300">
            <input
              type="checkbox"
              checked={filters.myListingsOnly ?? false}
              onChange={event => setFilters(current => ({
                ...current,
                myListingsOnly: event.target.checked,
              }))}
              className="size-4 accent-yegna-700"
            />
            Only my listings
          </label>
        )}

        {/* Filters */}
        {config.showFilters !== false && (
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            attributeFilters={activeAttributeFilters}
            locations={locations}
            taxonomyOptions={taxonomyOptions}
            selectedTaxonomyNodeId={activeTaxonomyNodeId}
            onTaxonomyNodeChange={nodeId => setFilters(current => {
              const next = { ...current, taxonomyNodeId: nodeId ?? 0, attributes: {} };
              delete next.category;
              return next;
            })}
            useDefaultFilters={!activeTaxonomyNodeId}
          />
        )}

        {/* Popular locations */}
        {config.showPopularLocations && (
          <PopularLocations
            filters={filters}
            setFilters={setFilters}
            user={config.user ?? null}
            mode={mode}
            locations={locations}
          />
        )}

        {/* Toolbar */}
        <ExplorerToolbar
          resultCount={visibleItems.length}
          sort={sort}
          view={view}
          onSortChange={setSort}
          onViewChange={setView}
        />

        {/* Listings */}
        {view === "grid" ? (
          <ListingGrid listings={visibleItems} user={config.user ?? null} />
        ) : (
          <ListingList listings={visibleItems} user={config.user ?? null} />
        )}

        {listingLoadError && (
          <div role="alert" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            <span>Listings could not be loaded ({listingLoadError}).</span>
            <button type="button" onClick={retryListingLoad} className="rounded-lg border border-current/20 px-3 py-2 font-semibold hover:bg-red-100 dark:hover:bg-red-500/10">Try again</button>
          </div>
        )}

        {/* Infinite scroll */}
        <LoadMoreSentinel
          hasMore={hasMore}
          loading={loading}
          onLoadMore={loadMore}
        />
      </PageContainer>

      <OkDialog
        open={dialog.open}
        message={dialog.message}
        onOk={() =>
          setDialog({
            open: false,
            message: "",
          })
        }
      />
    </div>
  );
}
