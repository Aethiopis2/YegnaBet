
import {
  MapPin,
  X,
  ChevronDown,
  Check,
} from "lucide-react";

import { useState } from "react";

import type {
  ListingLocation,
} from "../../types/customer/location";

interface LocationFilterProps {
  locations: ListingLocation[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export function LocationFilter({
  locations,
  selectedIds,
  onChange,
}: LocationFilterProps) {
  const [open, setOpen] = useState(false);

  const selectedLocations = locations.filter(
    location => selectedIds.includes(location.id)
  );

  const toggleLocation = (id: number) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter(x => x !== id)
      : [...selectedIds, id];

    onChange(next);
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className="
          flex items-center gap-2
          rounded-full border
          border-gray-200 dark:border-white/10
          bg-white dark:bg-white/4
          px-3 py-2 text-sm font-medium
          text-gray-700 dark:text-gray-200
        "
      >
        <MapPin className="size-4" />

        Location

        {selectedIds.length > 0 && (
          <span className="
            rounded-full bg-yegna-700
            px-2 py-0.5 text-xs text-white
          ">
            {selectedIds.length}
          </span>
        )}

        <ChevronDown className="size-3" />
      </button>

      {open && (
        <div className="
          absolute left-0 top-full z-50
          mt-2 w-72 rounded-2xl
          border border-gray-200
          bg-white p-3 shadow-xl
          dark:border-white/10
          dark:bg-zinc-900
        ">
          <div className="
            mb-3 flex items-center
            justify-between
          ">
            <span className="text-sm font-semibold">
              Select locations
            </span>

            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs text-yegna-700"
            >
              Clear all
            </button>
          </div>

          <div className="max-h-64 space-y-1 overflow-y-auto">
            {locations.map(location => {
              const selected = selectedIds.includes(
                location.id
              );

              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={() =>
                    toggleLocation(location.id)
                  }
                  className={`
                    flex w-full items-center
                    justify-between rounded-xl
                    px-3 py-2 text-left text-sm
                    transition-colors
                    ${
                      selected
                        ? "bg-yegna-50 text-yegna-800 dark:bg-yegna-900/30 dark:text-yegna-300"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                    }
                  `}
                >
                  <span>
                    {location.area}, {location.city}
                  </span>

                  {selected && (
                    <Check className="size-4 text-yegna-700" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="
              mt-3 w-full rounded-xl
              bg-yegna-700 py-2
              text-sm font-semibold text-white
            "
          >
            Done
          </button>
        </div>
      )}

      {selectedLocations.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedLocations.map(location => (
            <span
              key={location.id}
              className="
                inline-flex items-center gap-1
                rounded-full bg-yegna-50
                px-2.5 py-1 text-xs
                text-yegna-800
                dark:bg-yegna-900/30
                dark:text-yegna-300
              "
            >
              {location.area}

              <button
                type="button"
                onClick={() =>
                  toggleLocation(location.id)
                }
                aria-label={`Remove ${location.area}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}