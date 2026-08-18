interface ProviderSummaryCardProps {
    label: string;
    value: number;
    description: string;
}

export function ProviderSummaryCard({
    label,
    value,
    description
}: ProviderSummaryCardProps) {
    return (
        <div className="
            rounded-2xl
            border
            border-stone-200
            bg-white
            p-5
        ">
            <div className="text-sm text-stone-500">
                {label}
            </div>

            <div className="
                mt-2
                text-3xl
                font-semibold
                text-stone-900
            ">
                {value}
            </div>

            <div className="
                mt-1
                text-xs
                text-stone-400
            ">
                {description}
            </div>
        </div>
    );
}