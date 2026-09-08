import { Star, Trash2 } from "lucide-react";

import type {
ListingPhotoDraft,
} from "../../../../types/providerListings";

interface Props {
photos: ListingPhotoDraft[];

onChange: (
photos: ListingPhotoDraft[]
) => void;
}

export function ListingPhotoGrid({
photos,
onChange,
}: Props) {
if (photos.length === 0) {
return null;
}

const remove = (index: number) => {
const next = photos.filter(
(_, i) => i !== index
);

if (
  photos[index]?.isPrimary &&
  next.length > 0
) {
  next[0].isPrimary = true;
}

onChange(next);

};

const makePrimary = (
index: number
) => {
onChange(
photos.map((photo, i) => ({
...photo,
isPrimary: i === index,
}))
);
};

return ( <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
{photos.map((photo, index) => (
<div
key={`${photo.url}-${index}`}
className="
group
relative
aspect-4/3
overflow-hidden
rounded-xl
border
border-slate-200
dark:border-white/10
      "
    >
      <img
        src={photo.url}
        alt={`Listing ${index + 1}`}
        className="h-full w-full object-cover"
      />

      {photo.isPrimary && (
        <span
          className="
            absolute
            left-2 top-2
            inline-flex
            items-center
            gap-1
            rounded-full
            bg-black/60
            px-2 py-1
            text-[9px]
            font-bold
            uppercase
            text-white
            backdrop-blur
          "
        >
          <Star size={10} />
          Cover
        </span>
      )}

      <div
        className="
          absolute
          inset-x-2
          bottom-2
          flex
          gap-2
          opacity-0
          transition-opacity
          group-hover:opacity-100
        "
      >
        {!photo.isPrimary && (
          <button
            type="button"
            onClick={() =>
              makePrimary(index)
            }
            className="
              flex-1
              rounded-lg
              bg-black/60
              px-2 py-2
              text-[10px]
              font-semibold
              text-white
              backdrop-blur
            "
          >
            Make cover
          </button>
        )}

        <button
          type="button"
          onClick={() =>
            remove(index)
          }
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            bg-red-500/80
            text-white
          "
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  ))}
</div>

);
}