interface ActivityItemProps {
    text: string;
    time: string;
    type: "success" | "pending";
}

export function ActivityItem({
    text,
    time,
    type
}: ActivityItemProps) {

    return (
        <div className="
            flex
            items-center
            justify-between
            border-b
            border-stone-100
            px-5
            py-4
            last:border-0
        ">

            <div className="flex items-center gap-3">

                <div className={`
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    ${
                        type === "success"
                            ? "bg-green-50 text-green-600"
                            : "bg-amber-50 text-amber-600"
                    }
                `}>
                    {type === "success" ? "✓" : "◐"}
                </div>

                <span className="
                    text-sm
                    text-stone-700
                ">
                    {text}
                </span>

            </div>

            <span className="
                text-xs
                text-stone-400
            ">
                {time}
            </span>

        </div>
    );
}