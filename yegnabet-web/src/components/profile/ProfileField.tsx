interface ProfileFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;

  onChange: (
    value: string
  ) => void;
}

export function ProfileField({
  label,
  value,
  placeholder,
  type = "text",
  disabled = false,
  onChange,
}: ProfileFieldProps) {
  return (
    <label className="block">
      <span className="text-[10px] font-medium text-gray-400">
        {label}
      </span>

      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          mt-1.5
          h-11
          w-full
          rounded-xl
          border
          border-black/[0.06]
          bg-gray-50
          px-3
          text-sm
          text-gray-900
          outline-none
          transition
          placeholder:text-gray-300
          focus:border-yegna-600
          focus:bg-white

          disabled:cursor-not-allowed
          disabled:opacity-60

          dark:border-white/[0.07]
          dark:bg-white/[0.035]
          dark:text-white
          dark:placeholder:text-gray-600
          dark:focus:bg-white/[0.05]
        "
      />
    </label>
  );
}