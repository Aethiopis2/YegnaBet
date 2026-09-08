import type {
ListingPhotoDraft,
ListingVideoDraft,
} from "../../../../types/providerListings";

import { ListingPhotoGrid } from "../media/ListingPhotoGrid";
import { ListingPhotoUploader } from "../media/ListingPhotoUploader";
import { ListingVideoLinks } from "../media/ListingVideoLinks";

interface Props {
photos: ListingPhotoDraft[];
videos: ListingVideoDraft[];

onPhotosChange: (
photos: ListingPhotoDraft[]
) => void;

onVideosChange: (
videos: ListingVideoDraft[]
) => void;
}

export function ListingMediaStep({
photos,
videos,
onPhotosChange,
onVideosChange,
}: Props) {
return ( <div className="space-y-7"> <div> <h2 className="text-xl font-bold text-slate-900 dark:text-white">
Show it off </h2>

```
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Good photos and videos make a big difference.
    </p>
  </div>

  <div>
    <ListingPhotoUploader
      photos={photos}
      onChange={onPhotosChange}
    />

    <ListingPhotoGrid
      photos={photos}
      onChange={onPhotosChange}
    />
  </div>

  <ListingVideoLinks
    videos={videos}
    onChange={onVideosChange}
  />
</div>

);
}
