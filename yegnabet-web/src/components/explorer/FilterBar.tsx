import {
  BedDouble,
  DollarSign,
  MapPin,
  SlidersHorizontal,
} from "lucide-react";

import type { ListingFilters } from "../../types/explorer";

import { FilterChip } from "./FilterChip";

interface FilterBarProps {
  filters: ListingFilters;
  onFiltersChange: (
    filters: ListingFilters
  ) => void;
}

export function FilterBar({
  filters,
  onFiltersChange,
}: FilterBarProps) {
  const clearLocation = () => {
    const next = { ...filters };
    delete next.location;

    onFiltersChange(next);
  };

  return (
    <div
      className="
        mt-4
        flex
        gap-2
        overflow-x-auto
        pb-1
        scrollbar-none
      "
    >
      <FilterChip
        label="Location"
        icon={MapPin}
        value={filters.location}
        removable={Boolean(filters.location)}
        onRemove={clearLocation}
      />

      <FilterChip
        label="Price"
        icon={DollarSign}
        value={
          filters.minPrice || filters.maxPrice
            ? `${filters.minPrice ?? 0} - ${
                filters.maxPrice ?? "∞"
              }`
            : undefined
        }
      />

      <FilterChip
        label="Bedrooms"
        icon={BedDouble}
        value={
          filters.bedrooms
            ? `${filters.bedrooms}+ Beds`
            : undefined
        }
      />

      <FilterChip
        label="More"
        icon={SlidersHorizontal}
      />
    </div>
  );
}