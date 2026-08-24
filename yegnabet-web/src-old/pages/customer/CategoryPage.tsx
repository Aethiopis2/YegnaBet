import { useNavigate, useParams } from 'react-router-dom'
import ListingCard from '../../components/customer/ListingCard';
import { useEffect, useState } from 'react';
import { API } from '../../services/api';
import type { ListingCardProps } from '../../services/ListingCardProps';


const CategoryPage = () => {
    const navigate = useNavigate();
    const { categoryId, categoryName } = useParams();


    const [listings, setListings] = useState<ListingCardProps[]>([]);

    useEffect(() => {
        API.get(`/listings?categoryId=${categoryId}`).then(r => setListings(r.data));
    }, []);


    return (
        <main className="min-h-screen bg-stone-50">

            <div className="
                mx-auto
                max-w-7xl
                px-4
                py-6
                sm:px-6
                lg:px-8
            ">

                {/* Header */}
                <div className="mb-8">

                    <button
                        onClick={() => navigate(-1)}
                        className="
                            mb-5
                            text-sm
                            text-stone-500
                            hover:text-stone-900
                        "
                    >
                        ← Back
                    </button>

                    <h1 className="
                        text-3xl
                        font-semibold
                        tracking-tight
                        text-stone-900
                    ">
                        {categoryName}
                    </h1>

                    <p className="
                        mt-1
                        text-stone-500
                    ">
                        Find what you're looking for.
                    </p>

                </div>


                {/* Listings */}
                <div className="
                    grid
                    grid-cols-1
                    gap-5
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                ">

                    {listings.map(listing => (
                        <ListingCard
                            key={listing.id}
                            {...listing}
                            // onClick={() =>
                            //     navigate(`/listing/${listing.id}`)
                            // }
                        />
                    ))}

                </div>

            </div>

        </main>
    );
}

export default CategoryPage