import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Images,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Listing } from "../../types/listings";

import { cn } from "../../lib/cn";

interface ListingGalleryProps {
  listing: Listing;
  saved: boolean;
  onSavedChange: (value: boolean) => void;
}

export function ListingGallery({
  listing,
  saved,
  onSavedChange,
}: ListingGalleryProps) {
  const navigate = useNavigate();

  const [current, setCurrent] =
    useState(0);

  const images = listing.images.length
    ? listing.images
    : ["/images/placeholder.jpg"];

  const previous = () => {
    setCurrent((index) =>
      index === 0
        ? images.length - 1
        : index - 1
    );
  };

  const next = () => {
    setCurrent((index) =>
      index === images.length - 1
        ? 0
        : index + 1
    );
  };

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-black
        sm:rounded-3xl
      "
    >
      <div
        className="
          relative
          aspect-[4/3]
          w-full
          sm:aspect-[16/9]
          lg:aspect-[2/1]
        "
      >
        <img
          src={images[current]}
          alt={`${listing.title} - image ${
            current + 1
          }`}
          className="
            size-full
            object-cover
            transition-opacity
            duration-300
          "
        />

        {/* Gradient */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-b
            from-black/45
            via-transparent
            to-black/45
          "
        />

        {/* Top navigation */}
        <div
          className="
            absolute
            left-0
            right-0
            top-0
            flex
            items-center
            justify-between
            p-4
            sm:p-5
          "
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              grid
              size-10
              place-items-center
              rounded-full
              bg-black/30
              text-white
              backdrop-blur-md
              transition-all
              hover:bg-black/50
              active:scale-90
            "
            aria-label="Go back"
          >
            <ArrowLeft className="size-5" />
          </button>

          <button
            type="button"
            onClick={() =>
              onSavedChange(!saved)
            }
            className="
              grid
              size-10
              place-items-center
              rounded-full
              bg-black/30
              text-white
              backdrop-blur-md
              transition-all
              hover:bg-black/50
              active:scale-90
            "
            aria-label={
              saved
                ? "Remove from saved"
                : "Save listing"
            }
          >
            <Heart
              className={cn(
                "size-5 transition-all",
                saved &&
                  "fill-red-500 stroke-red-500"
              )}
            />
          </button>
        </div>

        {/* Previous */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={previous}
            className="
              absolute
              left-3
              top-1/2
              grid
              size-9
              -translate-y-1/2
              place-items-center
              rounded-full
              bg-black/25
              text-white
              backdrop-blur
              transition-all
              hover:bg-black/50
              active:scale-90
              sm:left-5
            "
            aria-label="Previous image"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}

        {/* Next */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={next}
            className="
              absolute
              right-3
              top-1/2
              grid
              size-9
              -translate-y-1/2
              place-items-center
              rounded-full
              bg-black/25
              text-white
              backdrop-blur
              transition-all
              hover:bg-black/50
              active:scale-90
              sm:right-5
            "
            aria-label="Next image"
          >
            <ChevronRight className="size-5" />
          </button>
        )}

        {/* Counter */}
        <div
          className="
            absolute
            bottom-4
            right-4
            inline-flex
            items-center
            gap-1.5
            rounded-full
            bg-black/40
            px-3
            py-1.5
            text-[10px]
            font-medium
            text-white
            backdrop-blur-md
          "
        >
          <Images className="size-3.5" />

          <span>
            {current + 1} / {images.length}
          </span>
        </div>

        {/* Featured */}
        {listing.featured && (
          <div
            className="
              absolute
              bottom-4
              left-4
              rounded-full
              bg-yegna-700
              px-3
              py-1.5
              text-[10px]
              font-bold
              uppercase
              tracking-wide
              text-white
            "
          >
            Featured
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="
            hidden
            gap-2
            overflow-x-auto
            bg-black
            p-3
            sm:flex
          "
        >
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setCurrent(index)}
              className={cn(
                "size-16 shrink-0 overflow-hidden rounded-lg",
                "transition-all duration-200",
                index === current
                  ? "ring-2 ring-white"
                  : "opacity-50 hover:opacity-100"
              )}
            >
              <img
                src={image}
                alt=""
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}