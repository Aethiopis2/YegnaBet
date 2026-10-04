import {
  CheckCircle2,
  Pencil,
  Plus,
  XCircle,
} from "lucide-react";
import type { TaxonomyNodeFront, TaxonomyAttribute } from "../../../types/common/taxonomy";


interface Props {
  node: TaxonomyNodeFront | null;
  attributes: TaxonomyAttribute[];
  loading?: boolean;
  onSelectAttribute: (attribute: TaxonomyAttribute) => void;
  onAddAttribute: () => void;
}

export function TaxonomyAttributes({
  node,
  attributes,
  loading,
  onSelectAttribute,
  onAddAttribute
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
          onClick={onAddAttribute}
          className="
            inline-flex items-center gap-2
            rounded-xl
            bg-orange-500
            px-3 py-2
            text-sm font-medium text-white
            transition
            hover:bg-orange-400
            active:scale-95
          "
        >
          <Plus size={16} />
          Add Attribute
        </button>
      </header>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-8 text-center text-sm text-zinc-500">
            Loading attributes...
          </div>
        ) : attributes.length === 0 ? (
          <div className="py-8 text-center text-sm text-zinc-500">
            No attributes defined for this category.
          </div>
        ) : (
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
            {attributes.map((attribute) => (
              <tr
                key={attribute.id}
                onClick={() => onSelectAttribute(attribute)}
                className="
                  cursor-pointer
                  border-t border-zinc-800
                  transition
                  hover:bg-zinc-800/50
                "
              >
                <td className="px-4 py-3 text-sm text-white">
                  {attribute.name}
                </td>

                <td className="px-4 py-3 text-sm text-zinc-400">
                  {attribute.key}
                </td>

                <td className="px-4 py-3 text-sm text-zinc-400">
                  {attribute.type}
                </td>

                
                  <BooleanCell value={attribute.required} />
               

                
                  <BooleanCell value={attribute.searchable} />
                

                
                  <BooleanCell value={attribute.filterable} />
                

                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectAttribute(attribute);
                    }}
                    className="
                      rounded-lg p-2
                      text-zinc-400
                      hover:bg-zinc-800
                      hover:text-orange-400
                    "
                  >
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
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