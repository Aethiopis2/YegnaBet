
import type {
  TaxonomyFilterDefinition,
} from "../../types/customer/explorer";

interface AttributeFiltersProps {
  definitions: TaxonomyFilterDefinition[];

  values: Record<
    string,
    string | number | boolean
  >;

  onChange: (
    values: Record<
      string,
      string | number | boolean
    >
  ) => void;
}

export function AttributeFilters({
  definitions,
  values,
  onChange,
}: AttributeFiltersProps) {

  const update = (
    key: string,
    value: string | number | boolean | undefined
  ) => {
    const next = { ...values };

    if (value === undefined || value === "") {
      delete next[key];
    } else {
      next[key] = value;
    }

    onChange(next);
  };

  const controlClass = `
    rounded-full border
    border-gray-200 dark:border-white/10
    bg-white dark:bg-white/[0.04]
    px-3 py-2 text-sm
    text-gray-700 dark:text-gray-200
    outline-none
  `;

  return (
    <>
      {definitions
        .filter(attribute =>
          Boolean(attribute.key && attribute.name)
        )
        .map(attribute => {
          const value = values[attribute.key];

          return (
            <div
              key={attribute.id}
              className="shrink-0"
            >
              {attribute.dataType === "number" && (
                <label className={`
                  flex items-center gap-2
                  ${controlClass}
                `}>
                  <span className="whitespace-nowrap">
                    {attribute.name}
                  </span>

                  <input
                    type="number"
                    min={attribute.min}
                    max={attribute.max}
                    value={value === undefined ? "" : String(value)}
                    placeholder="Any"
                    onChange={event => {
                      const raw = event.target.value;

                      update(
                        attribute.key,
                        raw === ""
                          ? undefined
                          : Number(raw)
                      );
                    }}
                    className="
                      w-16 bg-transparent
                      text-right outline-none
                      placeholder:text-gray-400
                    "
                  />

                  {attribute.unit && (
                    <span className="text-xs text-gray-400">
                      {attribute.unit}
                    </span>
                  )}
                </label>
              )}

              {attribute.dataType === "boolean" && (
                <select
                  value={
                    value === undefined
                      ? ""
                      : String(value)
                  }
                  onChange={event => {
                    const raw = event.target.value;

                    update(
                      attribute.key,
                      raw === ""
                        ? undefined
                        : raw === "true"
                    );
                  }}
                  className={controlClass}
                >
                  <option value="">
                    {attribute.name}: Any
                  </option>

                  <option value="true">
                    {attribute.name}: Yes
                  </option>

                  <option value="false">
                    {attribute.name}: No
                  </option>
                </select>
              )}

              {attribute.dataType === "select" && (
                <select
                  value={String(value ?? "")}
                  onChange={event =>
                    update(
                      attribute.key,
                      event.target.value || undefined
                    )
                  }
                  className={controlClass}
                >
                  <option value="">
                    {attribute.name}: Any
                  </option>

                  {attribute.options?.map(option => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
    </>
  );
}
