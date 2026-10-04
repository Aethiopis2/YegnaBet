import { useCallback, useEffect, useMemo, useState } from "react";
import { EmployeeShell } from "../../components/employee/EmployeeShell";
import { TaxonomySidebar } from "../../components/employee/taxonomy/TaxonomySidebar";
import { flattenTree, TaxonomyTree } from "../../components/employee/taxonomy/TaxonomyTree";
import { TaxonomyDetails } from "../../components/employee/taxonomy/TaxonomyDetails";
import { TaxonomyAttributes } from "../../components/employee/taxonomy/TaxonomyAttributes";
import { TaxonomyAttributeDetails } from "../../components/employee/taxonomy/TaxonomyAttributeDetails";
import type { TaxonomyAttribute, TaxonomyAttributeType, TaxonomyNodeFront } from "../../types/common/taxonomy";
import { mapTaxonomyTree } from "../../types/eployee/taxonomyMapper";
import { createTaxonomyAttribute, createTaxonomyNode, getTaxonomyAttributes, getTaxonomyTree, moveTaxonomyNode } from "../../lib/employee/taxonomyApi";
import { ConfirmDialog } from "../../components/common/ConfrimationDialog";

interface PendingMove {
  draggedId: string;
  targetId: string;
}

function cloneTree(nodes: TaxonomyNodeFront[]): TaxonomyNodeFront[] {
  return nodes.map((node) => ({
    ...node,
    children: cloneTree(node.children),
    attributes: [...node.attributes],
  }));
}

