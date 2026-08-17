import TrustMeter from './TrustMeter';

export default function ListingCard({ listing, onClick }: any) { 
    return ( 
        <button onClick={onClick} className="w-full bg-white rounded-2xl border p-3 text-left shadow-sm active:scale-[0.99] transition" >
            <div className="h-40 rounded-xl bg-gray-200 mb-3 flex items-center justify-center text-4xl"> 🏠 </div> 
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-semibold text-gray-900">{listing.title}</h3> 
                    <p className="text-sm text-gray-500">📍 {listing.area}</p>
                </div>
                
                {listing.isVerified && ( <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full"> 
                    ✔ Verified </span> )}
            </div>
            <div className="mt-3 flex items-center justify-between">
                <div className="font-bold text-emerald-700">
                    {listing.price?.toLocaleString()} ETB
                    <span className="text-xs text-gray-500">/{listing.priceUnit}</span>
                </div>
                
                <TrustMeter score={listing.trustScore} />
            </div>
        </button>
    );
}