import {
  Check,
  Trash2,
} from "lucide-react";

import type { TaxonomyAttribute } from "./TaxonomyTypes";

interface Props {
  attribute: TaxonomyAttribute | null;
}

export function TaxonomyAttributeDetails({
  attribute,
}: Props) {
  if (!attribute) {
    return (
      <section
        className="
          min-h-[250px]
          rounded-2xl
          border
          border-dashed
          border-gray-200
          p-5

          dark:border-white/10
        "
      >
        <p className="text-xs font-semibold">
          Attribute Details
        </p>

        <p className="mt-1 text-[9px] text-gray-400">
          Select an attribute to configure it.
        </p>
      </section>
    );
  }

  return (
    <section
      className="
        rounded-2xl
        border
        border-black/[0.05]
        bg-white
        p-4

        dark:border-white/[0.06]
        dark:bg-white/[0.035]
      "
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-bold">
          Attribute Details
        </h2>

        <button
          type="button"
          className="
            grid
            size-7
            place-items-center
            rounded-lg
            text-red-400
            hover:bg-red-50
            hover:text-red-500
          "
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Input label="Name" value={attribute.name} />
        <Input label="Key" value={attribute.key} />
        <Input label="Type" value={attribute.type} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <CheckOption
          label="Required"
          checked={attribute.required}
        />

        <CheckOption
          label="Searchable"
          checked={attribute.searchable}
        />

        <CheckOption
          label="Filterable"
          checked={attribute.filterable}
        />
      </div>

      {(attribute.type === "integer" ||
        attribute.type === "decimal") && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Input
            label="Min Value"
            value={String(attribute.minValue ?? "")}
          />

          <Input
            label="Max Value"
            value={String(attribute.maxValue ?? "")}
          />
        </div>
      )}

      {attribute.type === "choice" && (
        <div className="mt-4">
          <Input
            label="Options"
            value={
              attribute.options?.join(", ") ?? ""
            }
          />
        </div>
      )}
    </section>
  );
}

function Input({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-[8px] font-semibold text-gray-500">
        {label}
      </span>

      <input
        value={value}
        readOnly
        className="
          h-9
          w-full
          rounded-lg
          border
          border-black/[0.07]
          bg-white
          px-3
          text-[9px]
          outline-none

          dark:border-white/[0.07]
          dark:bg-white/[0.025]
          dark:text-white
        "
      />
    </label>
  );
}

function CheckOption({
  label,
  checked,
}: {
  label: string;
  checked: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`
          grid
          size-4
          place-items-center
          rounded
          border
          ${
            checked
              ? "border-yegna-600 bg-yegna-600 text-white"
              : "border-gray-300"
          }
        `}
      >
        {checked && <Check className="size-3" />}
      </span>

      <span className="text-[9px] font-medium">
        {label}
      </span>
    </div>
  );
}