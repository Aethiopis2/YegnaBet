import {
  Bath,
  BedDouble,
  Car,
  Maximize,
  Layers3,
  CalendarDays,
} from "lucide-react";

import type { ListingMetadata } from "../types/listings";

interface ListingFactsProps {
  metadata: ListingMetadata;
}

export function ListingFacts({
  metadata,
}: ListingFactsProps) {
  const facts = [
    metadata.bedrooms !== undefined && {
      label: "Bedrooms",
      value: metadata.bedrooms,
      icon: BedDouble,
    },

    metadata.bathrooms !== undefined && {
      label: "Bathrooms",
      value: metadata.bathrooms,
      icon: Bath,
    },

    metadata.area !== undefined && {
      label: "Area",
      value: `${metadata.area} m²`,
      icon: Maximize,
    },

    metadata.parkingSpaces !==
      undefined && {
      label: "Parking",
      value: metadata.parkingSpaces,
      icon: Car,
    },

    metadata.floors !== undefined && {
      label: "Floors",
      value: metadata.floors,
      icon: Layers3,
    },

    metadata.yearBuilt !== undefined && {
      label: "Built",
      value: metadata.yearBuilt,
      icon: CalendarDays,
    },
  ].filter(Boolean) as {
    label: string;
    value: string | number;
    icon: typeof BedDouble;
  }[];

  return (
    <section className="px-4 pt-6 sm:px-0">
      <h2 className="text-sm font-bold text-gray-900 dark:text-white">
        Property Details
      </h2>

      <div
        className="
          mt-3
          grid
          grid-cols-2
          gap-2
          sm:grid-cols-3
        "
      >
        {facts.map((fact) => {
          const Icon = fact.icon;

          return (
            <div
              key={fact.label}
              className="
                rounded-2xl
                border
                border-black/[0.05]
                bg-white
                p-3.5
                dark:border-white/[0.06]
                dark:bg-white/[0.035]
              "
            >
              <Icon
                className="
                  size-5
                  text-yegna-700
                  dark:text-yegna-400
                "
              />

              <p
                className="
                  mt-2
                  text-sm
                  font-bold
                  text-gray-900
                  dark:text-white
                "
              >
                {fact.value}
              </p>

              <p className="mt-0.5 text-[10px] text-gray-400">
                {fact.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}