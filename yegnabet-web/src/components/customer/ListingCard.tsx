import { useNavigate, useParams } from "react-router-dom";
import { API } from "../../services/api";
import type { ListingCardProps } from "../../services/ListingCardProps";

const ListingCard = ({
    title,
    area,
    price,
    priceUnit,
    image,
    trustScore,
    isVerified,
  }: ListingCardProps) => {

    const navigate = useNavigate();
    const { listingId } = useParams();

    return (
      <button className="group relative h-72 w-full overflow-hidden 
        rounded-3xl bg-cover bg-center text-left shadow-sm transition duration-300 hover:translate-y-1 hover:shadow-xl"
        onClick={() => navigate(`/listing/${listingId}`)}
        style={{backgroundImage: `url(http://localhost:5150/${image})`}}>

          {/* Image shadding */}
          {isVerified && (
            <div className="absoulte left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs 
            font-semi-bold text-stone-800 backdrop-blur">
              ✓ Verified
            </div>
          )}

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-stone-500">
            <div className="text-lg font-semibold">
              {title}
            </div>

            <div className="mt-1 text-small text-white/70">
              {area}
            </div>

            <div className="mt-3 flex items-end justify-between">
              <div>
                <span className="text-xl font-bold">
                  {price.toLocaleString()}
                </span>

                <span className="mt-1 text-small text-white/70">
                  ETB/{priceUnit}
                </span>
              </div>

              <div className="rounded-full bg-black/30 px-3 py-1 text-xs backdrop-blur">
                  ★ {trustScore}
              </div>

            </div>
          </div>
      </button>
    );
}

export default ListingCard