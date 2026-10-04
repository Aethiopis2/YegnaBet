export interface ListingPage {
  items: Listing[];
  page: number;
  pageSize: number;
  hasMore: boolean;
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

export interface Listing {
    id: number;
    type: ListingType;
    title: string;
    description?: string;
    price: number;
    currency?: string;
    status: number;
    location: ListingLocation;
    images: string[];
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