function findNode(nodes: TaxonomyNodeFront[], id: string): TaxonomyNodeFront | null {
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

function removeNode(nodes: TaxonomyNodeFront[], id: string): TaxonomyNodeFront | null {
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

function containsNode(node: TaxonomyNodeFront, id: string): boolean {
  if (node.id === id) {
    return true;
  }

  return node.children.some((child) =>
    containsNode(child, id)
  );
}

const taxonomyIds: Record<string, number> = {
  "listing-types": 1,
  "professional-specializations": 2,
  "business-types": 3,
  "property-features": 4,
  "service-categories": 5,
};

export function TaxonomiesPage() {
  const [taxonomy, setTaxonomy] = useState("listing-types");
  const [tree, setTree] =useState<TaxonomyNodeFront[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(null);

  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
  const [moveSnapshot, setMoveSnapshot] = useState<TaxonomyNodeFront[] | null>(null);
  const [mutationLoading, setMutationLoading] = useState(false);

  const [attributes, setAttributes] = useState<TaxonomyAttribute[]>([]);
  const [attributesLoading, setAttributesLoading] = useState(false);


  const allNodes = useMemo(
    () => flattenTree(tree),
    [tree]
  );
  
  const handleAddAttribute = async () => {
    if (!selectedNode) return;

    try {
      const created = await createTaxonomyAttribute(
        selectedNode.id,
        {
          name: "New Attribute",
          key: `attribute_${Date.now()}`,
          type: "string",
          required: false,
          searchable: false,
          filterable: false,
          options: [],
        }
      );

      const attribute: TaxonomyAttribute = {
        id: String(created.id),
        name: created.name,
        key: created.key,
        type: created.type.toLowerCase() as TaxonomyAttributeType,
        required: created.required,
        searchable: created.searchable,
        filterable: created.filterable,
        minValue: created.minValue ?? undefined,
        maxValue: created.maxValue ?? undefined,
        options: created.options ?? [],
      };

      setAttributes((current) => [...current, attribute]);
      setSelectedAttributeId(attribute.id);
    } catch (error) {
      console.error(error);
      setError("Failed to create attribute.");
    }
  };

  useEffect(() => {
    if (!selectedNode) {
      setAttributes([]);
      setSelectedAttributeId(null);
      return;
    }

    let cancelled = false;

    const loadAttributes = async () => {
      setAttributesLoading(true);

      try {
        const dto = await getTaxonomyAttributes(selectedNode.id);

        if (cancelled) return;

        setAttributes(
          dto.map((x) => ({
            id: String(x.id),
            name: x.name,
            key: x.key,
            type: x.type.toLowerCase() as TaxonomyAttributeType,
            required: x.required,
            searchable: x.searchable,
            filterable: x.filterable,
            minValue: x.minValue ?? undefined,
            maxValue: x.maxValue ?? undefined,
            options: x.options ?? [],
          }))
        );

        setSelectedAttributeId(null);
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setAttributes([]);
          setSelectedAttributeId(null);
        }
      } finally {
        if (!cancelled) {
          setAttributesLoading(false);
        }
      }
    };

    loadAttributes();

    return () => {
      cancelled = true;
    };
  }, [selectedId]);



  useEffect(() => {
    const taxonomyId = taxonomyIds[taxonomy];

    if (!taxonomyId) {
      setTree([]);
      setError("Unknown taxonomy.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    loadTree();
    return () => {
      cancelled = true;
    };
  }, [taxonomy]);

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

  const handleMove = (
    draggedId: string,
    targetId: string
  ) => {
    setMoveSnapshot(tree);

    // Your existing local clone/move logic.
    const nextTree = cloneTree(tree);

    const dragged = findNode(nextTree, draggedId);
    const target = findNode(nextTree, targetId);

    if (!dragged || !target)
      return;

    // Prevent circular hierarchy.
    if (
      draggedId === targetId ||
      containsNode(dragged, targetId)
    ) {
      return;
    }

    const removed = removeNode(
      nextTree,
      draggedId
    );

    if (!removed)
      return;

    removed.parentId = targetId;
    removed.sortOrder =
      target.children.length + 1;

    target.children.push(removed);

    setTree(nextTree);

    setPendingMove({
      draggedId,
      targetId,
    });
  };

  const confirmMove = async () => {
    if (!pendingMove)
      return;

    try {
      setMutationLoading(true);

      await moveTaxonomyNode(
        pendingMove.draggedId,
        pendingMove.targetId
      );

      setPendingMove(null);
      setMoveSnapshot(null);

      await loadTree();
    }
    catch (error) {
      console.error(error);

      if (moveSnapshot) {
        setTree(moveSnapshot);
      }

      setPendingMove(null);
      setMoveSnapshot(null);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to move category."
      );
    }
    finally {
      setMutationLoading(false);
    }
  };


  const cancelMove = () => {
    if (moveSnapshot) {
      setTree(moveSnapshot);
    }

    setPendingMove(null);
    setMoveSnapshot(null);
  };


  async function createNode(parentId: string | null) {
    const taxonomyId = taxonomyIds[taxonomy];

    if (!taxonomyId)
      throw new Error("Unknown taxonomy.");

    const node = await createTaxonomyNode(
      taxonomyId,
      {
        name: "New Category",
        parentId: parentId
          ? Number(parentId)
          : null,
      }
    );

    await loadTree();

    setSelectedId(String(node.id));
    setSelectedAttributeId(null);
  }

  const handleAddChild = async (parentId: string) => {
    try {
      await createNode(parentId);
    }
    catch (error) {
      // We'll replace this with the YegnaBet toast later.
      console.error(error);
    }
  };

  const loadTree = useCallback(async () => {
    const taxonomyId = taxonomyIds[taxonomy];

    if (!taxonomyId) {
      setTree([]);
      setError("Unknown taxonomy.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getTaxonomyTree(taxonomyId);

      setTree(mapTaxonomyTree(result));
    }
    catch (error) {
      console.error(error);

      setTree([]);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load taxonomy."
      );
    }
    finally {
      setLoading(false);
    }
  }, [taxonomy]);

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
                    onClick={() => {
                      void createNode(null);
                    }}
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
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    Loading taxonomy...
                  </div>
                </div>
              ) : error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
                  {error}
                </div>
              ) : tree.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                  This taxonomy has no categories yet.
                </div>
              ) : (
                <TaxonomyTree
                  nodes={tree}
                  selectedId={selectedId}
                  onSelect={(node) => {
                    setSelectedId(node.id);
                    setSelectedAttributeId(null);
                  }}
                  onMove={handleMove}
                  onAddChild={handleAddChild}
                />
              )}
            </div>
          </section>

          {/* RIGHT */}

          <TaxonomyDetails
            node={selectedNode}
            allNodes={allNodes}
            onSaved={loadTree}
            onDelete={()=> {}}  /*handleDeleteNode*/
          />
        </div>

        {/* LOWER AREA */}

        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <TaxonomyAttributes
            node={selectedNode}
            attributes={attributes}
            loading={attributesLoading}
            onSelectAttribute={(attribute) =>
              setSelectedAttributeId(attribute.id)
            }
            onAddAttribute={handleAddAttribute}
          />

          <TaxonomyAttributeDetails
            nodeId={selectedId}
            attribute={selectedAttribute}
            onSaved={(updated) => {
              setAttributes((current) =>
                current.map((x) =>
                  x.id === updated.id ? updated : x
                )
              );
            }}
            onDeleted={(attributeId) => {
              setAttributes((current) =>
                current.filter((x) => x.id !== attributeId)
              );

              setSelectedAttributeId(null);
            }}
          />
        </div>

        {/* CATEGORY PATH */}

        {selectedNode && (
          <CategoryPath node={selectedNode} />
        )}
      </div>

      <ConfirmDialog
        open={pendingMove !== null}
        title="Move category?"
        message={
          pendingMove
            ? (() => {
                const dragged =
                  findNode(tree, pendingMove.draggedId);

                const target =
                  findNode(tree, pendingMove.targetId);

                if (!dragged || !target)
                  return "Move this category?";

                return `Move "${dragged.name}" under "${target.name}"?`;
              })()
            : ""
        }
        confirmText="Move"
        cancelText="Cancel"
        onConfirm={confirmMove}
        onCancel={cancelMove}
        busy={mutationLoading}
      />
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
  node: TaxonomyNodeFront;
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