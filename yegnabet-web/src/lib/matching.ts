import type { Listing } from "../types/listings";
import type {
  MatchPreferences,
  MatchResult,
} from "../types/match";

export function calculateMatchScore(
  listing: Listing,
  preferences: MatchPreferences
): MatchResult {
  let score = 0;

  const matchedCriteria: string[] = [];
  const missedCriteria: string[] = [];

  /*
   * Property type
   * 20 points
   */
  if (
    !preferences.propertyType ||
    listing.type === preferences.propertyType
  ) {
    score += 20;

    if (preferences.propertyType) {
      matchedCriteria.push("Property type");
    }
  } else {
    missedCriteria.push("Property type");
  }

  /*
   * Location
   * 25 points
   */
  if (
    !preferences.city ||
    listing.location.city === preferences.city
  ) {
    score += 10;

    if (preferences.city) {
      matchedCriteria.push("City");
    }
  } else {
    missedCriteria.push("City");
  }

  if (
    !preferences.areas.length ||
    preferences.areas.includes(
      listing.location.area
    )
  ) {
    score += 15;

    if (preferences.areas.length) {
      matchedCriteria.push("Location");
    }
  } else {
    missedCriteria.push("Location");
  }

  /*
   * Budget
   * 25 points
   */
  if (
    (!preferences.minPrice ||
      listing.price >= preferences.minPrice) &&
    (!preferences.maxPrice ||
      listing.price <= preferences.maxPrice)
  ) {
    score += 25;

    if (
      preferences.minPrice ||
      preferences.maxPrice
    ) {
      matchedCriteria.push("Budget");
    }
  } else {
    missedCriteria.push("Budget");
  }

  /*
   * Bedrooms
   * 10 points
   */
  if (
    preferences.bedrooms === undefined ||
    (listing.metadata.bedrooms ?? 0) >=
      preferences.bedrooms
  ) {
    score += 10;

    if (preferences.bedrooms !== undefined) {
      matchedCriteria.push("Bedrooms");
    }
  } else {
    missedCriteria.push("Bedrooms");
  }

  /*
   * Bathrooms
   * 5 points
   */
  if (
    preferences.bathrooms === undefined ||
    (listing.metadata.bathrooms ?? 0) >=
      preferences.bathrooms
  ) {
    score += 5;

    if (preferences.bathrooms !== undefined) {
      matchedCriteria.push("Bathrooms");
    }
  } else {
    missedCriteria.push("Bathrooms");
  }

  /*
   * Features
   * 10 points
   */
  if (preferences.features.length) {
    const listingFeatures =
      listing.features ?? [];

    const matchedFeatures =
      preferences.features.filter(
        (feature) =>
          listingFeatures.includes(feature)
      );

    const featureScore =
      (matchedFeatures.length /
        preferences.features.length) *
      10;

    score += featureScore;

    if (matchedFeatures.length) {
      matchedCriteria.push(
        `${matchedFeatures.length} preferred features`
      );
    }

    if (
      matchedFeatures.length !==
      preferences.features.length
    ) {
      missedCriteria.push(
        "Some preferred features"
      );
    }
  } else {
    score += 10;
  }

  /*
   * Verification
   * 5 points
   */
  if (
    !preferences.verifiedOnly ||
    listing.verified
  ) {
    score += 5;

    if (preferences.verifiedOnly) {
      matchedCriteria.push("Verified");
    }
  } else {
    missedCriteria.push("Verification");
  }

  return {
    listingId: listing.id,
    score: Math.round(score),
    matchedCriteria,
    missedCriteria,
  };
}

export function findMatches(
  listings: Listing[],
  preferences: MatchPreferences
): MatchResult[] {
  return listings
    .map((listing) =>
      calculateMatchScore(
        listing,
        preferences
      )
    )
    .filter((result) => result.score >= 50)
    .sort(
      (a, b) => b.score - a.score
    );
}