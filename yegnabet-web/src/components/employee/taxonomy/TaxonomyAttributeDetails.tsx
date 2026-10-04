import { useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";

import type {
  TaxonomyAttribute,
  TaxonomyAttributeType,
} from "../../../types/common/taxonomy";

import type { UpdateTaxonomyAttributeRequest } from "../../../types/common/taxonomy";

import {
  deleteTaxonomyAttribute,
  updateTaxonomyAttribute,
} from "../../../lib/employee/taxonomyApi";

import { ConfirmDialog } from "../../common/ConfrimationDialog";

interface Props {
  nodeId: string | null;
  attribute: TaxonomyAttribute | null;
  onSaved: (attribute: TaxonomyAttribute) => void;
  onDeleted: (attributeId: string) => void;
}

export function TaxonomyAttributeDetails({
  nodeId,
  attribute,
  onSaved,
  onDeleted,
}: Props) {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [type, setType] = useState<TaxonomyAttributeType | "string">("string");

  const [required, setRequired] = useState(false);
  const [searchable, setSearchable] = useState(false);
  const [filterable, setFilterable] = useState(false);

  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [options, setOptions] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
   * Load the selected attribute into the local editor.
   *
   * Changes made here do NOT modify the parent state until
   * Save Changes is pressed.
   */
  useEffect(() => {
    if (!attribute) {
      setName("");
      setKey("");
      setType("string");

      setRequired(false);
      setSearchable(false);
      setFilterable(false);

      setMinValue("");
      setMaxValue("");
      setOptions("");

      setError(null);

      return;
    }

    setName(attribute.name);
    setKey(attribute.key);
    setType(attribute.type);

    setRequired(attribute.required);
    setSearchable(attribute.searchable);
    setFilterable(attribute.filterable);

    setMinValue(
      attribute.minValue === undefined
        ? ""
        : String(attribute.minValue)
    );

    setMaxValue(
      attribute.maxValue === undefined
        ? ""
        : String(attribute.maxValue)
    );

    setOptions(attribute.options?.join(", ") ?? "");

    setError(null);
  }, [attribute]);

  /*
   * Nothing selected.
   */
  if (!attribute) {
    return (
      <div
        className="
          flex min-h-[240px]
          items-center justify-center
          rounded-2xl
          border border-zinc-800
          bg-zinc-900/40
          p-8
          text-center
        "
      >
        <div>
          <div className="mb-2 text-sm font-medium text-zinc-400">
            No attribute selected
          </div>

          <p className="text-xs text-zinc-600">
            Select an attribute to view and edit its details.
          </p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!nodeId) {
      setError("No taxonomy category is selected.");
      return;
    }

    if (!name.trim()) {
      setError("Attribute name is required.");
      return;
    }

    if (!key.trim()) {
      setError("Attribute key is required.");
      return;
    }

    const parsedMin =
      minValue.trim() === ""
        ? undefined
        : Number(minValue);

    const parsedMax =
      maxValue.trim() === ""
        ? undefined
        : Number(maxValue);

    if (
      parsedMin !== undefined &&
      Number.isNaN(parsedMin)
    ) {
      setError("Minimum value must be a valid number.");
      return;
    }

    if (
      parsedMax !== undefined &&
      Number.isNaN(parsedMax)
    ) {
      setError("Maximum value must be a valid number.");
      return;
    }

    if (
      parsedMin !== undefined &&
      parsedMax !== undefined &&
      parsedMin > parsedMax
    ) {
      setError(
        "Minimum value cannot be greater than maximum value."
      );
      return;
    }

    const parsedOptions =
      type === "choice"
        ? options
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)
        : [];

    const request: UpdateTaxonomyAttributeRequest = {
      name: name.trim(),
      key: key.trim().toLowerCase(),
      type: type as UpdateTaxonomyAttributeRequest["type"],

      required,
      searchable,
      filterable,

      minValue:
        type === "integer" || type === "decimal"
          ? parsedMin
          : undefined,

      maxValue:
        type === "integer" || type === "decimal"
          ? parsedMax
          : undefined,

      options: parsedOptions,
    };

    setSaving(true);
    setError(null);

    try {
      await updateTaxonomyAttribute(
        nodeId,
        attribute.id,
        request
      );

      const updatedAttribute: TaxonomyAttribute = {
        ...attribute,

        name: request.name,
        key: request.key,
        type: request.type,

        required: request.required,
        searchable: request.searchable,
        filterable: request.filterable,

        minValue: request.minValue,
        maxValue: request.maxValue,

        options: request.options ?? [],
      };

      onSaved(updatedAttribute);
    } catch (err) {
      console.error(err);

      setError(
        "Failed to save the attribute. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!nodeId) {
      setError("No taxonomy category is selected.");
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await deleteTaxonomyAttribute(
        nodeId,
        attribute.id
      );

      setDeleteOpen(false);

      onDeleted(attribute.id);
    } catch (err) {
      console.error(err);

      setError(
        "Failed to delete the attribute. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div
        className="
          overflow-hidden
          rounded-2xl
          border border-zinc-800
          bg-zinc-900/60
        "
      >
        {/* Header */}
        <div
          className="
            flex items-center justify-between
            border-b border-zinc-800
            px-5 py-4
          "
        >
          <div>
            <h3 className="text-sm font-semibold text-white">
              Attribute Details
            </h3>

            <p className="mt-1 text-xs text-zinc-500">
              Configure how this attribute behaves.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            disabled={deleting || saving}
            className="
              rounded-xl
              p-2
              text-red-400
              transition
              hover:bg-red-500/10
              hover:text-red-300
              disabled:pointer-events-none
              disabled:opacity-40
            "
            title="Delete attribute"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-5">
          {/* Error */}
          {error && (
            <div
              className="
                rounded-xl
                border border-red-500/20
                bg-red-500/10
                px-4 py-3
                text-sm text-red-300
              "
            >
              {error}
            </div>
          )}

          {/* Name + Key */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Name">
              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Attribute name"
                className={inputClass}
              />
            </Field>

            <Field label="Key">
              <input
                type="text"
                value={key}
                onChange={(event) =>
                  setKey(event.target.value)
                }
                placeholder="attribute_key"
                className={inputClass}
              />
            </Field>
          </div>

          {/* Type */}
          <Field label="Type">
            <select
              value={type}
              onChange={(event) =>
                setType(
                  event.target.value as TaxonomyAttributeType
                )
              }
              className={inputClass}
            >
              <option value="text">Text</option>
              <option value="integer">Integer</option>
              <option value="decimal">Decimal</option>
              <option value="boolean">Boolean</option>
              <option value="choice">Choice</option>
            </select>
          </Field>

          {/* Numeric range */}
          {(type === "integer" || type === "decimal") && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Minimum Value">
                <input
                  type="number"
                  value={minValue}
                  onChange={(event) =>
                    setMinValue(event.target.value)
                  }
                  placeholder="No minimum"
                  className={inputClass}
                />
              </Field>

              <Field label="Maximum Value">
                <input
                  type="number"
                  value={maxValue}
                  onChange={(event) =>
                    setMaxValue(event.target.value)
                  }
                  placeholder="No maximum"
                  className={inputClass}
                />
              </Field>
            </div>
          )}

          {/* Choice options */}
          {type === "choice" && (
            <Field
              label="Options"
              hint="Separate options with commas."
            >
              <input
                type="text"
                value={options}
                onChange={(event) =>
                  setOptions(event.target.value)
                }
                placeholder="Single, Double, Triple"
                className={inputClass}
              />

              {options.trim() && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {options
                    .split(",")
                    .map((value) => value.trim())
                    .filter(Boolean)
                    .map((value, index) => (
                      <span
                        key={`${value}-${index}`}
                        className="
                          rounded-lg
                          border border-zinc-700
                          bg-zinc-800
                          px-2.5 py-1
                          text-xs text-zinc-300
                        "
                      >
                        {value}
                      </span>
                    ))}
                </div>
              )}
            </Field>
          )}

          {/* Flags */}
          <div
            className="
              rounded-xl
              border border-zinc-800
              bg-zinc-950/40
              divide-y divide-zinc-800
            "
          >
            <ToggleRow
              label="Required"
              description="The provider must supply this value."
              checked={required}
              onChange={setRequired}
            />

            <ToggleRow
              label="Searchable"
              description="Include this attribute when searching."
              checked={searchable}
              onChange={setSearchable}
            />

            <ToggleRow
              label="Filterable"
              description="Allow customers to filter by this attribute."
              checked={filterable}
              onChange={setFilterable}
            />
          </div>

          {/* Save */}
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || deleting}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-orange-500
                px-4 py-2.5
                text-sm font-semibold
                text-white
                shadow-lg
                shadow-orange-500/10
                transition
                hover:bg-orange-400
                active:scale-[0.97]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Save size={16} />

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete attribute?"
        message={`Remove "${attribute.name}" from this category? Existing listing values will be preserved.`}
        confirmText="Delete"
        cancelText="Cancel"
        busy={deleting}
        onCancel={() => {
          if (!deleting) {
            setDeleteOpen(false);
          }
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}


/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const inputClass = `
  w-full
  rounded-xl
  border border-zinc-700
  bg-zinc-950/60
  px-3 py-2.5
  text-sm text-white
  outline-none
  transition
  placeholder:text-zinc-600
  hover:border-zinc-600
  focus:border-orange-500
  focus:ring-1
  focus:ring-orange-500/30
`;


interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({
  label,
  hint,
  children,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <div>
        <label className="text-xs font-medium text-zinc-300">
          {label}
        </label>

        {hint && (
          <p className="mt-0.5 text-[11px] text-zinc-600">
            {hint}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}


interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: ToggleRowProps) {
  return (
    <label
      className="
        flex cursor-pointer
        items-center justify-between
        gap-4
        px-4 py-3.5
        transition
        hover:bg-zinc-900
      "
    >
      <div className="min-w-0">
        <div className="text-sm font-medium text-zinc-200">
          {label}
        </div>

        <div className="mt-0.5 text-xs text-zinc-500">
          {description}
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={(event) => {
          event.preventDefault();
          onChange(!checked);
        }}
        className={`
          relative
          h-6 w-11
          shrink-0
          rounded-full
          transition
          ${
            checked
              ? "bg-orange-500"
              : "bg-zinc-700"
          }
        `}
      >
        <span
          className={`
            absolute
            top-1
            h-4 w-4
            rounded-full
            bg-white
            shadow
            transition-transform
            ${
              checked
                ? "translate-x-6"
                : "translate-x-1"
            }
          `}
        />
      </button>
    </label>
  );
}