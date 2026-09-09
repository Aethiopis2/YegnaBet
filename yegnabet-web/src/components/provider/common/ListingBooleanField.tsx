import type {
  ListingAttributeFieldProps,
} from "../../../types/provider/attributeDefinition";

export function ListingBooleanField({
  attribute,
  value,
  onChange,
}: ListingAttributeFieldProps) {
  const checked = Boolean(value);

  return (
    <div
      className="
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4

        dark:border-white/10
        dark:bg-white/2.5
      "
    >
      <span className="text-sm font-semibold text-slate-800 dark:text-white">
        {attribute.label}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative
          h-7
          w-12
          rounded-full
          transition-colors

          ${
            checked
              ? "bg-emerald-600 dark:bg-orange-400"
              : "bg-slate-200 dark:bg-white/10"
          }
        `}
      >
        <span
          className={`
            absolute
            top-1
            h-5
            w-5
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
    </div>
  );
}