import { ImagePlus } from "lucide-react";
import { useRef } from "react";

import type {
ListingPhotoDraft,
} from "../../../../types/providerListings";

interface Props {
photos: ListingPhotoDraft[];

onChange: (
photos: ListingPhotoDraft[]
) => void;
}

export function ListingPhotoUploader({
photos,
onChange,
}: Props) {
const inputRef =
useRef<HTMLInputElement>(null);

const handleFiles = (
files: FileList | null
) => {
if (!files) return;

const newPhotos: ListingPhotoDraft[] =
  Array.from(files).map(
    (file, index) => ({
      file,
      url: URL.createObjectURL(file),
      isPrimary:
        photos.length === 0 &&
        index === 0,
    })
  );

onChange([
  ...photos,
  ...newPhotos,
]);

};

return ( <div>
<input
ref={inputRef}
type="file"
accept="image/*"
multiple
className="hidden"
onChange={(event) =>
handleFiles(
event.target.files
)
}
/>

  <button
    type="button"
    onClick={() =>
      inputRef.current?.click()
    }
    className="
      flex
      min-h-32
      w-full
      flex-col
      items-center
      justify-center
      rounded-2xl
      border-2
      border-dashed
      border-slate-200
      bg-slate-50
      text-slate-400
      transition-all

      hover:border-emerald-400
      hover:bg-emerald-50/40
      hover:text-emerald-600

      dark:border-white/10
      dark:bg-white/2
      dark:hover:border-orange-400/40
      dark:hover:bg-orange-400/5
      dark:hover:text-orange-400
    "
  >
    <ImagePlus size={24} />

    <span className="mt-2 text-sm font-semibold">
      Add photos
    </span>

    <span className="mt-1 text-xs">
      Select multiple images
    </span>
  </button>
</div>

);
}