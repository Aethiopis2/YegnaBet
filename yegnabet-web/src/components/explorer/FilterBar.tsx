
import {
  DollarSign,
  SlidersHorizontal,
} from "lucide-react";

import { useState } from "react";

import type {
  ListingFilters,
  TaxonomyFilterDefinition,
} from "../../types/customer/explorer";

import type {
  ListingLocation,
} from "../../types/customer/location";

import { FilterChip } from "./FilterChip";
import { PriceFilterDialog } from "./PriceFilterDialog";
import { BedroomFilterDialog } from "./BedroomFilterDialog";
import { LocationFilter } from "./LocationFilter";
import { AttributeFilters } from "./AttributeFilters";

interface FilterBarProps {
  filters: ListingFilters;
  onFiltersChange: (filters: ListingFilters) => void;

  attributeFilters?: TaxonomyFilterDefinition[];
  locations: ListingLocation[];
  taxonomyOptions?: { id: number; name: string; depth: number }[];
  selectedTaxonomyNodeId?: number;
  onTaxonomyNodeChange?: (nodeId: number | undefined) => void;

  useDefaultFilters?: boolean;
}

export function FilterBar({
  filters,
  onFiltersChange,
  attributeFilters = [],
  locations,
  taxonomyOptions = [],
  selectedTaxonomyNodeId,
  onTaxonomyNodeChange,
  useDefaultFilters = false,
}: FilterBarProps) {
  const [priceOpen, setPriceOpen] = useState(false);
  const [bedroomOpen, setBedroomOpen] = useState(false);

  const attributes = filters.attributes ?? {};

  const bedrooms =
    typeof attributes.bedrooms === "number"
      ? attributes.bedrooms
      : undefined;

  const showDefaultBedrooms =
    useDefaultFilters &&
    attributeFilters.length === 0;

  const clearPrice = () => {
    const next = { ...filters };

    delete next.minPrice;
    delete next.maxPrice;

    onFiltersChange(next);
  };

  const updateBedrooms = (
    value: number | undefined
  ) => {
    const next = { ...attributes };

    if (value === undefined) {
      delete next.bedrooms;
    } else {
      next.bedrooms = value;
    }

    onFiltersChange({
      ...filters,
      attributes: next,
    });
  };

  return (
    <>
      <div className="
        mt-4 flex gap-2
        overflow-x-auto pb-1
        scrollbar-none
      ">
        {onTaxonomyNodeChange && (
          <select
            aria-label="Category"
            value={selectedTaxonomyNodeId ?? ""}
            onChange={event => onTaxonomyNodeChange(
              event.target.value ? Number(event.target.value) : undefined
            )}
            className="shrink-0 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-200"
          >
            <option value="">All categories</option>
            {taxonomyOptions.map(option => (
              <option key={option.id} value={option.id}>
                {`${"— ".repeat(option.depth)}${option.name}`}
              </option>
            ))}
          </select>
        )}

        <LocationFilter
          locations={locations}
          selectedIds={filters.locationIds ?? []}
          onChange={locationIds =>
            onFiltersChange({
              ...filters,
              locationIds,
            })
          }
        />

        <FilterChip
          label="Price"
          icon={DollarSign}
          value={
            filters.minPrice !== undefined ||
            filters.maxPrice !== undefined
              ? `${filters.minPrice ?? 0} - ${
                  filters.maxPrice ?? "∞"
                }`
              : undefined
          }
          removable={
            filters.minPrice !== undefined ||
            filters.maxPrice !== undefined
          }
          onRemove={clearPrice}
          onClick={() => setPriceOpen(true)}
        />

        {showDefaultBedrooms && (
          <FilterChip
            label="Bedrooms"
            icon={SlidersHorizontal}
            value={
              bedrooms !== undefined
                ? `${bedrooms}+ Beds`
                : undefined
            }
            removable={bedrooms !== undefined}
            onRemove={() => updateBedrooms(undefined)}
            onClick={() => setBedroomOpen(true)}
          />
        )}

        <AttributeFilters
          definitions={attributeFilters}
          values={attributes}
          onChange={nextAttributes =>
            onFiltersChange({
              ...filters,
              attributes: nextAttributes,
            })
          }
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

      {showDefaultBedrooms && (
        <BedroomFilterDialog
          open={bedroomOpen}
          value={bedrooms}
          onClose={() => setBedroomOpen(false)}
          onApply={value => {
            updateBedrooms(value);
            setBedroomOpen(false);
          }}
        />
      )}
    </>
  );
}
