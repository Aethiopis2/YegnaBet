export type ListingType =  "land" | "house" | "apartment" | "commercial" | "service";
export type ListingStatus = | "sale" | "rent" | "contract" | "available";

export interface ListingLocation {
    city: string;
    area: string;
    neighborhood?: string;
    latitude?: number;
    longitude?: number;
}

export interface ListingProvider {
    id: number;
    name: string;
    avatar?: string;
    company?: string;
    verified?: boolean;
}

export interface ListingMetadata {
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    parking?: number;
    rating?: number;
    experiance?: number;
    floors?: number;
    parkingSpaces?: number;
    yearBuilt?: number;
}

export interface ListingBroker {
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
    status: ListingStatus;
    location: ListingLocation;
    images: string[];
    featured?: boolean;
    verified?: boolean;
    trending?: boolean;
    saved?: boolean;
    metadata: ListingMetadata;
    provider: ListingProvider;
    features?: string[];
    createdAt?: string;
    broker?: ListingBroker;
}