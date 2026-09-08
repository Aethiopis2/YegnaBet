import { ArrowLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import type { ProviderTaxonomy } from "../../../../types/provider";

interface Props {
  nodes: ProviderTaxonomy[];
  value: number | null;
  onChange: (id: number | null) => void;
}

export function ListingTaxonomySelector({
  nodes,
  value,
  onChange,
}: Props) {
    
  const [path, setPath] = useState<ProviderTaxonomy[]>([]);

  const currentNodes = useMemo(() => {
    if (path.length === 0) {
      return nodes;
    }

    return path[path.length - 1].children;
  }, [nodes, path]);

  const selectNode = (node: ProviderTaxonomy) => {
    setPath((current) => [...current, node]);

    if (node.children.length === 0) {
      onChange(node.id);
    } else {
      onChange(null);
    }
  };

  const goBack = () => {
    setPath((current) =>
    current.slice(0, -1));

    onChange(null);
  };

  return ( 
    <div className="space-y-5"> <div> <h2 className="text-xl font-bold text-slate-900 dark:text-white">
      What are you offering? </h2>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Choose the category that best describes your listing.
      </p>
    </div>

    {path.length > 0 && (
      <div className="flex flex-wrap items-center gap-1 text-xs">
        <button
          type="button"
          onClick={() => {
            setPath([]);
            onChange(null);
          }}
          className="
            font-semibold
            text-emerald-700
            hover:underline
            dark:text-orange-400
          "
        >
          Category
        </button>

        {path.map((node, index) => (
          <div
            key={node.id}
            className="flex items-center"
          >
            <ChevronRight
              size={13}
              className="mx-1 text-slate-300 dark:text-slate-600"
            />

            <span
              className={`
                ${
                  index === path.length - 1
                    ? "font-semibold text-slate-900 dark:text-white"
                    : "text-slate-400 dark:text-slate-500"
                }
              `}
            >
              {node.name}
            </span>
          </div>
        ))}
      </div>
    )}

    <div className="grid gap-3 sm:grid-cols-2">
      {currentNodes.map((node) => {
        const selected =
          value === node.id;

        return (
          <button
            key={node.id}
            type="button"
            onClick={() =>
              selectNode(node)
            }
            className={`
              group
              flex
              items-center
              justify-between
              rounded-2xl
              border
              p-5
              text-left
              transition-all

              ${
                selected
                  ? `
                    border-emerald-600
                    bg-emerald-50
                    dark:border-orange-400
                    dark:bg-orange-400/10
                  `
                  : `
                    border-slate-200
                    bg-white
                    hover:-translate-y-0.5
                    hover:border-emerald-300
                    hover:shadow-sm

                    dark:border-white/10
                    dark:bg-white/2.5
                    dark:hover:border-orange-400/30
                  `
              }
            `}
          >
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {node.name}
              </div>

              <div className="mt-1 text-xs text-slate-400">
                {node.children.length > 0
                  ? `${node.children.length} options`
                  : "Select this category"}
              </div>
            </div>

            <ChevronRight
              size={18}
              className="
                text-slate-300
                transition-transform
                group-hover:translate-x-1

                dark:text-slate-600
              "
            />
          </button>
        );
      })}
    </div>

      {path.length > 0 && (
        <button
          type="button"
          onClick={goBack}
          className="
            inline-flex
            items-center
            gap-2
            text-xs
            font-semibold
            text-emerald-700

            dark:text-orange-400
          "
        >
          <ArrowLeft size={14} />
          Go back
        </button>
      )}
    </div>
  );
}