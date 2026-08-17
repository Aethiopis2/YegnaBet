import { useNavigate } from "react-router-dom";
import type { CategoryCardProps } from "../../services/CategoryCardProps";

const CategoryCard = ({id, name, image, count}: CategoryCardProps) => {
    const navigate = useNavigate();

    return (
        <button className="group relative h-40 overflow-hidden rounded-3xl text-left shadow-sm transition
                duration-300 hover:-translate-y-1hover:shadow-lg" style={{
            backgroundImage: `url(${image})`}} 
            onClick={() => navigate(`/category/${id}/${name}`)} >

            <img src={`http://localhost:5150/${image}`} alt={name}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-5">

                <div className="text-lg font-semibold text-white">
                    {name}
                </div>

                {count !== undefined && (
                    <div className="mt-1 text-sm text-white/70">
                        {count} listings
                    </div>
                )}

            </div>

        </button>
    );
}

export default CategoryCard