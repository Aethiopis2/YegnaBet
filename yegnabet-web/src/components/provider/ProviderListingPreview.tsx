import {
  Edit3,
  Eye,
  MoreVertical,
  MessageCircle,
  Pause,
  Play,
} from "lucide-react";

import type {
  ProviderListing,
} from "../../pages/provider/providerData";

interface ProviderListingPreviewProps {
  listing: ProviderListing;
  onEdit?: (listing: ProviderListing) => void;
  onOpen?: (listing: ProviderListing) => void;
}

export function ProviderListingPreview({
  listing,
  onEdit,
  onOpen,
}: ProviderListingPreviewProps) {
  return (
    <article
      className="
        overflow-hidden
        rounded-2xl
        border border-slate-200/80
        bg-white
        shadow-sm
        transition-all duration-300
        hover:-translate-y-0.5
        hover:shadow-lg

        dark:border-white/10
        dark:bg-white/[0.045]
      "
    >
      <div
        className="relative aspect-[16/10] cursor-pointer overflow-hidden"
        onClick={() => onOpen?.(listing)}
      >
        <img
          src={listing.image}
          alt={listing.title}
          className="
            h-full w-full
            object-cover
            transition-transform duration-500
            hover:scale-[1.03]
          "
        />

        <div className="absolute left-3 top-3">
          <StatusBadge status={listing.status} />
        </div>

        <button
          type="button"
          aria-label="More listing actions"
          onClick={(event) => event.stopPropagation()}
          className="
            absolute right-3 top-3
            flex h-9 w-9
            items-center justify-center
            rounded-full
            bg-black/40
            text-white
            backdrop-blur-md
            transition-colors
            hover:bg-black/60
          "
        >
          <MoreVertical size={17} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900 dark:text-white">
              {listing.title}
            </h3>

            <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
              {listing.location}
            </p>
          </div>

          <div className="shrink-0 text-sm font-bold text-slate-900 dark:text-white">
            {listing.price}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {listing.views}
          </span>

          <span className="flex items-center gap-1">
            <MessageCircle size={14} />
            {listing.enquiries}
          </span>

          <span className="ml-auto">
            {listing.updated}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(listing)}
            className="
              flex flex-1
              items-center justify-center gap-2
              rounded-xl
              bg-slate-900
              px-3 py-2
              text-xs font-semibold
              text-white
              transition-colors
              hover:bg-slate-800

              dark:bg-orange-400
              dark:text-slate-950
              dark:hover:bg-orange-300
            "
          >
            <Edit3 size={14} />
            Edit
          </button>

          <button
            type="button"
            className="
              flex flex-1
              items-center justify-center gap-2
              rounded-xl
              border border-slate-200
              px-3 py-2
              text-xs font-semibold
              text-slate-600
              hover:bg-slate-50

              dark:border-white/10
              dark:text-slate-300
              dark:hover:bg-white/5
            "
          >
            {listing.status === "active" ? (
              <>
                <Pause size={14} />
                Pause
              </>
            ) : (
              <>
                <Play size={14} />
                Publish
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

function StatusBadge({
  status,
}: {
  status: ProviderListing["status"];
}) {
  const config = {
    active: {
      label: "Active",
      className:
        "bg-emerald-500/90 text-white",
    },

    draft: {
      label: "Draft",
      className:
        "bg-slate-900/75 text-white",
    },

    pending: {
      label: "Pending",
      className:
        "bg-amber-500/90 text-white",
    },

    paused: {
      label: "Paused",
      className:
        "bg-slate-500/90 text-white",
    },
  }[status];

  return (
    <span
      className={`
        rounded-full px-2.5 py-1
        text-[10px] font-bold uppercase
        tracking-wide backdrop-blur-md
        ${config.className}
      `}
    >
      {config.label}
    </span>
  );
}