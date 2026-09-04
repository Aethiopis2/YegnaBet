import {
  BedDouble,
  DollarSign,
  MapPin,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

import type { ListingFilters } from "../../types/explorer";

import { FilterChip } from "./FilterChip";
import { PriceFilterDialog } from "./PriceFilterDialog";
import { BedroomFilterDialog } from "./BedroomFilterDialog";

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
  const [priceOpen, setPriceOpen] = useState(false);
  const [bedroomOpen, setBedroomOpen] = useState(false);

  const clearLocation = () => {
    const next = { ...filters };
    delete next.location;

    onFiltersChange(next);
  };

  const clearPrice = () => {
    const next = { ...filters };
    delete next.minPrice;
    delete next.maxPrice;

    onFiltersChange(next);
  };

  const clearBedrooms = () => {
    const next = { ...filters };
    delete next.bedrooms;

    onFiltersChange(next);
  };

  return (
    <>
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
          removable={Boolean(
            filters.minPrice || filters.maxPrice
          )}
          onRemove={clearPrice}
          onClick={() => setPriceOpen(true)}
        />

        <FilterChip
          label="Bedrooms"
          icon={BedDouble}
          value={
            filters.bedrooms
              ? `${filters.bedrooms}+ Beds`
              : undefined
          }
          removable={Boolean(filters.bedrooms)}
          onRemove={clearBedrooms}
          onClick={() => setBedroomOpen(true)}
        />

        <FilterChip
          label="More"
          icon={SlidersHorizontal}
        />
      </div>

      <PriceFilterDialog
        open={priceOpen}
        filters={filters}
        onClose={() => setPriceOpen(false)}
        onApply={(minPrice, maxPrice) => {
          const next = { ...filters };

          if (minPrice !== undefined) {
            next.minPrice = minPrice;
          } else {
            delete next.minPrice;
          }

          if (maxPrice !== undefined) {
            next.maxPrice = maxPrice;
          } else {
            delete next.maxPrice;
          }

          onFiltersChange(next);
          setPriceOpen(false);
        }}
      />

      <BedroomFilterDialog
        open={bedroomOpen}
        filters={filters}
        onClose={() => setBedroomOpen(false)}
        onApply={(bedrooms) => {
          const next = { ...filters };

          if (bedrooms !== undefined) {
            next.bedrooms = bedrooms;
          } else {
            delete next.bedrooms;
          }

          onFiltersChange(next);
          setBedroomOpen(false);
        }}
      />
    </>
  );
}