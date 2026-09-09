import {
  Minus,
  Plus,
} from "lucide-react";

import type {
  ListingAttributeFieldProps,
} from "../../../types/provider/attributeDefinition";

export function ListingIntegerField({
  attribute,
  value,
  onChange,
}: ListingAttributeFieldProps) {
  const numberValue = Number(value ?? 0);

  return (
    <div
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
            onChange(
              Math.max(
                0,
                numberValue - 1
              )
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

        <span className="w-10 text-center font-bold text-slate-900 dark:text-white">
          {numberValue}
        </span>

        <button
          type="button"
          onClick={() =>
            onChange(numberValue + 1)
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
}