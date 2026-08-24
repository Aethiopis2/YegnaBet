interface ProviderStatusBadgeProps {
    status: string;
}

export function ProviderStatusBadge({
    status
}: ProviderStatusBadgeProps) {

    const styles: Record<string, string> = {
        Active: "bg-green-50 text-green-700 ring-green-200",
        Pending: "bg-amber-50 text-amber-700 ring-amber-200",
        Rejected: "bg-red-50 text-red-700 ring-red-200",
        Suspended: "bg-stone-100 text-stone-600 ring-stone-200"
    };

    return (
        <span className={`
            inline-flex
            items-center
            rounded-full
            px-2.5
            py-1
            text-xs
            font-medium
            ring-1
            ring-inset
            ${styles[status] ?? styles.Suspended}
        `}>
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
}