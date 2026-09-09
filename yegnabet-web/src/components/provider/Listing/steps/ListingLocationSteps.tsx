import { ListingLocationPicker } from "../location/ListingLocationPicker";

interface Props {
  city: string;
  area: string;
  subArea: string;
  latitude: number | null;
  longitude: number | null;
  preciseLocation: boolean;
  onChange: (changes: {
    city: string;
    area: string;
    subArea: string;
    latitude: number | null;
    longitude: number | null;
    preciseLocation: boolean;
    }) => void;
}

export function ListingLocationStep({
  city,
  area,
  subArea,
  latitude,
  longitude,
  preciseLocation,
  onChange,
}: Props) {
return ( 
  <div className="space-y-7"> 
    <div> 
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        Where is it located?
      </h2>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Give customers a general area, then optionally help our employees
        pinpoint the exact location.
      </p>
    </div>

  <ListingLocationPicker
    city={city}
    area={area}
    subArea={subArea}
    latitude={latitude}
    longitude={longitude}
    preciseLocation={preciseLocation}
    onChange={onChange}
  />
</div>

);
}