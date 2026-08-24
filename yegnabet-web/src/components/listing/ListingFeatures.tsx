import {
  Check,
} from "lucide-react";

interface ListingFeaturesProps {
  features?: string[];
}

export function ListingFeatures({
  features,
}: ListingFeaturesProps) {
  if (!features?.length) {
    return null;
  }

  return (
    <section className="px-4 pt-7 sm:px-0">
      <h2 className="text-sm font-bold text-gray-900 dark:text-white">
        Features
      </h2>

      <div
        className="
          mt-3
          grid
          grid-cols-2
          gap-x-4
          gap-y-3
        "
      >
        {features.map((feature) => (
          <div
            key={feature}
            className="
              flex
              items-center
              gap-2
              text-xs
              text-gray-500
              dark:text-gray-400
            "
          >
            <span
              className="
                grid
                size-5
                shrink-0
                place-items-center
                rounded-full
                bg-yegna-50
                text-yegna-700
                dark:bg-yegna-900/25
                dark:text-yegna-300
              "
            >
              <Check className="size-3" />
            </span>

            {feature}
          </div>
        ))}
      </div>
    </section>
  );
}