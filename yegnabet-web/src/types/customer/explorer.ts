
import type { ListingLifecycleStatus, ListingMode } from "./listings";
import type { AuthUser } from "../auth/authTypes";
import type { MatchPreferences } from "../match";

export type ListingView = "grid" | "list";

export interface ListingFilters {
  // Multiple location IDs
  locationIds?: number[];

  // Universal filters
  minPrice?: number;
  maxPrice?: number;

  // Dynamic taxonomy attributes
  attributes?: Record<
    string,
    string | number | boolean
  >;

  // Existing filters
  search?: string;
  taxonomyNodeId?: number;
  category?: string;
  verified?: boolean;
  featured?: boolean;
  trending?: boolean;
  saved?: boolean;
  status?: ListingLifecycleStatus | "All";
  myListingsOnly?: boolean;
}

export type ListingSort =
  | "recommended"
  | "newest"
  | "price-low"
  | "price-high";

export type AttributeFilterType =
  | "number"
  | "boolean"
  | "select";

export interface TaxonomyFilterDefinition {
  id: number;
  key: string;
  name: string;
  dataType: AttributeFilterType;
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
}

export interface ExplorerConfig {
  title: string;
  subtitle?: string;

  mode?: ListingMode;
  filters?: ListingFilters;

  taxonomyNodeId?: number;
  attributeFilters?: TaxonomyFilterDefinition[];

  showMode?: boolean;
  showPopularLocations?: boolean;
  showModeTabs?: boolean;
  showFilters?: boolean;

  initialView?: ListingView;
  sort?: ListingSort;
  user?: AuthUser;
  matchPreferences?: MatchPreferences;
  providerId?: number;
}
