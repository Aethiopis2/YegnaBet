import type { ListingFilters } from "../../types/customer/explorer";

export function toQueryString(filters: ListingFilters): string {
  const params = Object.entries(filters)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    );

  return params.length ? `?${params.join("&")}` : "";
}


export function fromQueryString(query: string): ListingFilters {
  const params = new URLSearchParams(
    query.startsWith("?") ? query.slice(1) : query
  );

  const filters: ListingFilters = {};

  const allowedKeys: (keyof ListingFilters)[] = [
    "location",
    "minPrice",
    "maxPrice",
    "bedrooms",
    "category",
    "verified",
    "featured",
    "trending",
    "saved",
  ];

  for (const key of allowedKeys) {
    const value = params.get(key);

    if (value === null) continue;

    switch (key) {
      case "minPrice":
      case "maxPrice":
      case "bedrooms": {
        const number = Number(value);

        if (!Number.isNaN(number)) {
          filters[key] = number;
        }

        break;
      }

      case "verified":
      case "featured":
      case "trending":
      case "saved":
        filters[key] = value === "true";
        break;

      case "location":
      case "category":
        filters[key] = value;
        break;
    }
  }

  return filters;
}