import {
  CheckCircle2,
  Pencil,
  Plus,
  XCircle,
} from "lucide-react";

import type {
  TaxonomyAttribute,
  TaxonomyNode,
} from "./TaxonomyTypes";

interface Props {
  node: TaxonomyNode | null;
  onSelectAttribute: (
    attribute: TaxonomyAttribute
  ) => void;
}

export function TaxonomyAttributes({
  node,
  onSelectAttribute,
}: Props) {
  if (!node) {
    return null;
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
      <header className="flex items-center justify-between border-b border-black/[0.05] px-4 py-3 dark:border-white/[0.06]">
        <div>
          <h2 className="text-xs font-bold">
            Attributes for{" "}
            <span className="text-yegna-700 dark:text-yegna-400">
              {node.name}
            </span>
          </h2>
        </div>

        <button
          type="button"
          className="
            flex
            items-center
            gap-1.5
            rounded-lg
            border
            border-yegna-600/30
            px-2.5
            py-1.5
            text-[9px]
            font-semibold
            text-yegna-700

            dark:text-yegna-400
          "
        >
          <Plus className="size-3" />
          Add Attribute
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/[0.05] dark:border-white/[0.06]">
              {[
                "Name",
                "Key",
                "Type",
                "Required",
                "Searchable",
                "Filterable",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="
                    whitespace-nowrap
                    px-4
                    py-2.5
                    text-[8px]
                    font-semibold
                    text-gray-400
                  "
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {node.attributes.map((attribute) => (
              <tr
                key={attribute.id}
                className="
                  border-b
                  border-black/[0.04]
                  last:border-0
                  hover:bg-gray-50

                  dark:border-white/[0.04]
                  dark:hover:bg-white/[0.025]
                "
              >
                <td className="px-4 py-3 text-[9px] font-medium">
                  {attribute.name}
                </td>

                <td className="px-4 py-3 text-[8px] text-gray-400">
                  {attribute.key}
                </td>

                <td className="px-4 py-3 text-[8px] text-gray-500">
                  {attribute.type}
                </td>

                <BooleanCell value={attribute.required} />
                <BooleanCell value={attribute.searchable} />
                <BooleanCell value={attribute.filterable} />

                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectAttribute(attribute)
                    }
                    className="
                      grid
                      size-7
                      place-items-center
                      rounded-lg
                      text-gray-400
                      hover:bg-gray-100
                      hover:text-gray-700

                      dark:hover:bg-white/[0.05]
                    "
                    aria-label="Edit attribute"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BooleanCell({
  value,
}: {
  value: boolean;
}) {
  return (
    <td className="px-4 py-3">
      {value ? (
        <CheckCircle2 className="size-3.5 text-emerald-500" />
      ) : (
        <XCircle className="size-3.5 text-red-400" />
      )}
    </td>
  );
}