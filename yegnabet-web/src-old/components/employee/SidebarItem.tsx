interface SidebarItemProps {
    icon: string;
    label: string;
    active?: boolean;
}

export function SidebarItem({
    icon,
    label,
    active = false
}: SidebarItemProps) {
    return (
        <button
            className={`
                mb-1
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-left
                text-sm
                font-medium
                transition
                ${
                    active
                        ? "bg-stone-900 text-white"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }
            `}
        >
            <span className="w-5 text-center">
                {icon}
            </span>

            <span>
                {label}
            </span>
        </button>
    );
}