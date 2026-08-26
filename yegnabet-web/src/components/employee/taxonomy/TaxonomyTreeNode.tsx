import {
  ChevronDown,
  ChevronRight,
  Folder,
  GripVertical,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import type { TaxonomyNode } from "./TaxonomyTypes";

interface Props {
  node: TaxonomyNode;
  depth: number;

  selectedId: string | null;

  onSelect: (node: TaxonomyNode) => void;

  onMove: (
    draggedId: string,
    targetId: string
  ) => void;

  onAddChild: (parentId: string) => void;
}

export function TaxonomyTreeNode({
  node,
  depth,
  selectedId,
  onSelect,
  onMove,
  onAddChild,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const [dragging, setDragging] = useState(false);

  const selected = node.id === selectedId;
  const hasChildren = node.children.length > 0;

  const Icon = node.icon;

  function handleDragStart(
    event: React.DragEvent<HTMLDivElement>
  ) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "application/x-taxonomy-node",
      node.id
    );

    setDragging(true);
  }

  function handleDragEnd() {
    setDragging(false);
  }

  function handleDragOver(
    event: React.DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    const draggedId = event.dataTransfer.getData(
      "application/x-taxonomy-node"
    );

    if (!draggedId || draggedId === node.id) {
      return;
    }

    onMove(draggedId, node.id);
  }

  return (
    <div>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => onSelect(node)}
        className={`
          group
          relative
          flex
          min-h-10
          cursor-grab
          items-center
          gap-1
          rounded-xl
          border
          px-2
          py-1.5
          transition

          active:cursor-grabbing

          ${
            dragging
              ? `
                scale-[0.99]
                border-yegna-400
                bg-yegna-50/70
                opacity-50
              `
              : selected
                ? `
                  border-yegna-300
                  bg-yegna-50
                  text-yegna-800

                  dark:border-yegna-700/50
                  dark:bg-yegna-900/20
                  dark:text-yegna-300
                `
                : `
                  border-transparent
                  hover:bg-gray-50

                  dark:hover:bg-white/[0.035]
                `
          }
        `}
        style={{
          marginLeft: depth * 24,
        }}
      >
        {/* TREE CONNECTOR */}

        {depth > 0 && (
          <span
            className="
              pointer-events-none
              absolute
              -left-4
              top-0
              h-1/2
              w-4
              border-b
              border-l
              border-gray-200

              dark:border-white/10
            "
          />
        )}

        {/* DRAG HANDLE */}

        <GripVertical
          className="
            size-3.5
            shrink-0
            text-gray-300
            opacity-0
            transition
            group-hover:opacity-100

            dark:text-gray-600
          "
        />

        {/* EXPAND */}

        {hasChildren ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setExpanded((value) => !value);
            }}
            className="
              grid
              size-6
              shrink-0
              place-items-center
              rounded-lg
              text-gray-400
              transition
              hover:bg-black/[0.04]

              dark:hover:bg-white/[0.05]
            "
            aria-label={
              expanded
                ? "Collapse category"
                : "Expand category"
            }
          >
            {expanded ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
          </button>
        ) : (
          <span className="size-6 shrink-0" />
        )}

        {/* ICON */}

        <span
          className={`
            grid
            size-7
            shrink-0
            place-items-center
            rounded-lg

            ${
              selected
                ? "bg-white/70 text-yegna-700 dark:bg-white/[0.06] dark:text-yegna-400"
                : "bg-gray-100 text-gray-500 dark:bg-white/[0.05] dark:text-gray-400"
            }
          `}
        >
          {Icon ? (
            <Icon className="size-3.5" />
          ) : (
            <Folder className="size-3.5" />
          )}
        </span>

        {/* NAME */}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[10px] font-semibold">
              {node.name}
            </span>

            {!node.active && (
              <span
                className="
                  rounded-full
                  bg-gray-100
                  px-1.5
                  py-0.5
                  text-[7px]
                  text-gray-400
                "
              >
                Inactive
              </span>
            )}
          </div>
        </div>

        {/* LISTING COUNT */}

        <span
          className="
            rounded-full
            bg-gray-100
            px-2
            py-1
            text-[7px]
            font-medium
            text-gray-500

            dark:bg-white/[0.05]
            dark:text-gray-400
          "
        >
          {node.listingCount}
        </span>

        {/* ACTIONS */}

        <div
          className="
            ml-1
            flex
            items-center
            gap-0.5
            opacity-0
            transition
            group-hover:opacity-100
          "
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onAddChild(node.id);
            }}
            className="
              grid
              size-7
              place-items-center
              rounded-lg
              text-gray-400
              hover:bg-yegna-50
              hover:text-yegna-700
            "
            aria-label="Add child category"
          >
            <Plus className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSelect(node);
            }}
            className="
              grid
              size-7
              place-items-center
              rounded-lg
              text-gray-400
              hover:bg-gray-100
            "
            aria-label="Edit category"
          >
            <Pencil className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
            }}
            className="
              grid
              size-7
              place-items-center
              rounded-lg
              text-gray-400
              hover:bg-red-50
              hover:text-red-500
            "
            aria-label="More actions"
          >
            <MoreVertical className="size-3.5" />
          </button>
        </div>
      </div>

      {/* CHILDREN */}

      {expanded && hasChildren && (
        <div className="relative">
          {node.children.map((child) => (
            <TaxonomyTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onMove={onMove}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}