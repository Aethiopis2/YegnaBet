import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { listings as mockListings } from "../../data/listings";

import type {
  ListingFilters,
  ListingMode,
  ListingSort,
} from "../types/explorer";

import type { Listing } from "../types/listings";

const PAGE_SIZE = 5;

interface Options {
  mode: ListingMode;
  filters: ListingFilters;
  sort: ListingSort;
}

export function useInfiniteListings({
  mode,
  filters,
  sort,
}: Options) {
  const [items, setItems] = useState<Listing[]>(
    []
  );

  const [page, setPage] = useState(0);

  const [loading, setLoading] =
    useState(false);

  const [hasMore, setHasMore] =
    useState(true);

  const loadPage = useCallback(
    async (
      pageNumber: number,
      reset = false
    ) => {
      if (loading && !reset) {
        return;
      }

      setLoading(true);

      // Simulate API latency.
      await new Promise((resolve) =>
        window.setTimeout(resolve, 500)
      );

      let result = [...mockListings];

      /*
       * Mode
       */
      if (mode !== "all") {
        result = result.filter(
          (listing) =>
            listing.status === mode
        );
      }

      /*
       * Location
       */
      if (filters.location) {
        result = result.filter(
          (listing) =>
            listing.location.area
              .toLowerCase()
              .includes(
                filters.location!.toLowerCase()
              )
        );
      }

      /*
       * Category
       */
      if (filters.category) {
        result = result.filter(
          (listing) =>
            listing.type ===
            filters.category
        );
      }

      /*
       * Verified
       */
      if (filters.verified) {
        result = result.filter(
          (listing) => listing.verified
        );
      }

      /*
       * Featured
       */
      if (filters.featured) {
        result = result.filter(
          (listing) => listing.featured
        );
      }

      /*
       * Trending
       */
      if (filters.trending) {
        result = result.filter(
          (listing) => listing.trending
        );
      }

      /*
       * Saved
       */
      if (filters.saved) {
        result = result.filter(
          (listing) => listing.saved
        );
      }

      /*
       * Bedrooms
       */
      if (filters.bedrooms) {
        result = result.filter(
          (listing) =>
            (listing.metadata.bedrooms ??
              0) >= filters.bedrooms!
        );
      }

      /*
       * Price
       */
      if (filters.minPrice !== undefined) {
        result = result.filter(
          (listing) =>
            listing.price >=
            filters.minPrice!
        );
      }

      if (filters.maxPrice !== undefined) {
        result = result.filter(
          (listing) =>
            listing.price <=
            filters.maxPrice!
        );
      }

      /*
       * Sorting
       */
      switch (sort) {
        case "price-low":
          result.sort(
            (a, b) => a.price - b.price
          );
          break;

        case "price-high":
          result.sort(
            (a, b) => b.price - a.price
          );
          break;

        case "newest":
          result.sort(
            (a, b) => b.id - a.id
          );
          break;

        default:
          break;
      }

      const start =
        pageNumber * PAGE_SIZE;

      const pageItems = result.slice(
        start,
        start + PAGE_SIZE
      );

      setItems((current) =>
        reset
          ? pageItems
          : [...current, ...pageItems]
      );

      setPage(pageNumber);

      setHasMore(
        start + PAGE_SIZE < result.length
      );

      setLoading(false);
    },
    [filters, mode, sort, loading]
  );

  /*
   * Reset whenever the query changes.
   */
  useEffect(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);

    loadPage(0, true);
  }, [mode, filters, sort]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadPage(page + 1);
    }
  }, [
    hasMore,
    loadPage,
    loading,
    page,
  ]);

  return {
    items,
    loading,
    hasMore,
    loadMore,
  };
}