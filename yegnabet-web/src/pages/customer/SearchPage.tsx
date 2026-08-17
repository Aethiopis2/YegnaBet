import { useNavigate } from "react-router-dom"
import ListingCard from "../../components/ListingCard-old";

const SearchPage = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const query = params.get("q") ?? "";

  const results = demoListings.filter(x =>
      x.title.toLowerCase().includes(query.toLowerCase()) ||
      x.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 lg:px-8">
        <button className="mb-6 text-sm text-stone-500" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className="text-3x font-semibold text-stone-900">
          Search Results
        </h1>

        <p className="m-1 text-stone-500">
          Results for "{query}"
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map(listing => (
            <ListingCard key={listing.id} {...listing} onClick={() => navigate(`/listing/${listing.id}`)} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default SearchPage