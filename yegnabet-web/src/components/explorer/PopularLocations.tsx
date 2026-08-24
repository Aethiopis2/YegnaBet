import { popularLocations } from "../../data/locations";

import { SectionHeader } from "../ui/SectionHeader";
import { PopularLocationCard } from "./PopularLocationCard";

export function PopularLocations() {
  return (
    <section className="mt-6">
      <SectionHeader
        title="Popular Locations"
        actionLabel="View all"
        actionHref="/locations"
      />

      <div
        className="
          mt-3
          flex gap-3
          overflow-x-auto
          pb-1
          scrollbar-none
        "
      >
        {popularLocations.map((location) => (
          <PopularLocationCard
            key={location.id}
            location={location}
          />
        ))}
      </div>
    </section>
  );
}