import {
  Bath,
  BedDouble,
  Car,
  Maximize,
  Layers3,
  CalendarDays,
  Home,
  Ruler,
  Building2,
  Map,
  DoorOpen,
  Sofa,
  Trees,
  ShieldCheck,
  Zap,
  Droplets,
  ParkingSquare,
  CircleDot,
} from "lucide-react";

import type { ListingMetadata } from "../../types/listings";

interface ListingFactsProps {
  metadata: ListingMetadata[];
}

/**
 * Resolves a suitable icon for a metadata definition.
 *
 * The metadata system remains completely generic.
 * We only use the key to make the UI a little smarter.
 */
function resolveMetadataIcon(key: string) {
  const normalizedKey = key
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  switch (normalizedKey) {
    // Property
    case "bedrooms":
    case "bedroom":
    case "beds":
      return BedDouble;

    case "bathrooms":
    case "bathroom":
    case "baths":
      return Bath;

    case "area":
    case "property_area":
    case "property_size":
    case "size":
    case "floor_area":
    case "building_area":
    case "land_size":
      return Maximize;

    case "parking":
    case "parking_spaces":
    case "parking_space":
    case "garage":
      return ParkingSquare;

    case "floors":
    case "floor_count":
    case "building_floors":
      return Layers3;

    case "floor":
      return Building2;

    case "year_built":
    case "built_year":
    case "construction_year":
      return CalendarDays;

    case "rooms":
    case "room_count":
      return DoorOpen;

    // Property type / structure
    case "property_type":
    case "building_type":
    case "house_type":
      return Home;

    case "furnished":
    case "furnishing":
      return Sofa;

    // Land
    case "land_use":
    case "zoning":
      return Map;

    case "topography":
      return Trees;

    // Utilities
    case "electricity":
    case "power":
      return Zap;

    case "water":
    case "water_supply":
      return Droplets;

    // Security / verification
    case "security":
    case "security_level":
      return ShieldCheck;

    default:
      return CircleDot;
  }
}

export function ListingFacts({
  metadata,
}: ListingFactsProps) {
  if (!metadata || metadata.length === 0) {
    return null;
  }

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
        {metadata.map((item, index) => {
          const Icon = resolveMetadataIcon(item.key);

          return (
            <div
              key={`${item.key}-${index}`}
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
                {item.value}
              </p>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  text-gray-400
                "
              >
                {item.name}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}