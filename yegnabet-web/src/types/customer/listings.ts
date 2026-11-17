export interface ListingPage {
  items: Listing[];
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export type ListingLifecycleStatus = "Draft" | "Active" | "Pending" | "Closed" | "Cancelled";

/** Query parameters accepted by GET /api/listings (backend ListingQueryDto). */
export interface ListingQueryDto {
  page?: number;
  pageSize?: number;
  id?: number;
  userId?: number;
  method?: Exclude<ListingMode, "All">;
  taxonomyNodeId?: number;
  category?: string;
  search?: string;
  locationIds?: number[];
  location?: string;
  verified?: boolean;
  featured?: boolean;
  trending?: boolean;
  saved?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  attributes?: Record<string, string>;
  status?: ListingLifecycleStatus;
  allStatuses?: boolean;
  myListingsOnly?: boolean;
  providerId?: number;
}


export type ListingType =  "land" | "house" | "apartment" | "commercial" | "service";
export type ListingStatus = | "sale" | "rent" | "contract" | "available";

// export interface ListingLocation {
//     city: string;
//     area: string;
//     neighborhood?: string;
//     latitude?: number;
//     longitude?: number;
// }

/**
 * @description an interface used to fetch location information to/from
 *  a backend service. A location is but a string of unique names for every listing
 *  that exists and avoid duplication when handling listings with similar locations.
 */
export interface ListingLocation {
    id: number;
    country: string;
    city: string;
    area: string;
    subArea?: string;
    count: number;
}


export interface ListingProvider {
    id: number;
    name: string;
    avatar?: string;
    company?: string;
    verified?: boolean;
}

export interface ListingMetadata {
  name: string;
  key: string;
  value: string;
}

export interface ListingPage {
  items: Listing[];
  page: number;
  pageSize: number;
  hasMore: boolean;
}


export interface ListingEmployee {
  id: number;
  name: string;
  avatar?: string;
  phone?: string;
  verified: boolean;
  listingsCount?: number;
}

export interface ListingMedia {
  url: string;
  kind: "photo" | "video" | "other" | string;
  isPrimary?: boolean;
}

export interface Listing {
    id: number;
    type: ListingType;
    title: string;
    description?: string;
    price: number;
    currency?: string;
    status: number;
    listingStatus?: ListingLifecycleStatus;
    method?: Exclude<ListingMode, "All">;
    category: string;
    views: number;
    location: ListingLocation;
    images: string[];
    media?: ListingMedia[];
    featured?: boolean;
    verified?: boolean;
    trending?: boolean;
    saved?: boolean;
    metadata: ListingMetadata[];
    provider: ListingProvider;
    features?: string[];
    createdAt?: string;
    employee?: ListingEmployee;

    assignmentId?: string;
    assignmentExpiresAt?: string;
}

export type ListingMode = "Buy" | "Rent" | "Contract" | "Service" | "All";


export interface AddUpdateSavedListing {
  userId: number;
  listingId: number;
  saved: boolean;
}

export interface UpdateManagedListingRequest {
  title: string;
  description?: string;
  price?: number;
  city: string;
  area: string;
  method: Exclude<ListingMode, "All">;
  listingStatus: ListingLifecycleStatus;
}

export interface ListingViewCountRequest {
  listingId: number;
  userId?: number;
}
