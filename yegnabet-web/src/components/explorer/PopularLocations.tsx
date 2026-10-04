import { useEffect, useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { PopularLocationCard } from "./PopularLocationCard";
import type { ListingLocation } from "../../types/common/location";
import Loading from "../ui/common/Loading";
import type { ListingFilters } from "../../types/customer/explorer";
import type { UserProfile } from "../../types/customer/profile";
import { getLocations } from "../../lib/customer/customerApi";
import ErrorBlock from "../ui/common/ErrorBlock";
import { toQueryString } from "../../lib/common/utils";
import type { ListingMode } from "../../types/customer/listings";

interface PopularLocationsProps {
  filters: ListingFilters;
  setFilters: any;
  currentUser: UserProfile | null;
  mode?: ListingMode;
}

export function PopularLocations({ filters, setFilters, currentUser, mode }: PopularLocationsProps) {
  const [listingLocations, setListingLocations] = useState<ListingLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLoactions = async () => {
      setLoading(true);
      try {
        const locs = await getLocations();
        setListingLocations(locs);
      } catch (err) {
        setError(String(err));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLoactions();
  }, []);

  if (loading) return <Loading />;

  if (error) return <ErrorBlock message={error} />;

  return (
    <section className="mt-6">
      <SectionHeader
        title="Popular Locations"
        actionLabel="View all"
        actionHref={`/locations${toQueryString(filters)}` + (mode && `&mode=${mode}`)}
        currentUser={currentUser}
      />

      <div className="mt-3 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        {listingLocations.slice(0,7).map((location) => (
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
