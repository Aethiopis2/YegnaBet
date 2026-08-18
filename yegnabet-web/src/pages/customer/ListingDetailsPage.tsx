import { useNavigate, useParams } from "react-router-dom"
import { API, ASSET_URL } from "../../services/api";
import { useEffect, useState } from "react";
import type { ListingFullProps } from "../../services/ListingCardProps";

const ListingDetailsPage = () => {
    const navigate = useNavigate();
    const { listingId } = useParams();

    const [listing, setListing] = useState<ListingFullProps>({} as ListingFullProps);

    useEffect(() => {
        API.get(`/listings/${listingId}`).then(r => setListing(r.data))}, []);

    return (
        <main className="min-h-screen text-stone50">
            <div className="mx-auto max-width-5xl px-4 py-6 sm:px-6">
                <button className="mb-5 tex-sm text-stone-500" onClick={() => navigate(-1)}>
                    ← Back
                </button>

                {/* Hero */}
                <div className="relative h-[55vh] min-h-[400px] overflow-hidden rounded-[2em] bg-cover bg-center" 
                    style={{backgroundImage: `url(${ASSET_URL}${listing.image})`}}>

                    <div className="absoulte inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white">
                        {listing.isVerified && (
                            <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs 
                            font-semibold text-stone-800">
                                ✓ Verified
                            </span>
                        )}

                        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                            {listing.providerName} - {listing.title}
                        </h1>

                        <p className="mt-1 text-white/70">
                            {listing.area}
                        </p>
                    </div>
                </div>

                {/* Information */}
                <section className="py-8">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <div className="text-3xl font-bold text-stone-900">
                                {listing.price && listing.price.toLocaleString()} ETB
                            </div>

                            <div className="text-sm text-stone-500">
                                per {listing.priceUnit}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-stone-200">
                            <div className="text-xs text-stone-500">
                                Trust Score
                            </div>

                            <div className="text-xl font-semibold text-stone-900">
                                ★ {listing.trustScore}
                            </div>
                        </div>

                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-stone-900">
                            About this listing
                        </h2>

                        <p className="mt-3 leading-7 text-stone-500">
                            This listing is currently available through Yegna Bet. Request contact
                            and one of our representatives will assist you.
                        </p>
                    </div>
                </section>

            </div>

            {/* Contact CTA */}
            <div className="sticky bottom-0 border-t border-stone-200 bg-white/95 p-4 backdrop-blur">
                <div className="mx-auto max-w-5xl">
                    <button className="w-full-rounded-2xl bg-stone-900 px-6 py-4 text-base font-semibold 
                    text-white shadow-lg transition hove:bg-stone-800 active scale-[0.99">
                        Request Contact
                    </button>
                </div>
            </div>
        </main>
    );
}

export default ListingDetailsPage