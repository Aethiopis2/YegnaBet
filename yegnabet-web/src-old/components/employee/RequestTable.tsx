import { RequestStatusBadge } from "./RequestStatusBadge";

const requests = [
    {
        id: 1042,
        customer: "Abebe Kebede",
        listing: "Modern House near Bole",
        type: "Rent",
        status: "Pending",
        time: "8 min ago"
    },
    {
        id: 1041,
        customer: "Meron Samuel",
        listing: "Professional Cleaner",
        type: "Service",
        status: "Contact",
        time: "17 min ago"
    },
    {
        id: 1040,
        customer: "Tobby Girma",
        listing: "Land near Bishoftu",
        type: "Sale",
        status: "Review",
        time: "31 min ago"
    }
];


const RequestTable = ({setSelectedRequest}) => {
    return (
        <div className="
            overflow-hidden
            rounded-2xl
            border
            border-stone-200
            bg-white
        ">

            <div className="
                flex
                items-center
                justify-between
                border-b
                border-stone-200
                px-6
                py-4
            ">

                <div>
                    <h2 className="
                        font-semibold
                        text-stone-900
                    ">
                        Requests requiring attention
                    </h2>

                    <p className="
                        mt-1
                        text-xs
                        text-stone-400
                    ">
                        Process the most recent customer requests
                    </p>
                </div>

                <button className="
                    text-sm
                    font-medium
                    text-stone-600
                    hover:text-stone-900
                ">
                    View all →
                </button>

            </div>


            <table className="w-full">

                <thead>
                    <tr className="
                        border-b
                        border-stone-100
                        text-left
                        text-xs
                        uppercase
                        tracking-wide
                        text-stone-400
                    ">
                        <th className="px-6 py-3">Request</th>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Listing</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Time</th>
                    </tr>
                </thead>

                <tbody>

                    {requests.map(request => (
                        <tr
                            key={request.id}
                            onClick={() => setSelectedRequest(request)}
                            className="
                                cursor-pointer
                                border-b
                                border-stone-100
                                transition
                                hover:bg-stone-50
                            "
                        >

                            <td className="
                                px-6
                                py-4
                                text-sm
                                font-medium
                                text-stone-900
                            ">
                                #{request.id}
                            </td>

                            <td className="
                                px-6
                                py-4
                                text-sm
                                text-stone-600
                            ">
                                {request.customer}
                            </td>

                            <td className="
                                max-w-xs
                                truncate
                                px-6
                                py-4
                                text-sm
                                text-stone-600
                            ">
                                {request.listing}
                            </td>

                            <td className="
                                px-6
                                py-4
                                text-sm
                                text-stone-500
                            ">
                                {request.type}
                            </td>

                            <td className="px-6 py-4">
                                <RequestStatusBadge
                                    status={request.status}
                                />
                            </td>

                            <td className="
                                px-6
                                py-4
                                text-xs
                                text-stone-400
                            ">
                                {request.time}
                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default RequestTable