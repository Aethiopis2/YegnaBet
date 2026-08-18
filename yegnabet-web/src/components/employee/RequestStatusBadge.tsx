interface RequestStatusBadgeProps {
    status: string;
}

export function RequestStatusBadge({
    status
}: RequestStatusBadgeProps) {

    const styles: Record<string, string> = {
        Pending: `
            bg-amber-50
            text-amber-700
            ring-1
            ring-inset
            ring-amber-200
        `,

        Contact: `
            bg-blue-50
            text-blue-700
            ring-1
            ring-inset
            ring-blue-200
        `,

        Review: `
            bg-purple-50
            text-purple-700
            ring-1
            ring-inset
            ring-purple-200
        `,

        Completed: `
            bg-green-50
            text-green-700
            ring-1
            ring-inset
            ring-green-200
        `,

        Rejected: `
            bg-red-50
            text-red-700
            ring-1
            ring-inset
            ring-red-200
        `
    };

    return (
        <span
            className={`
                inline-flex
                items-center
                rounded-full
                px-2.5
                py-1
                text-xs
                font-medium
                ${styles[status] ?? `
                    bg-stone-100
                    text-stone-600
                    ring-1
                    ring-inset
                    ring-stone-200
                `}
            `}
        >
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />

            {status}
        </span>
    );
}