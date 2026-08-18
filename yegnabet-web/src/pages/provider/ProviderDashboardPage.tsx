import { ProviderSummaryCard } from "../../components/provider/ProviderSummaryCard";
import { ProviderListingCard } from "../../components/provider/ProviderListingCard";
import { ActivityItem } from "../../components/provider/ActivityItem";
import { useEffect, useState } from "react";
import type { UserProfileProps } from "../../services/UserProfileProps";
import { API } from "../../services/api";
import type { ProviderListing } from "../../services/ProviderListingProps";



export default function ProviderDashboardPage() {
    const userId = 57; 
    const [user, setUser] = useState({} as UserProfileProps);
    const [listings, setListings] = useState<ProviderListing[]>([]);
    const [activeCount, setActiveCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [requestsCount, setRequestsCount] = useState(0);

    useEffect(()=> {
        API.get(`/user?uid=${userId}`).then(r => setUser(r.data));
        API.get(`/listings/status-count?providerId=${userId}`).then(r => {
            if (r.data.length > 0) {
                setActiveCount(r.data[1].count);
                setPendingCount(r.data[2].count);
                setRequestsCount(r.data[0].count);
            } // end if
        });

        API.get(`/listings/provider-listings?providerId=${userId}`).then(r => setListings(r.data));
    }, []);

    return (
        <div className="min-h-screen bg-stone-50">

            {/* Header */}

            <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-6">

                <div className="text-lg font-bold text-stone-900">
                    Yegna Bet
                </div>

                <div className="flex items-center gap-3">

                    <button className="rounded-full p-2 text-stone-500 hover:bg-stone-100">
                        🔔
                    </button>

                    <div className="flex flex-col">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-200 text-sm font-semibold">
                        </div>
                        
                        <p>{user.role}</p>
                    </div>

                </div>

            </header>


            <main className="mx-auto max-w-7xl p-6 lg:p-8">

                {/* Heading */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h1 className="text-2xl font-semibold text-stone-900">
                            Welcome back, {user.fullName}
                        </h1>

                        <p className="mt-1 text-sm text-stone-500">
                            Here's what's happening with your listings.
                        </p>
                    </div>

                    <button onClick={() => window.location.href ="/provider/listings/new"}
                        className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800">
                        + Add listing
                    </button>

                </div>


                {/* Summary */}

                <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">

                    <ProviderSummaryCard
                        label="Active listings"
                        value={activeCount}
                        description="Currently published"
                    />

                    <ProviderSummaryCard
                        label="Pending"
                        value={pendingCount}
                        description="Awaiting verification"
                    />

                    <ProviderSummaryCard
                        label="Requests"
                        value={requestsCount}
                        description="This month"
                    />

                    <ProviderSummaryCard
                        label="Completed"
                        value={0}
                        description="Successfully completed"
                    />

                </div>


                {/* Listings */}

                <section className="mt-10">

                    <div className="mb-4 flex items-center justify-between">

                        <div>
                            <h2 className="text-lg font-semibold text-stone-900">
                                Your listings
                            </h2>

                            <p className="mt-1 text-sm text-stone-500">
                                Properties and services you've submitted.
                            </p>
                        </div>

                        <a href="/provider/listings"
                            className="text-sm font-medium text-stone-600 hover:text-stone-900">
                            View all →
                        </a>

                    </div>


                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        {listings.slice(0, 3).map(listing => (
                            <ProviderListingCard
                                key={listing.id}
                                listing={listing}
                            />
                        ))}

                    </div>

                </section>


                {/* Activity */}

                <section className="mt-10">

                    <h2 className="text-lg font-semibold text-stone-900">
                        Recent activity
                    </h2>

                    <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white">

                        <ActivityItem
                            text="Your house was verified"
                            time="Today, 10:42"
                            type="success"
                        />

                        <ActivityItem
                            text="Apartment is awaiting verification"
                            time="Yesterday, 16:20"
                            type="pending"
                        />

                        <ActivityItem
                            text="Request #1042 completed"
                            time="Yesterday, 11:08"
                            type="success"
                        />

                    </div>

                </section>

            </main>

        </div>
    );
}