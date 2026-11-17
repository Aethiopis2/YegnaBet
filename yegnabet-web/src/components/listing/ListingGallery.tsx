import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Images,
  Play,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import type { Listing } from "../../types/customer/listings";

import { cn } from "../../lib/cn";

interface ListingGalleryProps {
  listing: Listing;
  saved: boolean;
  onSavedChange: (value: boolean) => void;
  showSave?: boolean;
}

export function ListingGallery({
  listing,
  saved,
  onSavedChange,
  showSave = true,
}: ListingGalleryProps) {
  const navigate = useNavigate();

  const [current, setCurrent] =
    useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const isVideoUrl = (url: string) =>
    /(?:youtube\.com|youtu\.be|vimeo\.com)/i.test(url) ||
    /\.(?:mp4|webm|ogg|mov)(?:$|[?#])/i.test(url);

  const media = listing.media ?? [];
  const videoUrls = [...new Set([
    ...media.filter(item => item.kind.toLowerCase() === "video" || isVideoUrl(item.url)).map(item => item.url),
    ...listing.images.filter(isVideoUrl),
  ])];
  const photoUrls = [...new Set([
    ...media.filter(item => item.kind.toLowerCase() !== "video" && !isVideoUrl(item.url)).map(item => item.url),
    ...listing.images.filter(image => !isVideoUrl(image)),
  ])];
  const hasPhotos = photoUrls.length > 0;
  const images = hasPhotos ? photoUrls : ["/images/placeholder.jpg"];

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft" && images.length > 1)
        setCurrent(index => index === 0 ? images.length - 1 : index - 1);
      if (event.key === "ArrowRight" && images.length > 1)
        setCurrent(index => index === images.length - 1 ? 0 : index + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, images.length]);

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
        <button
          type="button"
          onClick={() => hasPhotos && setLightboxOpen(true)}
          disabled={!hasPhotos}
          aria-label="View listing photo larger"
          className="size-full cursor-zoom-in disabled:cursor-default"
        >
          <img
            src={images[current]}
            alt={`${listing.title} - image ${current + 1}`}
            className="size-full object-cover transition-opacity duration-300"
          />
        </button>

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

          {showSave && <button
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
          </button>}
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
      {(photoUrls.length > 1 || videoUrls.length > 0) && (
        <div
          className="
            flex
            gap-2
            overflow-x-auto
            bg-black
            p-3
          "
        >
          {photoUrls.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => {
                setCurrent(index);
                setActiveVideo(null);
                setLightboxOpen(true);
              }}
              aria-label={`Open listing photo ${index + 1}`}
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
          {videoUrls.map((videoUrl, index) => (
            <button
              key={`video-${videoUrl}`}
              type="button"
              onClick={() => {
                setActiveVideo(videoUrl);
                setLightboxOpen(false);
              }}
              aria-label={`Play listing video ${index + 1}`}
              className={cn(
                "relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-800 text-white transition-all",
                activeVideo === videoUrl ? "ring-2 ring-white" : "opacity-70 hover:opacity-100"
              )}
            >
              <Play className="size-6 fill-current" />
              <span className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-[8px] font-bold uppercase">Video</span>
            </button>
          ))}
        </div>
      )}

      {activeVideo && (
        <div className="border-t border-white/10 bg-black p-3 sm:p-4">
          <ListingVideoPlayer url={activeVideo} title={`${listing.title} video`} />
        </div>
      )}

      {lightboxOpen && hasPhotos && createPortal(
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Listing photo viewer"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setLightboxOpen(false);
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
          {images.length > 1 && (
            <button type="button" onClick={previous} aria-label="Previous photo" className="absolute left-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6">
              <ChevronLeft className="size-6" />
            </button>
          )}
          <img
            src={images[current]}
            alt={`${listing.title} - image ${current + 1}`}
            className="max-h-[88vh] max-w-[92vw] rounded-lg object-contain"
          />
          {images.length > 1 && (
            <button type="button" onClick={next} aria-label="Next photo" className="absolute right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6">
              <ChevronRight className="size-6" />
            </button>
          )}
          <span className="absolute bottom-5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white">
            {current + 1} / {images.length}
          </span>
        </div>,
        document.body
      )}
    </section>
  );
}

function ListingVideoPlayer({ url, title }: { url: string; title: string }) {
  const videoSource = getVideoSource(url);
  if (!videoSource) return null;

  if (videoSource.kind === "file") {
    return <video className="mx-auto aspect-video w-full max-w-4xl rounded-xl bg-black" controls playsInline preload="metadata" src={videoSource.url}>{title}</video>;
  }

  return (
    <iframe
      src={videoSource.url}
      title={title}
      className="mx-auto aspect-video w-full max-w-4xl rounded-xl bg-black"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}

function getVideoSource(rawUrl: string): { kind: "file" | "embed"; url: string } | null {
  try {
    const normalizedUrl = /^(?:www\.)?(?:youtube\.com|youtu\.be|vimeo\.com)(?:\/|$)/i.test(rawUrl)
      ? `https://${rawUrl}`
      : rawUrl;
    const url = new URL(normalizedUrl, window.location.origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (host === "youtu.be" || host === "youtube.com" || host.endsWith(".youtube.com") || host === "youtube-nocookie.com") {
      const pathParts = url.pathname.split("/").filter(Boolean);
      const videoId = host === "youtu.be"
        ? pathParts[0]
        : url.searchParams.get("v") ?? (pathParts[0] === "watch" ? null : pathParts[1]);
      return videoId
        ? { kind: "embed", url: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` }
        : null;
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const videoId = url.pathname.split("/").filter(Boolean).at(-1);
      return videoId && /^\d+$/.test(videoId)
        ? { kind: "embed", url: `https://player.vimeo.com/video/${videoId}` }
        : null;
    }

    if (/\.(?:mp4|webm|ogg|mov)(?:$|[?#])/i.test(url.href))
      return { kind: "file", url: url.href };

    return { kind: "embed", url: url.href };
  } catch {
    return null;
  }
}
