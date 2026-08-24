import {
  MapPin,
  Navigation,
} from "lucide-react";

import type { ListingLocation as Location } from "../types/listings";

interface ListingLocationProps {
  location: Location;
}

export function ListingLocation({
  location,
}: ListingLocationProps) {
  return (
    <section className="px-4 pt-7 sm:px-0">
      <h2 className="text-sm font-bold text-gray-900 dark:text-white">
        Location
      </h2>

      <div className="mt-3 overflow-hidden rounded-2xl">
        <div
          className="
            relative
            h-52
            overflow-hidden
            bg-gray-100
            dark:bg-white/[0.04]
          "
        >
          {/* Temporary map placeholder */}
          <div
            className="
              absolute
              inset-0
              opacity-40
              [background-image:linear-gradient(rgba(100,100,100,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(100,100,100,.12)_1px,transparent_1px)]
              [background-size:32px_32px]
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
            "
          >
            <div
              className="
                grid
                size-12
                place-items-center
                rounded-full
                bg-yegna-700
                text-white
                shadow-lg
                ring-8
                ring-yegna-700/15
              "
            >
              <MapPin className="size-6" />
            </div>
          </div>

          <div
            className="
              absolute
              bottom-3
              left-3
              right-3
              flex
              items-center
              justify-between
              rounded-xl
              bg-white/90
              px-3
              py-2.5
              backdrop-blur-md
              dark:bg-black/60
            "
          >
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                {location.area}
              </p>

              <p className="text-[10px] text-gray-400">
                {location.city}
              </p>
            </div>

            <button
              type="button"
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                bg-yegna-700
                px-2.5
                py-2
                text-[10px]
                font-semibold
                text-white
              "
            >
              <Navigation className="size-3" />
              View map
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}