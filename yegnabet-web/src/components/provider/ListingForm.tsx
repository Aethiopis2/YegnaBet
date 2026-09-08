import {
  ImagePlus,
  MapPin,
  Play,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { API } from "../../types/api";
import { LocationPickerModal } from "../common/LocationPickerModal";

interface ListingFormProps {
  onClose: () => void;
  onSaved?: () => void;
}

interface Location {
  id: number;
  name: string;
}

interface Taxonomy {
  id: number;
  name: string;
}

type ListingMethod =
  | "Buy"
  | "Rent"
  | "Contract"
  | "Service";

interface ImagePreview {
  file: File;
  preview: string;
  isPrimary: boolean;
}

export function ListingForm({
  onClose,
  onSaved,
}: ListingFormProps) {
  // ===========================================================================
  // BASIC INFORMATION
  // ===========================================================================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [method, setMethod] =
    useState<ListingMethod>("Rent");

  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("");

  // ===========================================================================
  // LOCATION
  // ===========================================================================

  const [locations, setLocations] = useState<Location[]>([]);
  const [locationId, setLocationId] = useState("");

  const [latitude, setLatitude] =
    useState<number | null>(null);

  const [longitude, setLongitude] =
    useState<number | null>(null);

  const [showLocationPicker, setShowLocationPicker] =
    useState(false);

  // ===========================================================================
  // CATEGORY
  // ===========================================================================

  const [taxonomies, setTaxonomies] =
    useState<Taxonomy[]>([]);

  const [taxonomyId, setTaxonomyId] = useState("");

  // ===========================================================================
  // MEDIA
  // ===========================================================================

  const [images, setImages] = useState<ImagePreview[]>(
    []
  );

  const [videoUrls, setVideoUrls] =
    useState<string[]>([]);

  const [videoInput, setVideoInput] = useState("");

  // ===========================================================================
  // UI STATE
  // ===========================================================================

  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] =
    useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  // ===========================================================================
  // LOAD LOCATIONS / TAXONOMY
  // ===========================================================================

  useEffect(() => {
    let mounted = true;

    const loadOptions = async () => {
      try {
        setLoadingOptions(true);

        const [
          locationsResponse,
          taxonomyResponse,
        ] = await Promise.all([
          API.get("/locations"),
          API.get("/taxonomy/listing"),
        ]);

        if (!mounted) return;

        setLocations(
          locationsResponse.data ?? []
        );

        setTaxonomies(
          taxonomyResponse.data ?? []
        );
      } catch (err) {
        console.error(
          "Failed to load listing options:",
          err
        );

        if (mounted) {
          setError(
            "Unable to load locations and categories."
          );
        }
      } finally {
        if (mounted) {
          setLoadingOptions(false);
        }
      }
    };

    loadOptions();

    return () => {
      mounted = false;
    };
  }, []);

  // ===========================================================================
  // IMAGE HANDLING
  // ===========================================================================

  const handleImagesSelected = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      event.target.files ?? []
    );

    if (!files.length) return;

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        return false;
      }

      // 10 MB maximum per image.
      if (file.size > 10 * 1024 * 1024) {
        return false;
      }

      return true;
    });

    const newImages: ImagePreview[] =
      validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isPrimary: false,
      }));

    setImages((current) => {
      const combined = [
        ...current,
        ...newImages,
      ];

      // Automatically make the first image primary.
      if (
        combined.length > 0 &&
        !combined.some(
          (image) => image.isPrimary
        )
      ) {
        combined[0].isPrimary = true;
      }

      return combined;
    });

    // Allow selecting the same file again.
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((current) => {
      const image = current[index];

      if (image) {
        URL.revokeObjectURL(
          image.preview
        );
      }

      const updated = current.filter(
        (_, i) => i !== index
      );

      // Ensure there is always a primary image
      // when images remain.
      if (
        updated.length > 0 &&
        !updated.some(
          (item) => item.isPrimary
        )
      ) {
        updated[0].isPrimary = true;
      }

      return updated;
    });
  };

  const setPrimaryImage = (index: number) => {
    setImages((current) =>
      current.map((image, i) => ({
        ...image,
        isPrimary: i === index,
      }))
    );
  };

  // ===========================================================================
  // VIDEO HANDLING
  // ===========================================================================

  const isValidVideoUrl = (url: string) => {
    try {
      const parsed = new URL(url);

      return (
        parsed.protocol === "http:" ||
        parsed.protocol === "https:"
      );
    } catch {
      return false;
    }
  };

  const addVideo = () => {
    const url = videoInput.trim();

    if (!url) return;

    if (!isValidVideoUrl(url)) {
      setError(
        "Please enter a valid video URL."
      );

      return;
    }

    if (videoUrls.includes(url)) {
      setError(
        "This video has already been added."
      );

      return;
    }

    setVideoUrls((current) => [
      ...current,
      url,
    ]);

    setVideoInput("");
    setError(null);
  };

  const removeVideo = (index: number) => {
    setVideoUrls((current) =>
      current.filter(
        (_, i) => i !== index
      )
    );
  };

  // ===========================================================================
  // VALIDATION
  // ===========================================================================

  const validationError = useMemo(() => {
    if (!title.trim()) {
      return "Please enter a listing title.";
    }

    if (!locationId) {
      return "Please select a general location.";
    }

    if (!taxonomyId) {
      return "Please select a category.";
    }

    if (
      price &&
      Number.isNaN(Number(price))
    ) {
      return "Please enter a valid price.";
    }

    if (
      (latitude === null &&
        longitude !== null) ||
      (latitude !== null &&
        longitude === null)
    ) {
      return "The precise location pin is incomplete.";
    }

    return null;
  }, [
    title,
    locationId,
    taxonomyId,
    price,
    latitude,
    longitude,
  ]);

  // ===========================================================================
  // SAVE
  // ===========================================================================

  const saveListing = async (
    status: "Draft" | "Pending"
  ) => {
    setError(null);

    if (
      status === "Pending" &&
      validationError
    ) {
      setError(validationError);
      return;
    }

    if (!title.trim()) {
      setError(
        "Please enter a listing title."
      );

      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "Title",
        title.trim()
      );

      if (description.trim()) {
        formData.append(
          "Description",
          description.trim()
        );
      }

      formData.append(
        "Method",
        method
      );

      formData.append(
        "ListingStatus",
        status
      );

      formData.append(
        "LocationId",
        locationId
      );

      formData.append(
        "TaxonomyId",
        taxonomyId
      );

      if (price.trim()) {
        formData.append(
          "Price",
          price.trim()
        );
      }

      if (priceUnit.trim()) {
        formData.append(
          "PriceUnit",
          priceUnit.trim()
        );
      }

      // Exact location is optional.
      if (
        latitude !== null &&
        longitude !== null
      ) {
        formData.append(
          "Latitude",
          String(latitude)
        );

        formData.append(
          "Longitude",
          String(longitude)
        );
      }

      // Multiple listing images.
      images.forEach((image) => {
        formData.append(
          "Images",
          image.file
        );
      });

      // Multiple video URLs.
      videoUrls.forEach((url) => {
        formData.append(
          "VideoUrls",
          url
        );
      });

      await API.post(
        "/provider/listings",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      onSaved?.();
      onClose();
    } catch (err: any) {
      console.error(
        "Failed to save listing:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        "Unable to save the listing. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ===========================================================================
  // CLEANUP
  // ===========================================================================

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(
          image.preview
        );
      });
    };
  }, []);

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
      <div className="min-h-screen">

        {/* ================================================================== */}
        {/* HEADER                                                             */}
        {/* ================================================================== */}

        <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">

            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                Add Listing
              </h1>

              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                Add a property or service to YegnaBet
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl p-2.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              <X size={22} />
            </button>

          </div>
        </header>

        {/* ================================================================== */}
        {/* MAIN                                                               */}
        {/* ================================================================== */}

        <main className="mx-auto max-w-5xl px-4 py-6 pb-32 sm:px-6">

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">

              <div className="flex-1">
                {error}
              </div>

              <button
                type="button"
                onClick={() =>
                  setError(null)
                }
              >
                <X size={16} />
              </button>

            </div>
          )}

          {/* Loading */}
          {loadingOptions && (
            <div className="mb-6 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              Loading listing options...
            </div>
          )}

          {/* ================================================================ */}
          {/* BASIC INFORMATION                                                */}
          {/* ================================================================ */}

          <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">

            <div className="mb-5">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                Basic information
              </h2>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Give customers a clear idea of what you're offering.
              </p>
            </div>

            <div className="space-y-5">

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Listing title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Modern 2 Bedroom Apartment in Bole"
                  maxLength={150}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-400/20"
                />

                <div className="mt-1 text-right text-xs text-zinc-400">
                  {title.length}/150
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Describe the property, service, condition, features, availability, etc."
                  rows={5}
                  maxLength={2000}
                  className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-400/20"
                />

                <div className="mt-1 text-right text-xs text-zinc-400">
                  {description.length}/2000
                </div>
              </div>

              {/* Method */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Listing type
                </label>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(
                    [
                      "Rent",
                      "Buy",
                      "Contract",
                      "Service",
                    ] as ListingMethod[]
                  ).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setMethod(item)
                      }
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                        method === item
                          ? "border-emerald-600 bg-emerald-600 text-white dark:border-orange-400 dark:bg-orange-400 dark:text-slate-950"
                          : "border-zinc-200 bg-white text-zinc-700 hover:border-emerald-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-orange-400/50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* ================================================================ */}
          {/* CATEGORY + LOCATION                                               */}
          {/* ================================================================ */}

          <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">

            <div className="mb-5">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                Category & location
              </h2>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Tell us what you're listing and where it is generally located.
              </p>
            </div>

            <div className="space-y-5">

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Category
                </label>

                <select
                  value={taxonomyId}
                  onChange={(e) =>
                    setTaxonomyId(
                      e.target.value
                    )
                  }
                  disabled={loadingOptions}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-400/20"
                >
                  <option value="">
                    Select category
                  </option>

                  {taxonomies.map(
                    (taxonomy) => (
                      <option
                        key={taxonomy.id}
                        value={taxonomy.id}
                      >
                        {taxonomy.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* General location */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  General location
                </label>

                <select
                  value={locationId}
                  onChange={(e) =>
                    setLocationId(
                      e.target.value
                    )
                  }
                  disabled={loadingOptions}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-400/20"
                >
                  <option value="">
                    Select general area
                  </option>

                  {locations.map(
                    (location) => (
                      <option
                        key={location.id}
                        value={location.id}
                      >
                        {location.name}
                      </option>
                    )
                  )}
                </select>

                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  Customers will see this general area rather than your exact address.
                </p>
              </div>

              {/* Precise location */}
              <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div className="flex gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-orange-400/10 dark:text-orange-400">
                      <MapPin size={20} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                        Precise property location
                      </h3>

                      <p className="mt-1 max-w-xl text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                        Optional. Pin the exact property location so YegnaBet employees can locate it precisely. Customers will only see the general area.
                      </p>
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowLocationPicker(
                        true
                      )
                    }
                    className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:bg-orange-400 dark:text-slate-950 dark:hover:bg-orange-300"
                  >
                    {latitude !== null &&
                    longitude !== null
                      ? "Change Pin"
                      : "Pin on Map"}
                  </button>

                </div>

                {latitude !== null &&
                  longitude !== null && (
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/60">

                      <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                        <MapPin
                          size={14}
                          className="text-emerald-600 dark:text-orange-400"
                        />

                        Exact location pinned
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setLatitude(null);
                          setLongitude(null);
                        }}
                        className="text-xs font-medium text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>

                    </div>
                  )}

              </div>

            </div>
          </section>

          {/* ================================================================ */}
          {/* PRICE                                                             */}
          {/* ================================================================ */}

          <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">

            <div className="mb-5">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                Pricing
              </h2>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Set the price and how it should be understood.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Price
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value
                    )
                  }
                  placeholder="e.g. 25000"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-400/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Price unit
                </label>

                <input
                  type="text"
                  value={priceUnit}
                  onChange={(e) =>
                    setPriceUnit(
                      e.target.value
                    )
                  }
                  placeholder="e.g. per month, total, per service"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-400/20"
                />
              </div>

            </div>
          </section>

          {/* ================================================================ */}
          {/* PHOTOS                                                            */}
          {/* ================================================================ */}

          <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">

            <div className="mb-5 flex items-start justify-between gap-4">

              <div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                  Photos
                </h2>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Add clear photos of the property or service.
                </p>
              </div>

              <span className="shrink-0 text-xs text-zinc-400">
                {images.length} photo
                {images.length === 1
                  ? ""
                  : "s"}
              </span>

            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

              {images.map(
                (image, index) => (
                  <div
                    key={`${image.file.name}-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700"
                  >
                    <img
                      src={image.preview}
                      alt={`Listing ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/30" />

                    {/* Primary */}
                    <button
                      type="button"
                      onClick={() =>
                        setPrimaryImage(
                          index
                        )
                      }
                      className={`absolute left-2 top-2 rounded-lg px-2 py-1 text-[10px] font-semibold ${
                        image.isPrimary
                          ? "bg-emerald-600 text-white dark:bg-orange-400 dark:text-slate-950"
                          : "bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                      }`}
                    >
                      {image.isPrimary
                        ? "Primary"
                        : "Make primary"}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() =>
                        removeImage(
                          index
                        )
                      }
                      className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-white opacity-0 transition hover:bg-red-500 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              )}

              {/* Add photo */}
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 text-zinc-400 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 dark:border-zinc-700 dark:hover:border-orange-400/40 dark:hover:bg-orange-400/5 dark:hover:text-orange-400">

                <ImagePlus size={25} />

                <span className="mt-2 text-xs font-medium">
                  Add photos
                </span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={
                    handleImagesSelected
                  }
                />

              </label>

            </div>

            <p className="mt-3 text-xs text-zinc-400">
              JPG, PNG or WebP. Maximum 10 MB per image.
            </p>
          </section>

          {/* ================================================================ */}
          {/* VIDEOS                                                            */}
          {/* ================================================================ */}

          <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">

            <div className="mb-5 flex gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-orange-400/10 dark:text-orange-400">
                <Video size={20} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                  Videos
                </h2>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Add links to property videos. Customers can watch them from the listing.
                </p>
              </div>

            </div>

            {/* Add video */}
            <div className="flex flex-col gap-2 sm:flex-row">

              <input
                type="url"
                value={videoInput}
                onChange={(e) =>
                  setVideoInput(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter"
                  ) {
                    e.preventDefault();
                    addVideo();
                  }
                }}
                placeholder="https://youtube.com/... or https://..."
                className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-400/20"
              />

              <button
                type="button"
                onClick={addVideo}
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-emerald-50 hover:text-emerald-700 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-orange-400/5 dark:hover:text-orange-400"
              >
                <Play size={16} />
                Add video
              </button>

            </div>

            {/* Videos */}
            {videoUrls.length > 0 && (
              <div className="mt-4 space-y-2">

                {videoUrls.map(
                  (url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-zinc-200 px-3 py-3 dark:border-zinc-800"
                    >

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-orange-400/10 dark:text-orange-400">
                        <Play size={15} />
                      </div>

                      <span className="min-w-0 flex-1 truncate text-sm text-zinc-600 dark:text-zinc-300">
                        {url}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeVideo(
                            index
                          )
                        }
                        className="shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                      >
                        <Trash2
                          size={16}
                        />
                      </button>

                    </div>
                  )
                )}

              </div>
            )}

          </section>

          {/* ================================================================ */}
          {/* INFORMATION                                                       */}
          {/* ================================================================ */}

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 dark:border-orange-400/20 dark:bg-orange-400/5">

            <div className="flex gap-3">

              <MapPin
                size={18}
                className="mt-0.5 shrink-0 text-emerald-600 dark:text-orange-400"
              />

              <div>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  About precise location
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                  Your exact map pin is private. It is intended to help YegnaBet employees locate the property during verification and negotiations. Customers will only receive the general location.
                </p>
              </div>

            </div>

          </div>

        </main>

        {/* ================================================================== */}
        {/* BOTTOM ACTIONS                                                     */}
        {/* ================================================================== */}

        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">

          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3 sm:flex-row sm:justify-end sm:px-6">

            <button
              type="button"
              onClick={() =>
                saveListing("Draft")
              }
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-orange-400/5 dark:hover:text-orange-400"
            >
              <Upload size={16} />
              Save Draft
            </button>

            <button
              type="button"
              onClick={() =>
                saveListing("Pending")
              }
              disabled={loading}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-orange-400 dark:text-slate-950 dark:hover:bg-orange-300"
            >
              {loading
                ? "Saving..."
                : "Submit Listing"}
            </button>

          </div>
        </div>

      </div>

      {/* ==================================================================== */}
      {/* LOCATION PICKER                                                      */}
      {/* ==================================================================== */}

      {showLocationPicker && (
        <LocationPickerModal
          latitude={latitude}
          longitude={longitude}
          onSelect={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
          onClose={() =>
            setShowLocationPicker(false)
          }
        />
      )}

    </div>
  );
}