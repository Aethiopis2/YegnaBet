import {
  BriefcaseBusiness,
  Building2,
  FolderTree,
  Layers3,
  MapPin,
  Search,
  Users,
  Wrench,
} from "lucide-react";

import type { TaxonomyDefinition } from "./TaxonomyTypes";

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

const taxonomies: TaxonomyDefinition[] = [
  {
    id: "listing-types",
    name: "Listing Types",
    description: "Classification of all listing types.",
    icon: FolderTree,
  },
  {
    id: "professional-specializations",
    name: "Professional Specializations",
    description: "Professional service classifications.",
    icon: Users,
  },
  {
    id: "business-types",
    name: "Business Types",
    description: "Business and organization types.",
    icon: BriefcaseBusiness,
  },
  {
    id: "property-features",
    name: "Property Features",
    description: "Features available on properties.",
    icon: Building2,
  },
  {
    id: "service-categories",
    name: "Service Categories",
    description: "Categories for professional services.",
    icon: Wrench,
  },
];

export function TaxonomySidebar({
  selected,
  onSelect,
}: Props) {
  return (
    <aside
      className="
        flex
        min-h-[620px]
        flex-col
        rounded-2xl
        border
        border-black/[0.05]
        bg-white

        dark:border-white/[0.06]
        dark:bg-white/[0.035]
      "
    >
      <div className="border-b border-black/[0.05] p-4 dark:border-white/[0.06]">
        <h2 className="text-sm font-bold">
          Taxonomies
        </h2>

        <div className="relative mt-3">
          <Search
            className="
              absolute
              left-3
              top-1/2
              size-3.5
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            placeholder="Search taxonomies..."
            className="
              h-9
              w-full
              rounded-xl
              border
              border-black/[0.06]
              bg-gray-50
              pl-9
              pr-3
              text-[10px]
              outline-none

              focus:border-yegna-500
              focus:ring-2
              focus:ring-yegna-500/10

              dark:border-white/[0.06]
              dark:bg-white/[0.035]
              dark:text-white
            "
          />
        </div>
      </div>

      <div className="flex-1 p-2">
        {taxonomies.map((taxonomy) => {
          const Icon = taxonomy.icon;
          const active = taxonomy.id === selected;

          return (
            <button
              key={taxonomy.id}
              type="button"
              onClick={() => onSelect(taxonomy.id)}
              className={`
                group
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-3
                text-left
                transition

                ${
                  active
                    ? `
                      bg-yegna-50
                      text-yegna-700
                      dark:bg-yegna-900/20
                      dark:text-yegna-400
                    `
                    : `
                      text-gray-600
                      hover:bg-gray-50
                      dark:text-gray-300
                      dark:hover:bg-white/[0.035]
                    `
                }
              `}
            >
              <Icon className="size-4 shrink-0" />

              <span className="min-w-0 flex-1">
                <span className="block truncate text-[10px] font-semibold">
                  {taxonomy.name}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="p-3">
        <button
          type="button"
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-yegna-600/30
            py-2.5
            text-[10px]
            font-semibold
            text-yegna-700
            transition
            hover:bg-yegna-50

            dark:text-yegna-400
            dark:hover:bg-yegna-900/20
          "
        >
          <Layers3 className="size-3.5" />
          Add Taxonomy
        </button>
      </div>
    </aside>
  );
}