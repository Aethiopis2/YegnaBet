import { useEffect, useState } from "react";
import { ProviderListingCard } from "../../components/provider/ProviderListingCard";
import type { ProviderListing } from "../../services/ProviderListingProps";
import { API } from "../../services/api";

export default function ProviderListingsPage() {
    const userId = 57;
    const [listings, setListings] = useState<ProviderListing[]>([]);

    useEffect(() => {
        API.get(`/listings/provider-listings?providerId=${userId}`).then(r => setListings(r.data));
    }, []);
    
    return (
        <main className="min-h-screen bg-stone-50 p-6 lg:p-8">

            <div className="mx-auto max-w-7xl">

                <div className="flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-semibold text-stone-900">
                            My Listings
                        </h1>

                        <p className="mt-1 text-sm text-stone-500">
                            Manage your properties and services.
                        </p>
                    </div>

                    <a
                        href="/provider/listings/new"
                        className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-800">
                        + Add listing
                    </a>

                </div>


                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {listings.map(listing => (
                        <ProviderListingCard
                            key={listing.id}
                            listing={listing}
                        />
                    ))}

                </div>

            </div>

        </main>
    );
}