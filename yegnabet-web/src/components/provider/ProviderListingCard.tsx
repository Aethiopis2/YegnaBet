import { ProviderStatusBadge } from "./ProviderStatusBadge";

interface ProviderListing {
    id: number;
    title: string;
    type: string;
    price: number;
    priceUnit: string;
    status: string;
    image: string;
}

interface ProviderListingCardProps {
    listing: ProviderListing;
}

export function ProviderListingCard({
    listing
}: ProviderListingCardProps) {

    return (
        <div className="
            overflow-hidden
            rounded-2xl
            border
            border-stone-200
            bg-white
        ">

            <div className="relative h-40">

                <img
                    src={listing.image}
                    alt={listing.title}
                    className="
                        h-full
                        w-full
                        object-cover
                    "
                />

                <div className="
                    absolute
                    right-3
                    top-3
                ">
                    <ProviderStatusBadge
                        status={listing.status}
                    />
                </div>

            </div>


            <div className="p-4">

                <h3 className="
                    truncate
                    font-semibold
                    text-stone-900
                ">
                    {listing.title}
                </h3>

                <div className="
                    mt-1
                    text-sm
                    text-stone-500
                ">
                    {listing.type}
                </div>

                <div className="
                    mt-3
                    text-sm
                    font-medium
                    text-stone-800
                ">
                    {listing.price.toLocaleString()} / {listing.priceUnit}
                </div>

            </div>

        </div>
    );
}