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


export const buildFilterQuery = (filters: ListingFilters) => {
  const params = new URLSearchParams();

  filters.locationIds?.forEach(id =>
    params.append("locationIds", String(id))
  );

  if (filters.minPrice !== undefined)
    params.set("minPrice", String(filters.minPrice));

  if (filters.maxPrice !== undefined)
    params.set("maxPrice", String(filters.maxPrice));

  Object.entries(filters.attributes ?? {}).forEach(
    ([key, value]) =>
      params.set(`attributes[${key}]`, String(value))
  );

  return params.toString();
};


export function fromQueryString(query: string): ListingFilters {
  const params = new URLSearchParams(
    query.startsWith("?") ? query.slice(1) : query
  );

  const filters: ListingFilters = {};

  const search = params.get("search");
  if (search !== null && search.trim() !== "") {
    filters.search = search.trim();
  }

  // Multiple locations: ?locationIds=1&locationIds=4
  const locationIds = params
    .getAll("locationIds")
    .map(Number)
    .filter(id => Number.isInteger(id) && id > 0);

  if (locationIds.length > 0) {
    filters.locationIds = [...new Set(locationIds)];
  }

  // Numeric filters
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");

  if (minPrice !== null && minPrice.trim() !== "") {
    const value = Number(minPrice);
    if (Number.isFinite(value)) filters.minPrice = value;
  }

  if (maxPrice !== null && maxPrice.trim() !== "") {
    const value = Number(maxPrice);
    if (Number.isFinite(value)) filters.maxPrice = value;
  }

  // Category
  const category = params.get("category");
  if (category !== null && category.trim() !== "") {
    filters.category = category;
  }

  const status = params.get("status");
  if (status && ["All", "Draft", "Active", "Pending", "Closed", "Cancelled"].includes(status)) {
    filters.status = status as NonNullable<ListingFilters["status"]>;
  }

  // Boolean filters
  const booleanKeys = [
    "verified",
    "featured",
    "trending",
    "saved",
  ] as const;

  for (const key of booleanKeys) {
    const value = params.get(key);

    if (value === "true") filters[key] = true;
    else if (value === "false") filters[key] = false;
  }

  // Dynamic taxonomy attributes:
  // ?attributes[bedrooms]=3&attributes[furnished]=true
  const attributes: NonNullable<ListingFilters["attributes"]> = {};

  for (const [key, value] of params.entries()) {
    const match = key.match(/^attributes\[([^\]]+)\]$/);

    if (!match) continue;

    const attributeKey = match[1].trim();
    if (!attributeKey || value.trim() === "") continue;

    // Preserve boolean and numeric values where possible.
    if (value === "true") {
      attributes[attributeKey] = true;
    } else if (value === "false") {
      attributes[attributeKey] = false;
    } else if (Number.isFinite(Number(value))) {
      attributes[attributeKey] = Number(value);
    } else {
      attributes[attributeKey] = value;
    }
  }

  if (Object.keys(attributes).length > 0) {
    filters.attributes = attributes;
  }

  return filters;
}
