import type { Listing } from "./listings";

export type ListingView = "grid" | "list";

export type ListingMode =
  | "all"
  | "sale"
  | "rent";

export interface ListingFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  category?: string;
  verified?: boolean;
  featured?: boolean;
  trending?: boolean;
  saved?: boolean;
}

export type ListingSort =
  | "recommended"
  | "newest"
  | "price-low"
  | "price-high";

export interface ExplorerConfig {
  title: string;
  subtitle?: string;

  mode?: ListingMode;

  filters?: ListingFilters;

  showPopularLocations?: boolean;
  showModeTabs?: boolean;
  showFilters?: boolean;

  initialView?: ListingView;

  sort?: ListingSort;
}

export interface ListingPage {
  items: Listing[];
  page: number;
  pageSize: number;
  hasMore: boolean;
}