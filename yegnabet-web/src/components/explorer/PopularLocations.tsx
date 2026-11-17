
import { SectionHeader } from "../ui/SectionHeader";
import { PopularLocationCard } from "./PopularLocationCard";

import type {
  ListingLocation,
} from "../../types/customer/location";

import type {
  ListingFilters,
} from "../../types/customer/explorer";

import { buildFilterQuery } from "../../lib/common/utils";

import type {
  ListingMode,
} from "../../types/customer/listings";

import type {
  AuthUser,
} from "../../types/auth/authTypes";

interface PopularLocationsProps {
  filters: ListingFilters;
  setFilters: (filters: ListingFilters) => void;
  user: AuthUser | null;
  mode?: ListingMode;
  locations: ListingLocation[];
}

export function PopularLocations({
  filters,
  setFilters,
  user,
  mode,
  locations,
}: PopularLocationsProps) {

  const toggleLocation = (id: number) => {
    const current = filters.locationIds ?? [];

    const locationIds = current.includes(id)
      ? current.filter(x => x !== id)
      : [...current, id];

    setFilters({
      ...filters,
      locationIds,
    });
  };

  const query = buildFilterQuery(filters);
  const actionHref =
  `/locations${query ? `?${query}` : ""}` +
  (mode ? `${query ? "&" : "?"}mode=${mode}` : "");

  return (
    <section className="mt-6">
      <SectionHeader
        title="Popular Locations"
        listingMode={mode ?? "Buy"}
        actionLabel="View all"
        actionHref={actionHref}
        user={user}
      />

      <div className="
        mt-3 flex gap-3
        overflow-x-auto pb-1
        scrollbar-none
      ">
        {locations.slice(0, 7).map(location => (
          <PopularLocationCard
            key={location.id}
            location={location}
            selected={
              (filters.locationIds ?? []).includes(
                location.id
              )
            }
            onClick={() => toggleLocation(location.id)}
          />
        ))}
      </div>
    </section>
  );
}