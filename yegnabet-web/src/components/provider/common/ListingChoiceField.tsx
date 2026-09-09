import type {
  ListingAttributeFieldProps,
} from "../../../types/provider/attributeDefinition";

export function ListingChoiceField({
  attribute,
  value,
  onChange,
}: ListingAttributeFieldProps) {
  const options = attribute.options ?? {};

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4

        dark:border-white/10
        dark:bg-white/2.5
      "
    >
      <label className="text-sm font-semibold text-slate-800 dark:text-white">
        {attribute.label}
      </label>

      <select
        value={String(value ?? "")}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          mt-3
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          px-4 py-3
          text-sm
          text-slate-900
          outline-none

          focus:border-emerald-600
          focus:ring-2
          focus:ring-emerald-600/10

          dark:border-white/10
          dark:bg-slate-950
          dark:text-white

          dark:focus:border-orange-400
          dark:focus:ring-orange-400/10
        "
      >
        <option value="">
          Select {attribute.label.toLowerCase()}
        </option>

        {Object.entries(options).map(
          ([key, label]) => (
            <option
              key={key}
              value={key}
            >
              {label}
            </option>
          )
        )}
      </select>
    </div>
  );
}