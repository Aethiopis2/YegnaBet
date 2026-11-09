interface ButtonProps {
    label: string;
    type?: "submit" | "reset" | "button";
    onClick?: () => void;
}

const Button = ({ label, type, onClick }: ButtonProps) => {
  return (
    <button type={type} onClick={onClick} className="mt-3 w-fit min-w-25 self-start
        rounded-sm border-none outline-none
        px-6 py-2.5
        cursor-pointer font-semibold text-sm
        bg-yegna-600 text-white
        hover:bg-[#20663C]
        active:opacity-80
        transition-all duration-300

        dark:bg-[#FF851B] dark:text-[#241305]
        dark:hover:bg-[#FFA43A]
        dark:shadow-[0_0_0.875rem_rgba(255,133,27,0.18)]
        dark:hover:shadow-[0_0_1.375rem_rgba(255,133,27,0.4)]
    ">
        {label}
    </button>
  )
}

export default Button