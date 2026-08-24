import { useState } from "react";

interface ListingDescriptionProps {
  description?: string;
}

export function ListingDescription({
  description,
}: ListingDescriptionProps) {
  const [expanded, setExpanded] =
    useState(false);

  return (
    <section className="px-4 pt-7 sm:px-0">
      <h2 className="text-sm font-bold text-gray-900 dark:text-white">
        About this property
      </h2>

      <p
        className={`
          mt-3
          text-sm
          leading-6
          text-gray-500
          dark:text-gray-400
          ${
            expanded
              ? ""
              : "line-clamp-4"
          }
        `}
      >
        {description}
      </p>

      <button
        type="button"
        onClick={() =>
          setExpanded((value) => !value)
        }
        className="
          mt-2
          text-xs
          font-semibold
          text-yegna-700
          hover:underline
          dark:text-yegna-300
        "
      >
        {expanded
          ? "Show less"
          : "Read more"}
      </button>
    </section>
  );
}