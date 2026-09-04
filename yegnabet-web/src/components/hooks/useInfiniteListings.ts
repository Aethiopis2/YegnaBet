import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  ListingFilters,
  ListingSort,
} from "../../types/explorer";

import type {
  Listing,
  ListingMode,
  ListingPage,
} from "../../types/listings";

import { API, ASSET_URL } from "../../types/api";


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

  const [items, setItems] =
    useState<Listing[]>([]);

  const [page, setPage] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [hasMore, setHasMore] =
    useState(true);


  const buildQuery = (
    pageNumber: number
  ) => {

    const params =
      new URLSearchParams();

    params.set(
      "page",
      pageNumber.toString()
    );

    params.set(
      "pageSize",
      PAGE_SIZE.toString()
    );


    /*
     * Sale / Rent
     */

    if (mode !== "All") {
      params.set(
        "method",
        mode === "Buy"
          ? "Buy"
          : mode === "Rent"
            ? "Rent"
            : mode === "Contract"
              ? "Contract"
              : "Service"
      );
    }


    /*
     * Location
     */

    if (filters.location) {
      params.set(
        "location",
        filters.location
      );
    }


    /*
     * Category
     */

    if (filters.category) {
      params.set(
        "category",
        filters.category
      );
    }


    /*
     * Verified
     */

    if (filters.verified) {
      params.set(
        "verified",
        "true"
      );
    }


    /*
     * Featured
     */

    if (filters.featured) {
      params.set(
        "featured",
        "true"
      );
    }


    /*
     * Trending
     */

    if (filters.trending) {
      params.set(
        "trending",
        "true"
      );
    }


    /*
     * Saved
     */

    if (filters.saved) {
      params.set(
        "saved",
        "true"
      );
    }


    /*
     * Bedrooms
     *
     * Keep compatibility with
     * the current UI for now.
     */

    if (
      filters.bedrooms !== undefined
    ) {
      params.set(
        "attributes[bedrooms]",
        filters.bedrooms.toString()
      );
    }


    /*
     * Price
     */

    if (
      filters.minPrice !== undefined
    ) {
      params.set(
        "minPrice",
        filters.minPrice.toString()
      );
    }

    if (
      filters.maxPrice !== undefined
    ) {
      params.set(
        "maxPrice",
        filters.maxPrice.toString()
      );
    }


    /*
     * Sorting
     */

    if (sort) {
      params.set(
        "sort",
        sort
      );
    }

    return params.toString();
  };


  const loadPage = useCallback(
    async (
      pageNumber: number,
      reset = false
    ) => {

      if (loading && !reset) {
        return;
      }

      setLoading(true);

      try {

        const query =
          buildQuery(pageNumber);

        const response =
          await API.get<ListingPage>(
            `listings/get-listings?${query}`
          );

        const data =
          response.data;

        // fix the relative url image address for listings
        data.items.forEach(listing => {
          listing.images =
            listing.images.map(
              image => ASSET_URL + image
            );
        });

        setItems(current =>
          reset
            ? data.items
            : [
                ...current,
                ...data.items,
              ]
        );


        setPage(data.page);

        setHasMore(
          data.hasMore
        );

      } finally {

        setLoading(false);

      }
    },
    [
      mode,
      filters,
      sort,
      loading,
    ]
  );


  /*
   * Reset whenever the
   * query changes.
   */

  useEffect(() => {

    setItems([]);

    setPage(0);

    setHasMore(true);

    loadPage(0, true);

  }, [
    mode,
    filters,
    sort,
  ]);


  const loadMore =
    useCallback(() => {

      if (
        !loading &&
        hasMore
      ) {
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