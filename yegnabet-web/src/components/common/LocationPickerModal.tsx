import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

interface LocationPickerModalProps {
  latitude?: number | null;
  longitude?: number | null;
  onSelect: (latitude: number, longitude: number) => void;
  onClose: () => void;
}

interface MapClickHandlerProps {
  onSelect: (latitude: number, longitude: number) => void;
}

function MapClickHandler({ onSelect }: MapClickHandlerProps) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function RecenterMap({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom());
  }, [latitude, longitude, map]);

  return null;
}

export function LocationPickerModal({
  latitude,
  longitude,
  onSelect,
  onClose,
}: LocationPickerModalProps) {
  const [selectedLat, setSelectedLat] = useState<number | null>(
    latitude ?? null
  );

  const [selectedLng, setSelectedLng] = useState<number | null>(
    longitude ?? null
  );

  const defaultLat = latitude ?? 9.03;
  const defaultLng = longitude ?? 38.74;

  const handleSelect = (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support location services.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleSelect(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      () => {
        alert(
          "Unable to get your current location. Please select the location on the map."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const confirmLocation = () => {
    if (selectedLat === null || selectedLng === null) {
      alert("Please select a location on the map.");
      return;
    }

    onSelect(selectedLat, selectedLng);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Pin Exact Location
            </h2>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Click on the map where the property is located.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        {/* Map */}
        <div className="relative flex-1">
          <MapContainer
            center={[defaultLat, defaultLng]}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClickHandler onSelect={handleSelect} />

            {selectedLat !== null && selectedLng !== null && (
              <>
                <Marker position={[selectedLat, selectedLng]} />

                <RecenterMap
                  latitude={selectedLat}
                  longitude={selectedLng}
                />
              </>
            )}
          </MapContainer>

          {/* Current location */}
          <button
            type="button"
            onClick={useCurrentLocation}
            className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-white px-4 py-3 text-sm font-medium shadow-lg hover:bg-zinc-50 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          >
            📍 Use my current location
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div className="text-xs text-zinc-500">
            {selectedLat !== null && selectedLng !== null
              ? `${selectedLat.toFixed(6)}, ${selectedLng.toFixed(6)}`
              : "No location selected"}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={confirmLocation}
              className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Save Pin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}