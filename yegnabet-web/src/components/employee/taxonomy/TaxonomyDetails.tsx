import {
  ChevronDown,
  MoreHorizontal,
  Save,
  Trash2,
} from "lucide-react";

import type { TaxonomyNode } from "./TaxonomyTypes";

interface Props {
  node: TaxonomyNode | null;
}

export function TaxonomyDetails({ node }: Props) {
  if (!node) {
    return (
      <section
        className="
          flex
          min-h-[400px]
          items-center
          justify-center
          rounded-2xl
          border
          border-dashed
          border-gray-200
          text-center

          dark:border-white/10
        "
      >
        <div>
          <p className="text-xs font-semibold">
            Select a category
          </p>

          <p className="mt-1 max-w-xs text-[9px] text-gray-400">
            Select a category from the tree to edit
            its properties and attributes.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-black/[0.05]
        bg-white

        dark:border-white/[0.06]
        dark:bg-white/[0.035]
      "
    >
      <header
        className="
          flex
          items-center
          justify-between
          border-b
          border-black/[0.05]
          px-4
          py-3

          dark:border-white/[0.06]
        "
      >
        <div>
          <h2 className="text-sm font-bold">
            Category Details
          </h2>

          <p className="mt-0.5 text-[9px] text-gray-400">
            Configure this taxonomy node.
          </p>
        </div>

        <button
          type="button"
          className="
            flex
            items-center
            gap-1.5
            rounded-lg
            border
            border-red-200
            px-2.5
            py-1.5
            text-[9px]
            font-semibold
            text-red-500
            transition
            hover:bg-red-50

            dark:border-red-500/30
            dark:hover:bg-red-500/10
          "
        >
          <Trash2 className="size-3" />
          Delete
        </button>
      </header>

      {/* TABS */}

      <div
        className="
          flex
          border-b
          border-black/[0.05]
          px-4

          dark:border-white/[0.06]
        "
      >
        <button
          type="button"
          className="
            border-b-2
            border-yegna-600
            px-3
            py-3
            text-[9px]
            font-semibold
            text-yegna-700

            dark:text-yegna-400
          "
        >
          General
        </button>

        <button
          type="button"
          className="
            px-3
            py-3
            text-[9px]
            font-medium
            text-gray-400
            hover:text-gray-700
          "
        >
          Attributes
        </button>

        <button
          type="button"
          className="
            px-3
            py-3
            text-[9px]
            font-medium
            text-gray-400
            hover:text-gray-700
          "
        >
          Listings ({node.listingCount})
        </button>
      </div>

      <div className="space-y-4 p-4">
        <Field
          label="Name"
          value={node.name}
          required
        />

        <Field
          label="Slug"
          value={node.slug}
          required
        />

        <Field
          label="Description"
          value={node.description ?? ""}
        />

        <Field
          label="Parent Category"
          value={
            node.parentId
              ? "Selected parent"
              : "Root category"
          }
          select
        />

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Sort Order"
            value={String(node.sortOrder)}
          />

          <Field
            label="Status"
            value={node.active ? "Active" : "Inactive"}
            select
          />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-3 dark:bg-white/[0.035]">
          <div>
            <p className="text-[10px] font-semibold">
              Active
            </p>

            <p className="mt-0.5 text-[8px] text-gray-400">
              Make this category available to users.
            </p>
          </div>

          <div className="relative h-5 w-9 rounded-full bg-yegna-600">
            <span className="absolute right-0.5 top-0.5 size-4 rounded-full bg-white shadow-sm" />
          </div>
        </div>

        <button
          type="button"
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-yegna-700
            py-2.5
            text-[10px]
            font-semibold
            text-white
            transition
            hover:bg-yegna-800
          "
        >
          <Save className="size-3.5" />
          Save Changes
        </button>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  required = false,
  select = false,
}: {
  label: string;
  value: string;
  required?: boolean;
  select?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[9px] font-semibold text-gray-500 dark:text-gray-400">
        {label}
        {required && (
          <span className="ml-0.5 text-red-500">*</span>
        )}
      </span>

      <div className="relative">
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
            text-[10px]
            outline-none

            dark:border-white/[0.07]
            dark:bg-white/[0.025]
            dark:text-white
          "
        />

        {select && (
          <ChevronDown
            className="
              pointer-events-none
              absolute
              right-3
              top-1/2
              size-3
              -translate-y-1/2
              text-gray-400
            "
          />
        )}
      </div>
    </label>
  );
}