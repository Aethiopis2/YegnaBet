import {
  ChevronDown,
  MoreHorizontal,
  Save,
  Trash2,
} from "lucide-react";

import type { TaxonomyNodeFront } from "../../../types/common/taxonomy";
import { useEffect, useMemo, useState } from "react";
import { getDescendantIds } from "./TaxonomyTree";
import { updateTaxonomyNode } from "../../../lib/employee/taxonomyApi";

interface Props {
  node: TaxonomyNodeFront | null;
  allNodes: TaxonomyNodeFront[];
  onSaved: () => Promise<void>;
  onDelete: (node: TaxonomyNodeFront) => void;
}

export function TaxonomyDetails({ 
  node,
  allNodes,
  onSaved,
  onDelete,
 }: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState(0);
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!node) {
      setName("");
      setSlug("");
      setDescription("");
      setParentId(null);
      setSortOrder(0);
      setActive(true);
      return;
    }

    setName(node.name);
    setSlug(node.slug);
    setDescription(node.description ?? "");
    setParentId(node.parentId);
    setSortOrder(node.sortOrder);
    setActive(node.active);
  }, [node]);

  const validParents = useMemo(() => {
    if (!node)
      return [];

    const descendantIds = getDescendantIds(node);

    return allNodes.filter(candidate =>
      candidate.id !== node.id &&
      !descendantIds.has(candidate.id)
    );
  }, [node, allNodes]);

  async function handleSave() {
    if (!node)
      return;

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await updateTaxonomyNode(node.id, {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
        parentId: parentId
          ? Number(parentId)
          : null,
        sortOrder,
        isActive: active,
      });

      await onSaved();
    }
    catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save category."
      );
    }
    finally {
      setSaving(false);
    }
  }
  
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
          onChange={setName}
        />

        <Field
          label="Slug"
          value={node.slug}
          onChange={setSlug}
        />

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Description
          </label>

          <textarea
            value={description}
            onChange={event =>
              setDescription(event.target.value)
            }
            rows={4}
            className="
              w-full resize-none rounded-xl border border-zinc-200
              bg-white px-3 py-2.5 text-sm text-zinc-900
              outline-none transition
              focus:border-orange-400 focus:ring-2
              focus:ring-orange-500/10
              dark:border-zinc-700 dark:bg-zinc-900
              dark:text-zinc-100
            "
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Parent Category
          </label>

          <select
            value={parentId ?? ""}
            onChange={event =>
              setParentId(
                event.target.value === ""
                  ? null
                  : event.target.value
              )
            }
            className="
              w-full rounded-xl border border-zinc-200
              bg-white px-3 py-2.5 text-sm text-zinc-900
              outline-none transition
              focus:border-orange-400 focus:ring-2
              focus:ring-orange-500/10
              dark:border-zinc-700 dark:bg-zinc-900
              dark:text-zinc-100
            "
          >
            <option value="">
              Root Category
            </option>

            {validParents.map(parent => (
              <option
                key={parent.id}
                value={parent.id}
              >
                {parent.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={sortOrder}
            onChange={event =>
              setSortOrder(Number(event.target.value))
            }
          />

          <button
            type="button"
            onClick={() => setActive(value => !value)}
            className={`
              relative h-6 w-11 rounded-full
              transition
              ${active
                ? "bg-orange-500"
                : "bg-zinc-300 dark:bg-zinc-700"}
            `}
          >
            <span
              className={`
                absolute top-1 h-4 w-4 rounded-full
                bg-white shadow-sm transition
                ${active ? "left-6" : "left-1"}
              `}
            />
          </button>
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            {active ? "Active" : "Inactive"}
          </span>
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
          onClick={handleSave}
          disabled={saving}
          className="
            inline-flex items-center gap-2 rounded-xl
            bg-orange-500 px-4 py-2.5 text-sm font-medium
            text-white shadow-sm transition
            hover:bg-orange-600
            disabled:cursor-not-allowed
            disabled:opacity-60
        "
        >
          <Save className="h-4 w-4" />

          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
      
      {error && (
        <div className="
          rounded-xl border border-red-200
          bg-red-50 px-3 py-2.5 text-sm text-red-700
          dark:border-red-900/40 dark:bg-red-950/20
          dark:text-red-300
        ">
          {error}
        </div>
      )}
    </section>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </label>

      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className="
          w-full rounded-xl border border-zinc-200
          bg-white px-3 py-2.5 text-sm text-zinc-900
          outline-none transition
          focus:border-orange-400 focus:ring-2
          focus:ring-orange-500/10
          dark:border-zinc-700 dark:bg-zinc-900
          dark:text-zinc-100
        "
      />
    </div>
  );
}