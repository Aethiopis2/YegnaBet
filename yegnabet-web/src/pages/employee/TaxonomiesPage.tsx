import {
  Building2,
  BriefcaseBusiness,
  Folder,
  Home,
  LandPlot,
  UserRound,
  Wrench,
} from "lucide-react";

import { useMemo, useState } from "react";

import { EmployeeShell } from "../../components/employee/EmployeeShell";

import { TaxonomySidebar } from "../../components/employee/taxonomy/TaxonomySidebar";
import { TaxonomyTree } from "../../components/employee/taxonomy/TaxonomyTree";
import { TaxonomyDetails } from "../../components/employee/taxonomy/TaxonomyDetails";
import { TaxonomyAttributes } from "../../components/employee/taxonomy/TaxonomyAttributes";
import { TaxonomyAttributeDetails } from "../../components/employee/taxonomy/TaxonomyAttributeDetails";

import type {
  TaxonomyAttribute,
  TaxonomyNode,
} from "../../components/employee/taxonomy/TaxonomyTypes";


const initialTree: TaxonomyNode[] = [
  {
    id: "listing",
    name: "Listing",
    slug: "listing",
    description:
      "Root classification for all listings.",
    icon: Folder,
    active: true,
    parentId: null,
    sortOrder: 0,
    listingCount: 1248,
    attributes: [],
    children: [
      {
        id: "property",
        name: "Property",
        slug: "property",
        description:
          "Real estate and physical property listings.",
        icon: Building2,
        active: true,
        parentId: "listing",
        sortOrder: 1,
        listingCount: 942,
        attributes: [],
        children: [
          {
            id: "house",
            name: "House",
            slug: "house",
            description:
              "Standalone residential houses.",
            icon: Home,
            active: true,
            parentId: "property",
            sortOrder: 1,
            listingCount: 312,
            attributes: [
              {
                id: "area",
                name: "Area (m²)",
                key: "area",
                type: "decimal",
                required: true,
                searchable: true,
                filterable: true,
              },
              {
                id: "bedrooms",
                name: "Bedrooms",
                key: "bedrooms",
                type: "integer",
                required: true,
                searchable: true,
                filterable: true,
                minValue: 0,
                maxValue: 20,
              },
              {
                id: "bathrooms",
                name: "Bathrooms",
                key: "bathrooms",
                type: "integer",
                required: true,
                searchable: true,
                filterable: true,
                minValue: 0,
                maxValue: 20,
              },
              {
                id: "floor",
                name: "Floor",
                key: "floor",
                type: "integer",
                required: false,
                searchable: true,
                filterable: true,
              },
              {
                id: "furnished",
                name: "Furnished",
                key: "furnished",
                type: "boolean",
                required: false,
                searchable: true,
                filterable: true,
              },
            ],
            children: [
              {
                id: "apartment",
                name: "Apartment",
                slug: "apartment",
                description:
                  "Independent residential unit within a building.",
                icon: Building2,
                active: true,
                parentId: "house",
                sortOrder: 1,
                listingCount: 248,
                attributes: [],
                children: [],
              },
              {
                id: "villa",
                name: "Villa",
                slug: "villa",
                description:
                  "Detached premium residential property.",
                icon: Home,
                active: true,
                parentId: "house",
                sortOrder: 2,
                listingCount: 64,
                attributes: [],
                children: [],
              },
            ],
          },

          {
            id: "office",
            name: "Office",
            slug: "office",
            icon: BriefcaseBusiness,
            active: true,
            parentId: "property",
            sortOrder: 2,
            listingCount: 94,
            attributes: [],
            children: [],
          },

          {
            id: "shop",
            name: "Shop",
            slug: "shop",
            icon: Building2,
            active: true,
            parentId: "property",
            sortOrder: 3,
            listingCount: 82,
            attributes: [],
            children: [],
          },
        ],
      },

      {
        id: "land",
        name: "Land",
        slug: "land",
        description:
          "Land and land-related listings.",
        icon: LandPlot,
        active: true,
        parentId: "listing",
        sortOrder: 2,
        listingCount: 217,
        attributes: [],
        children: [
          {
            id: "farm",
            name: "Farm",
            slug: "farm",
            icon: LandPlot,
            active: true,
            parentId: "land",
            sortOrder: 1,
            listingCount: 37,
            attributes: [],
            children: [],
          },
        ],
      },

      {
        id: "service",
        name: "Service",
        slug: "service",
        icon: Wrench,
        active: true,
        parentId: "listing",
        sortOrder: 3,
        listingCount: 307,
        attributes: [],
        children: [
          {
            id: "professional",
            name: "Professional",
            slug: "professional",
            icon: UserRound,
            active: true,
            parentId: "service",
            sortOrder: 1,
            listingCount: 192,
            attributes: [],
            children: [
              {
                id: "accountant",
                name: "Accountant",
                slug: "accountant",
                icon: UserRound,
                active: true,
                parentId: "professional",
                sortOrder: 1,
                listingCount: 28,
                attributes: [],
                children: [],
              },
              {
                id: "lawyer",
                name: "Lawyer",
                slug: "lawyer",
                icon: UserRound,
                active: true,
                parentId: "professional",
                sortOrder: 2,
                listingCount: 19,
                attributes: [],
                children: [],
              },
            ],
          },

          {
            id: "labour",
            name: "Labour",
            slug: "labour",
            icon: Wrench,
            active: true,
            parentId: "service",
            sortOrder: 2,
            listingCount: 115,
            attributes: [],
            children: [
              {
                id: "cleaner",
                name: "Cleaner",
                slug: "cleaner",
                icon: UserRound,
                active: true,
                parentId: "labour",
                sortOrder: 1,
                listingCount: 38,
                attributes: [],
                children: [],
              },
              {
                id: "painter",
                name: "Painter",
                slug: "painter",
                icon: UserRound,
                active: true,
                parentId: "labour",
                sortOrder: 2,
                listingCount: 31,
                attributes: [],
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

function cloneTree(
  nodes: TaxonomyNode[]
): TaxonomyNode[] {
  return nodes.map((node) => ({
    ...node,
    children: cloneTree(node.children),
    attributes: [...node.attributes],
  }));
}

function findNode(
  nodes: TaxonomyNode[],
  id: string
): TaxonomyNode | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }

    const found = findNode(node.children, id);

    if (found) {
      return found;
    }
  }

  return null;
}

function removeNode(
  nodes: TaxonomyNode[],
  id: string
): TaxonomyNode | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      return nodes.splice(i, 1)[0];
    }

    const removed = removeNode(
      nodes[i].children,
      id
    );

    if (removed) {
      return removed;
    }
  }

  return null;
}

function containsNode(
  node: TaxonomyNode,
  id: string
): boolean {
  if (node.id === id) {
    return true;
  }

  return node.children.some((child) =>
    containsNode(child, id)
  );
}


export function TaxonomiesPage() {
  const [taxonomy, setTaxonomy] =
    useState("listing-types");

  const [tree, setTree] =
    useState<TaxonomyNode[]>(initialTree);

  const [selectedId, setSelectedId] =
    useState<string | null>("apartment");

  const [selectedAttributeId, setSelectedAttributeId] =
    useState<string | null>("bedrooms");

  const selectedNode = useMemo(
    () =>
      selectedId
        ? findNode(tree, selectedId)
        : null,
    [tree, selectedId]
  );

  const selectedAttribute = useMemo(() => {
    if (!selectedNode || !selectedAttributeId) {
      return null;
    }

    return (
      selectedNode.attributes.find(
        (attribute) =>
          attribute.id === selectedAttributeId
      ) ?? null
    );
  }, [
    selectedNode,
    selectedAttributeId,
  ]);

  function handleMove(
    draggedId: string,
    targetId: string
  ) {
    setTree((current) => {
      const next = cloneTree(current);

      const dragged = findNode(
        next,
        draggedId
      );

      if (!dragged) {
        return current;
      }

      /*
       * Prevent dropping a node
       * inside itself or one of its children.
       */
      if (containsNode(dragged, targetId)) {
        return current;
      }

      const removed = removeNode(
        next,
        draggedId
      );

      if (!removed) {
        return current;
      }

      const target = findNode(
        next,
        targetId
      );

      if (!target) {
        return current;
      }

      removed.parentId = target.id;
      removed.sortOrder =
        target.children.length + 1;

      target.children.push(removed);

      return next;
    });
  }

  function handleAddChild(parentId: string) {
    const id =
      `new-${Date.now()}`;

    const newNode: TaxonomyNode = {
      id,
      name: "New Category",
      slug: "new-category",
      description: "",
      icon: Folder,
      active: true,
      parentId,
      sortOrder: 0,
      listingCount: 0,
      attributes: [],
      children: [],
    };

    setTree((current) => {
      const next = cloneTree(current);

      const parent = findNode(
        next,
        parentId
      );

      if (parent) {
        newNode.sortOrder =
          parent.children.length + 1;

        parent.children.push(newNode);
      }

      return next;
    });

    setSelectedId(id);
  }

  return (
    <EmployeeShell>
      <div className="mx-auto max-w-[1700px] space-y-5">

        {/* PAGE HEADER */}

        <header
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Taxonomies
            </h1>

            <div className="mt-1 flex items-center gap-2 text-[9px] text-gray-400">
              <span>Home</span>
              <span>›</span>
              <span>Taxonomies</span>
              <span>›</span>
              <span className="text-gray-600 dark:text-gray-300">
                Listing Types
              </span>
            </div>
          </div>

          <button
            type="button"
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-yegna-700
              px-4
              py-2.5
              text-[10px]
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-yegna-800
            "
          >
            <PlusIcon />
            New Taxonomy
          </button>
        </header>

        {/* MAIN EDITOR */}

        <div
          className="
            grid
            gap-4
            xl:grid-cols-[230px_minmax(420px,1fr)_360px]
          "
        >
          {/* LEFT */}

          <TaxonomySidebar
            selected={taxonomy}
            onSelect={setTaxonomy}
          />

          {/* CENTER */}

          <section
            className="
              min-h-[620px]
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
                border-b
                border-black/[0.05]
                p-4

                dark:border-white/[0.06]
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold">
                    Listing Types
                  </h2>

                  <p className="mt-1 text-[9px] text-gray-400">
                    Classification of all listing
                    types in the platform.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="
                      rounded-lg
                      border
                      border-yegna-600/30
                      px-2.5
                      py-2
                      text-[9px]
                      font-semibold
                      text-yegna-700

                      dark:text-yegna-400
                    "
                  >
                    + Add Root Category
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[9px] font-semibold text-gray-500">
                  Categories
                </span>

                <span className="text-[8px] text-gray-400">
                  Drag & Drop to reorder or move
                </span>
              </div>
            </header>

            <div className="p-3">
              <TaxonomyTree
                nodes={tree}
                selectedId={selectedId}
                onSelect={(node) =>
                  setSelectedId(node.id)
                }
                onMove={handleMove}
                onAddChild={handleAddChild}
              />
            </div>
          </section>

          {/* RIGHT */}

          <TaxonomyDetails
            node={selectedNode}
          />
        </div>

        {/* LOWER AREA */}

        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <TaxonomyAttributes
            node={selectedNode}
            onSelectAttribute={(attribute) =>
              setSelectedAttributeId(attribute.id)
            }
          />

          <TaxonomyAttributeDetails
            attribute={selectedAttribute}
          />
        </div>

        {/* CATEGORY PATH */}

        {selectedNode && (
          <CategoryPath node={selectedNode} />
        )}
      </div>
    </EmployeeShell>
  );
}


function PlusIcon() {
  return (
    <span className="text-sm leading-none">
      +
    </span>
  );
}

function CategoryPath({
  node,
}: {
  node: TaxonomyNode;
}) {
  return (
    <section
      className="
        rounded-2xl
        border
        border-black/[0.05]
        bg-white
        px-4
        py-4

        dark:border-white/[0.06]
        dark:bg-white/[0.035]
      "
    >
      <p className="text-[9px] font-semibold text-gray-400">
        Category Path
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-[9px]">
        <span className="text-gray-400">
          Listing
        </span>

        <span className="text-gray-300">›</span>

        <span className="text-gray-400">
          Property
        </span>

        <span className="text-gray-300">›</span>

        <span className="font-semibold text-yegna-700 dark:text-yegna-400">
          {node.name}
        </span>
      </div>
    </section>
  );
}