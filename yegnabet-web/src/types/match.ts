export type MatchPropertyType =
  | "house"
  | "apartment"
  | "land"
  | "commercial";

export interface MatchPreferences {
  propertyType?: MatchPropertyType;

  city?: string;

  areas: string[];

  minPrice?: number;

  maxPrice?: number;

  bedrooms?: number;

  bathrooms?: number;

  features: string[];

  verifiedOnly: boolean;
}

export interface MatchResult {
  listingId: number;

  score: number;

  matchedCriteria: string[];

  missedCriteria?: string[];
}