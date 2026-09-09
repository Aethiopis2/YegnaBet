import { useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  city: string;
  area: string;
  subArea: string;

  latitude: number | null;
  longitude: number | null;
  preciseLocation: boolean;

  onChange: (value: {
    city: string;
    area: string;
    subArea: string;
    latitude: number | null;
    longitude: number | null;
    preciseLocation: boolean;
  }) => void;
}

const DEFAULT_POSITION: [number, number] = [
  9.03,
  38.74,
];

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function ListingLocationPicker({
  city,
  area,
  subArea,
  latitude,
  longitude,
  preciseLocation,
  onChange,
}: Props) {
  const [mapOpen, setMapOpen] = useState(false);

  const [selectedPosition, setSelectedPosition] =
    useState<[number, number] | null>(
      latitude !== null && longitude !== null
        ? [latitude, longitude]
        : null
    );

  function updateLocation(
    changes: Partial<{
      city: string;
      area: string;
      subArea: string;
      latitude: number | null;
      longitude: number | null;
      preciseLocation: boolean;
    }>
  ) {
    console.log(changes);
    onChange({
      city,
      area,
      subArea,
      latitude,
      longitude,
      preciseLocation,
      ...changes,
    });
  }

  function openMap() {
    setSelectedPosition(
      latitude !== null && longitude !== null
        ? [latitude, longitude]
        : null
    );

    setMapOpen(true);
  }

  function confirmLocation() {
    if (!selectedPosition) {
      return;
    }

    updateLocation({
      latitude: selectedPosition[0],
      longitude: selectedPosition[1],
      preciseLocation: true,
    });

    setMapOpen(false);
  }

  return (
    <>
      <div className="space-y-7">

        {/* GENERAL LOCATION */}

        <div className="space-y-4">

          {/* CITY */}

          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-slate-800
                dark:text-white
              "
            >
              City
            </label>

            <input
              type="text"
              required
              value={city}
              onChange={(event) =>
                updateLocation({
                  city: event.target.value,
                })
              }
              placeholder="e.g. Addis Ababa"
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4 py-3
                text-sm
                text-slate-900
                outline-none

                focus:border-emerald-600
                focus:ring-2
                focus:ring-emerald-600/10

                dark:border-white/10
                dark:bg-slate-950
                dark:text-white

                dark:focus:border-orange-400
                dark:focus:ring-orange-400/10
              "
            />
          </div>

          {/* AREA */}

          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-slate-800
                dark:text-white
              "
            >
              Area
            </label>

            <input
              type="text"
              required
              value={area}
              onChange={(event) =>
                updateLocation({
                  area: event.target.value,
                })
              }
              placeholder="e.g. Bole"
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4 py-3
                text-sm
                text-slate-900
                outline-none

                focus:border-emerald-600
                focus:ring-2
                focus:ring-emerald-600/10

                dark:border-white/10
                dark:bg-slate-950
                dark:text-white

                dark:focus:border-orange-400
                dark:focus:ring-orange-400/10
              "
            />
          </div>

          {/* SUB AREA */}

          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-slate-800
                dark:text-white
              "
            >
              Sub Area
              <span className="ml-1 text-xs font-normal text-slate-400">
                (optional)
              </span>
            </label>

            <input
              type="text"
              value={subArea}
              onChange={(event) =>
                updateLocation({
                  subArea: event.target.value,
                })
              }
              placeholder="e.g. Atlas"
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4 py-3
                text-sm
                text-slate-900
                outline-none

                focus:border-emerald-600
                focus:ring-2
                focus:ring-emerald-600/10

                dark:border-white/10
                dark:bg-slate-950
                dark:text-white

                dark:focus:border-orange-400
                dark:focus:ring-orange-400/10
              "
            />
          </div>

        </div>

        {/* PRECISE LOCATION */}

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
            onClick={openMap}
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
              ? "Change exact location"
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

      {/* MAP POPUP */}

      {mapOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              w-full
              max-w-2xl
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-2xl

              dark:border-white/10
              dark:bg-slate-900
            "
          >
            <div className="border-b border-slate-100 px-5 py-4 dark:border-white/10">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Pin exact location
              </h3>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Click on the map to place the listing location.
              </p>
            </div>

            <div className="h-[380px]">
              <MapContainer
                center={
                  selectedPosition ??
                  DEFAULT_POSITION
                }
                zoom={
                  selectedPosition
                    ? 16
                    : 12
                }
                scrollWheelZoom
                className="h-full w-full"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClickHandler
                  onSelect={setSelectedPosition}
                />

                {selectedPosition && (
                  <Marker
                    position={selectedPosition}
                    icon={markerIcon}
                  />
                )}
              </MapContainer>
            </div>

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                border-t
                border-slate-100
                px-5 py-4

                dark:border-white/10
              "
            >
              <div className="text-xs text-slate-400">
                {selectedPosition
                  ? `${selectedPosition[0].toFixed(
                      6
                    )}, ${selectedPosition[1].toFixed(
                      6
                    )}`
                  : "Click the map to select a location"}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setMapOpen(false)
                  }
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    px-4 py-2
                    text-xs
                    font-semibold
                    text-slate-600
                    hover:bg-slate-50

                    dark:border-white/10
                    dark:text-slate-300
                    dark:hover:bg-white/5
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!selectedPosition}
                  onClick={confirmLocation}
                  className="
                    rounded-xl
                    bg-slate-900
                    px-4 py-2
                    text-xs
                    font-semibold
                    text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-40

                    dark:bg-orange-400
                    dark:text-slate-950
                    dark:hover:bg-orange-300
                  "
                >
                  Use this location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MapClickHandler({
  onSelect,
}: {
  onSelect: (
    position: [number, number]
  ) => void;
}) {
  useMapEvents({
    click(event) {
      onSelect([
        event.latlng.lat,
        event.latlng.lng,
      ]);
    },
  });

  return null;
}