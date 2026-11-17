
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  ListingFilters,
  ListingSort,
} from "../../types/customer/explorer";

import type {
  Listing,
  ListingMode,
  ListingQueryDto,
} from "../../types/customer/listings";

import type { AuthUser } from "../../types/auth/authTypes";
import { useAuth } from "../../types/auth/authStore";
import { getListings } from "../../lib/customer/customerApi";

const PAGE_SIZE = 5;

interface Options {
  mode: ListingMode;
  filters: ListingFilters;
  sort: ListingSort;
  user?: AuthUser | null;
  listingId?: number;
  taxonomyNodeId?: number;
  providerId?: number;
}

export function useInfiniteListings({
  mode,
  filters,
  sort,
  user,
  taxonomyNodeId,
  providerId,
}: Options) {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<Listing[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadingRef = useRef(false);
  const requestIdRef = useRef(0);

  const userId = user?.id;

  const buildQuery = useCallback(
    (pageNumber: number) => {
      const query: ListingQueryDto = {
        page: pageNumber,
        pageSize: PAGE_SIZE,
        ...(filters.search?.trim() ? { search: filters.search.trim() } : {}),
        ...(mode !== "All" ? { method: mode } : {}),
        ...(taxonomyNodeId !== undefined ? { taxonomyNodeId } : {}),
        ...(filters.locationIds?.length ? { locationIds: filters.locationIds } : {}),
        ...(filters.category ? { category: filters.category } : {}),
        ...(filters.minPrice !== undefined ? { minPrice: filters.minPrice } : {}),
        ...(filters.maxPrice !== undefined ? { maxPrice: filters.maxPrice } : {}),
        ...(filters.attributes && Object.keys(filters.attributes).length
          ? { attributes: Object.fromEntries(Object.entries(filters.attributes).map(([key, value]) => [key, String(value)])) }
          : {}),
        ...(filters.verified ? { verified: true } : {}),
        ...(filters.featured ? { featured: true } : {}),
        ...(filters.trending ? { trending: true } : {}),
        ...(filters.saved ? { saved: true } : {}),
        ...(filters.status && filters.status !== "All" ? { status: filters.status } : {}),
        ...(filters.status === "All" ? { allStatuses: true } : {}),
        ...(filters.myListingsOnly ? { myListingsOnly: true } : {}),
        ...(providerId !== undefined ? { providerId } : {}),
        ...(sort ? { sort } : {}),
        ...(userId !== undefined ? { userId } : {}),
      };
      return query;
    },
    [
      mode,
      taxonomyNodeId,
      filters,
      sort,
      userId,
      providerId,
    ]
  );

  const loadPage = useCallback(
    async (
      pageNumber: number,
      reset = false
    ) => {
      if (loadingRef.current && !reset) {
        return;
      }

      loadingRef.current = true;
      setLoading(true);
      if (reset) setError(null);

      const requestId = ++requestIdRef.current;

      try {
        const data = await getListings(buildQuery(pageNumber), accessToken);

        // Ignore outdated requests.

        if (requestId !== requestIdRef.current) {
          return;
        }

        setItems(current =>
          reset
            ? data.items
            : [...current, ...data.items]
        );

        setPage(data.page);
        setHasMore(data.hasMore);
        setError(null);

      } catch (error) {
        if (requestId === requestIdRef.current) {
          console.error(
            "Failed to load listings",
            error
          );
          setError(error instanceof Error ? error.message : "Could not load listings.");
        }
      } finally {
        if (requestId === requestIdRef.current) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    },
    [accessToken, buildQuery]
  );

  // Reset pagination whenever search criteria change.

  useEffect(() => {
    loadingRef.current = false;

    setItems([]);
    setPage(0);
    setHasMore(true);

    void loadPage(0, true);

    return () => {
      // Invalidate requests from the previous query.
      requestIdRef.current++;
      loadingRef.current = false;
    };
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (!loadingRef.current && hasMore) {
      void loadPage(page + 1);
    }
  }, [
    hasMore,
    loadPage,
    page,
  ]);

  return {
    items,
    loading,
    hasMore,
    loadMore,
    error,
    retry: () => void loadPage(0, true),
  };
}
