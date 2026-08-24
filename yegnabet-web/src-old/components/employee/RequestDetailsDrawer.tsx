import { RequestStatusBadge } from "./RequestStatusBadge";

interface Request {
    id: number;
    customer: string;
    listing: string;
    type: string;
    status: string;
    time: string;
}

interface RequestDetailsDrawerProps {
    request: Request | null;
    onClose: () => void;
}

export function RequestDetailsDrawer({
    request,
    onClose
}: RequestDetailsDrawerProps) {

    if (!request)
        return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="
                    fixed
                    inset-0
                    z-40
                    bg-black/20
                "
                onClick={onClose}
            />

            {/* Drawer */}
            <aside
                className="
                    fixed
                    right-0
                    top-0
                    z-50
                    h-full
                    w-[440px]
                    border-l
                    border-stone-200
                    bg-white
                    shadow-2xl
                "
            >

                {/* Header */}
                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-stone-200
                    px-6
                    py-5
                ">

                    <div>
                        <div className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-wide
                            text-stone-400
                        ">
                            Request
                        </div>

                        <h2 className="
                            mt-1
                            text-lg
                            font-semibold
                            text-stone-900
                        ">
                            #{request.id}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-2
                            text-xl
                            text-stone-400
                            hover:bg-stone-100
                            hover:text-stone-700
                        "
                    >
                        ×
                    </button>

                </div>


                {/* Content */}
                <div className="
                    h-[calc(100%-160px)]
                    overflow-y-auto
                    px-6
                    py-6
                ">

                    {/* Customer */}
                    <section>
                        <div className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-wide
                            text-stone-400
                        ">
                            Customer
                        </div>

                        <div className="
                            mt-2
                            text-base
                            font-semibold
                            text-stone-900
                        ">
                            {request.customer}
                        </div>

                        <div className="
                            mt-1
                            text-sm
                            text-stone-500
                        ">
                            Customer requesting contact
                        </div>
                    </section>


                    <div className="
                        my-6
                        border-t
                        border-stone-100
                    " />


                    {/* Listing */}
                    <section>
                        <div className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-wide
                            text-stone-400
                        ">
                            Listing
                        </div>

                        <div className="
                            mt-2
                            text-base
                            font-semibold
                            text-stone-900
                        ">
                            {request.listing}
                        </div>

                        <div className="
                            mt-1
                            text-sm
                            text-stone-500
                        ">
                            {request.type}
                        </div>
                    </section>


                    <div className="
                        my-6
                        border-t
                        border-stone-100
                    " />


                    {/* Current status */}
                    <section>

                        <div className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-wide
                            text-stone-400
                        ">
                            Current status
                        </div>

                        <div className="mt-3">

                            <RequestStatusBadge
                                status={request.status}
                            />

                        </div>

                    </section>


                    <div className="
                        my-6
                        border-t
                        border-stone-100
                    " />


                    {/* Notes */}
                    <section>

                        <div className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-wide
                            text-stone-400
                        ">
                            Employee notes
                        </div>

                        <textarea
                            placeholder="Add notes about this request..."
                            className="
                                mt-3
                                h-28
                                w-full
                                resize-none
                                rounded-xl
                                border
                                border-stone-200
                                bg-stone-50
                                p-3
                                text-sm
                                outline-none
                                transition
                                focus:border-stone-400
                                focus:bg-white
                            "
                        />

                    </section>

                </div>


                {/* Footer */}
                <div className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    border-t
                    border-stone-200
                    bg-white
                    p-4
                ">

                    <div className="
                        flex
                        gap-3
                    ">

                        <button
                            className="
                                flex-1
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-red-700
                                hover:bg-red-100
                            "
                        >
                            Reject
                        </button>

                        <button
                            className="
                                flex-1
                                rounded-xl
                                bg-stone-900
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-white
                                hover:bg-stone-800
                            "
                        >
                            Process Request
                        </button>

                    </div>

                </div>

            </aside>
        </>
    );
}