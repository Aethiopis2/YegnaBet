import { Minus, Plus } from "lucide-react";

import type {
ListingAttributeValue,
} from "../../../../types/providerListings";

interface Props {
attributes: Record<
string,
ListingAttributeValue

> ;

onChange: (
attributes: Record<
string,
ListingAttributeValue
>
) => void;
}

const DEMO_ATTRIBUTES = [
{
key: "bedrooms",
label: "Bedrooms",
type: "counter",
},
{
key: "bathrooms",
label: "Bathrooms",
type: "counter",
},
{
key: "parking",
label: "Parking spaces",
type: "counter",
},
];

export function ListingAttributesStep({
attributes,
onChange,
}: Props) {
const update = (
key: string,
value: ListingAttributeValue
) => {
onChange({
...attributes,
[key]: value,
});
};

return ( <div className="space-y-7"> <div> <h2 className="text-xl font-bold text-slate-900 dark:text-white">
Tell us more </h2>

    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Add details that help customers understand your listing.
    </p>
  </div>

  <div className="space-y-3">
    {DEMO_ATTRIBUTES.map((attribute) => {
      const value =
        Number(attributes[attribute.key] ?? 0);

      return (
        <div
          key={attribute.key}
          className="
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-4

            dark:border-white/10
            dark:bg-white/2.5
          "
        >
          <span className="text-sm font-semibold text-slate-800 dark:text-white">
            {attribute.label}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                update(
                  attribute.key,
                  Math.max(0, value - 1)
                )
              }
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-full
                border
                border-slate-200
                text-slate-500
                hover:bg-slate-50

                dark:border-white/10
                dark:text-slate-300
                dark:hover:bg-white/5
              "
            >
              <Minus size={15} />
            </button>

            <span className="w-6 text-center font-bold text-slate-900 dark:text-white">
              {value}
            </span>

            <button
              type="button"
              onClick={() =>
                update(
                  attribute.key,
                  value + 1
                )
              }
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-full
                border
                border-slate-200
                text-slate-500
                hover:bg-slate-50

                dark:border-white/10
                dark:text-slate-300
                dark:hover:bg-white/5
              "
            >
              <Plus size={15} />
            </button>
          </div>
        </div>
      );
    })}
  </div>
</div>

);
}
