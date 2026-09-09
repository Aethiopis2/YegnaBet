import type {
  ListingAttributeFieldProps,
} from "../../../types/provider/attributeDefinition";

export function ListingMultiChoiceField({
  attribute,
  value,
  onChange,
}: ListingAttributeFieldProps) {
  const options = attribute.options ?? {};

  const selected = Array.isArray(value)
    ? value.map(String)
    : [];

  function toggle(key: string) {
    if (selected.includes(key)) {
      onChange(
        selected.filter(
          (item) => item !== key
        ) as any
      );

      return;
    }

    onChange([
      ...selected,
      key,
    ] as any);
  }

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
      <div className="text-sm font-semibold text-slate-800 dark:text-white">
        {attribute.label}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries(options).map(
          ([key, label]) => {
            const active =
              selected.includes(key);

            return (
              <button
                key={key}
                type="button"
                onClick={() =>
                  toggle(key)
                }
                className={`
                  rounded-xl
                  border
                  px-3
                  py-2
                  text-xs
                  font-semibold
                  transition-colors

                  ${
                    active
                      ? `
                        border-emerald-600
                        bg-emerald-600
                        text-white

                        dark:border-orange-400
                        dark:bg-orange-400
                        dark:text-slate-950
                      `
                      : `
                        border-slate-200
                        bg-white
                        text-slate-600
                        hover:bg-slate-50

                        dark:border-white/10
                        dark:bg-white/5
                        dark:text-slate-300
                        dark:hover:bg-white/10
                      `
                  }
                `}
              >
                {label}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}