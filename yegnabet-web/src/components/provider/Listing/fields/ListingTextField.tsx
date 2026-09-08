interface Props
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function ListingTextField({
  label,
  hint,
  ...props
}: Props) {
  return (
    <div>
      <label
        className="
          block
          text-sm
          font-semibold
          text-slate-800
          dark:text-white
        "
      >
        {label}
      </label>

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

      <input
        {...props}
        className={`
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
          transition-all

          placeholder:text-slate-400

          focus:border-emerald-600
          focus:ring-2
          focus:ring-emerald-600/10

          dark:border-white/10
          dark:bg-white/3
          dark:text-white
          dark:placeholder:text-slate-600

          dark:focus:border-orange-400
          dark:focus:ring-orange-400/10
        `}
      />
    </div>
  );
}