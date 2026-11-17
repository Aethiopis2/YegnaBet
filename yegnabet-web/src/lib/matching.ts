import type { Listing } from "../types/customer/listings";
import type {
  MatchPreferences,
  MatchResult,
} from "../types/match";

function normalize(value: unknown): string {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function getNumericAttribute(listing: Listing, key: string): number | undefined {
  const normalizedKey = normalize(key);
  const value = listing.metadata?.find(attribute =>
    normalize(attribute.key) === normalizedKey || normalize(attribute.name) === normalizedKey
  )?.value;
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

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
    normalize(listing.category || listing.type) === normalize(preferences.propertyType)
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
    normalize(listing.location.city) === normalize(preferences.city)
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
    preferences.areas.some(area => {
      const wanted = normalize(area);
      return wanted === normalize(listing.location.area) ||
        wanted === normalize(`${listing.location.city}, ${listing.location.area}`);
    })
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
      Number(listing.price) >= preferences.minPrice) &&
    (!preferences.maxPrice ||
      Number(listing.price) <= preferences.maxPrice)
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
    (getNumericAttribute(listing, "bedrooms") ?? 0) >=
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
    (getNumericAttribute(listing, "bathrooms") ?? 0) >=
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
    const matchedFeatures =
      preferences.features.filter(
        feature => {
          const normalizedFeature = normalize(feature);
          const attribute = listing.metadata?.find(item =>
            normalize(item.key) === normalizedFeature || normalize(item.name) === normalizedFeature
          );
          const value = normalize(attribute?.value);
          return value === "true" || value === "1" || value === "yes" ||
            (listing.features ?? []).some(item => normalize(item) === normalizedFeature);
        }
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
