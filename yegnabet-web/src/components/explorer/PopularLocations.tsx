import { useEffect, useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { PopularLocationCard } from "./PopularLocationCard";
import type { ListingLocation } from "../../types/common/location";
import { Fetch } from "../../lib/common/network";
import Loading from "../ui/common/Loading";
import type { ListingFilters } from "../../types/explorer";

interface PopularLocationsProps {
  filters: ListingFilters;
  setDialog?: any;
  setFilters: any;
}

export function PopularLocations({ filters, setDialog, setFilters }: PopularLocationsProps) {
  const [locations, setLocations] = useState<ListingLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const url = `listings/get-listing-locations`;

  const onSuccess = (locs:ListingLocation[]) => {
    setLocations(locs);
  };

  useEffect(() => {
    Fetch(url, onSuccess, setLoading, setDialog);
  }, []);

  if (loading)
    return <Loading />

  return (
    <section className="mt-6">
      <SectionHeader
        title="Popular Locations"
        actionLabel="View all"
        actionHref="/locations"
      />

      <div className="mt-3 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        {locations.slice(0,7).map((location) => (
          <PopularLocationCard
            key={location.id}
            location={location}
            filters={filters}
            setFilters={setFilters}
          />
        ))}
      </div>
    </section>
  );
}