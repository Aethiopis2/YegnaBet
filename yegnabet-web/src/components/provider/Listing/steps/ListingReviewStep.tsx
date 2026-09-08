import {
CheckCircle2,
Image as ImageIcon,
MapPin,
Tag,
} from "lucide-react";

import type {
ListingDraft,
} from "../../../../types/providerListings";

import type {
ProviderLocation,
ProviderTaxonomy,
} from "../../../../types/provider";

interface Props {
listing: ListingDraft;

taxonomy: ProviderTaxonomy[];
locations: ProviderLocation[];
}

function findTaxonomy(
nodes: ProviderTaxonomy[],
id: number | null
): ProviderTaxonomy | null {
if (id === null) return null;

for (const node of nodes) {
if (node.id === id) {
return node;
}


const result = findTaxonomy(
  node.children,
  id
);

if (result) {
  return result;
}


}

return null;
}

export function ListingReviewStep({
listing,
taxonomy,
locations,
}: Props) {
const taxonomyNode = findTaxonomy(
taxonomy,
listing.taxonomyId
);

const location = locations.find(
(item) =>
item.id === listing.locationId
);

return ( <div className="space-y-7"> <div> <h2 className="text-xl font-bold text-slate-900 dark:text-white">
Review your listing </h2>

    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Everything looks good? Submit it for review.
    </p>
  </div>

  <div
    className="
      overflow-hidden
      rounded-2xl
      border
      border-slate-200
      bg-white

      dark:border-white/10
      dark:bg-white/[0.025]
    "
  >
    {listing.photos[0] && (
      <div className="aspect-[16/7]">
        <img
          src={listing.photos.find(
            (photo) =>
              photo.isPrimary
          )?.url ??
            listing.photos[0].url}
          alt={listing.title}
          className="h-full w-full object-cover"
        />
      </div>
    )}

    <div className="p-6">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        {listing.title ||
          "Untitled listing"}
      </h3>

      {location && (
        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <MapPin size={14} />
          {location.area},{" "}
          {location.city}
        </div>
      )}

      {listing.description && (
        <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {listing.description}
        </p>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <ReviewItem
          icon={<Tag size={15} />}
          label="Category"
          value={
            taxonomyNode?.name ??
            "Not selected"
          }
        />

        <ReviewItem
          icon={<ImageIcon size={15} />}
          label="Photos"
          value={`${listing.photos.length}`}
        />

        <ReviewItem
          icon={
            <CheckCircle2 size={15} />
          }
          label="Videos"
          value={`${listing.videos.length}`}
        />
      </div>

      {listing.price && (
        <div className="mt-6 text-lg font-bold text-slate-900 dark:text-white">
          {Number(
            listing.price
          ).toLocaleString()}{" "}
          ETB
          {listing.priceUnit &&
            ` / ${listing.priceUnit}`}
        </div>
      )}
    </div>
  </div>
</div>

);
}

function ReviewItem({
icon,
label,
value,
}: {
icon: React.ReactNode;
label: string;
value: string;
}) {
return (
<div
className="
rounded-xl
bg-slate-50
p-3
dark:bg-white/5
  "
>
  <div className="flex items-center gap-1.5 text-slate-400">
    {icon}
    <span className="text-[10px] uppercase tracking-wide">
      {label}
    </span>
  </div>

  <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
    {value}
  </div>
</div>

);
}