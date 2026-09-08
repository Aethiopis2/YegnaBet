import { Plus, Trash2 } from "lucide-react";

import type {
ListingVideoDraft,
} from "../../../../types/providerListings";

interface Props {
videos: ListingVideoDraft[];

onChange: (
videos: ListingVideoDraft[]
) => void;
}

export function ListingVideoLinks({
videos,
onChange,
}: Props) {
const add = () => {
onChange([
...videos,
{
url: "",
},
]);
};

const update = (
index: number,
url: string
) => {
onChange(
videos.map((video, i) =>
i === index
? { ...video, url }
: video
)
);
};

const remove = (index: number) => {
onChange(
videos.filter(
(_, i) => i !== index
)
);
};

return ( <div className="mt-7"> <div className="flex items-center justify-between"> <div> <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
Video links </h3>

```
      <p className="mt-1 text-xs text-slate-400">
        Add YouTube, Vimeo or other supported video links.
      </p>
    </div>

    <button
      type="button"
      onClick={add}
      className="
        inline-flex
        items-center
        gap-1
        text-xs
        font-semibold
        text-emerald-700

        dark:text-orange-400
      "
    >
      <Plus size={14} />
      Add video
    </button>
  </div>

  <div className="mt-3 space-y-3">
    {videos.map((video, index) => (
      <div
        key={index}
        className="flex gap-2"
      >
        <input
          value={video.url}
          onChange={(event) =>
            update(
              index,
              event.target.value
            )
          }
          placeholder="https://youtube.com/..."
          className="
            min-w-0
            flex-1
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4 py-3
            text-sm
            outline-none

            focus:border-emerald-600

            dark:border-white/10
            dark:bg-white/[0.03]
            dark:text-white

            dark:focus:border-orange-400
          "
        />

        <button
          type="button"
          onClick={() =>
            remove(index)
          }
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            text-slate-400

            hover:bg-slate-50
            hover:text-red-500

            dark:border-white/10
            dark:hover:bg-white/5
          "
        >
          <Trash2 size={15} />
        </button>
      </div>
    ))}
  </div>
</div>

);
}