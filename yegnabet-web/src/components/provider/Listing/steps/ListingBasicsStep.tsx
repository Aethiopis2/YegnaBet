import type { ListingDraft } from "../../../../types/providerListings";

import { ListingTextArea } from "../fields/ListingTextArea";
import { ListingTextField } from "../fields/ListingTextField";

interface Props {
value: ListingDraft;
onChange: (
changes: Partial<ListingDraft>
) => void;
}

export function ListingBasicsStep({
value,
onChange,
}: Props) {
return ( <div className="space-y-7"> <div> <h2 className="text-xl font-bold text-slate-900 dark:text-white">
Let's start with the basics </h2>

    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Give your listing a clear title and description.
    </p>
  </div>

  <div className="space-y-5">
    <ListingTextField
      label="Listing title"
      placeholder="e.g. Modern 3 Bedroom Villa in Bole"
      value={value.title}
      onChange={(event) =>
        onChange({
          title: event.target.value,
        })
      }
    />

    <ListingTextArea
      label="Description"
      hint="Describe what makes this property or service useful to customers."
      placeholder="Tell customers about your listing..."
      value={value.description}
      onChange={(event) =>
        onChange({
          description: event.target.value,
        })
      }
    />
  </div>
</div>

);
}