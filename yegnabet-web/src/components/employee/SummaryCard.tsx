interface SummaryCardProps {
    label: string;
    value: number;
    description: string;
}

export function SummaryCard({
    label,
    value,
    description
}: SummaryCardProps) {

    return (
        <div className="
            rounded-2xl
            border
            border-stone-200
            bg-white
            p-5
        ">

            <div className="
                text-sm
                text-stone-500
            ">
                {label}
            </div>

            <div className="
                mt-2
                text-3xl
                font-semibold
                tracking-tight
                text-stone-900
            ">
                {value.toLocaleString()}
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