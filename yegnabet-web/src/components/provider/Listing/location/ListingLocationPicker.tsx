import type { ProviderLocation } from "../../../../types/provider";

import { ListingSelect } from "../fields/ListingSelect";

interface Props {
locations: ProviderLocation[];

value: number | null;

latitude: number | null;
longitude: number | null;

preciseLocation: boolean;

onChange: (value: {
locationId: number | null;
latitude: number | null;
longitude: number | null;
preciseLocation: boolean;
}) => void;
}

export function ListingLocationPicker({
locations,
value,
latitude,
longitude,
preciseLocation,
onChange,
}: Props) {
return ( <div className="space-y-7">
<ListingSelect
label="General location"
value={value ?? ""}
onChange={(event) =>
onChange({
locationId:
event.target.value
? Number(event.target.value)
: null,
latitude,
longitude,
preciseLocation,
})
}
> <option value="">
Select area </option>

    {locations.map((location) => (
      <option
        key={location.id}
        value={location.id}
      >
        {location.area}, {location.city}
      </option>
    ))}
  </ListingSelect>

  <div
    className="
      rounded-2xl
      border
      border-slate-200
      bg-slate-50
      p-5

      dark:border-white/10
      dark:bg-white/2.5
    "
  >
    <div>
      <h3 className="font-semibold text-slate-900 dark:text-white">
        Precise location
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
        You can optionally pin the exact location for YegnaBet employees.
        Customers will still see only the general area.
      </p>
    </div>

    <button
      type="button"
      onClick={() =>
        onChange({
          locationId: value,
          latitude,
          longitude,
          preciseLocation:
            !preciseLocation,
        })
      }
      className="
        mt-4
        rounded-xl
        border
        border-emerald-600
        px-4 py-2
        text-xs
        font-semibold
        text-emerald-700
        transition-colors
        hover:bg-emerald-50

        dark:border-orange-400
        dark:text-orange-400
        dark:hover:bg-orange-400/10
      "
    >
      {preciseLocation
        ? "Location selected"
        : "Pin exact location"}
    </button>

    {preciseLocation &&
      latitude !== null &&
      longitude !== null && (
        <div className="mt-3 text-xs text-slate-400">
          {latitude.toFixed(6)},{" "}
          {longitude.toFixed(6)}
        </div>
      )}
  </div>
</div>

);
}