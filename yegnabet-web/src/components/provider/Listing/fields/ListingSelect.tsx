import type { SelectHTMLAttributes } from "react";

interface Props
extends SelectHTMLAttributes<HTMLSelectElement> {
label: string;
hint?: string;
children: React.ReactNode;
}

export function ListingSelect({
label,
hint,
children,
...props
}: Props) {
return ( <div> <label
     className="
       block
       text-sm
       font-semibold
       text-slate-800
       dark:text-white
     "
   >
{label} </label>

  {hint && (
    <p
      className="
        mt-1
        text-xs
        text-slate-400
        dark:text-slate-500
      "
    >
      {hint}
    </p>
  )}

  <select
    {...props}
    className="
      mt-2
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
    {children}
  </select>
</div>

);
}
