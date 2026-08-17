import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import type { CategoryCardProps } from "../../services/CategoryCardProps";
import { API } from '../../services/api';

export function CategoryGrid() {
    const [categories, setCategories] = useState<CategoryCardProps[]>([]);

    useEffect(() => {
        API.get(`/categories/`).then(r => setCategories(r.data));
    }, []);
    
    return (
        <div className="
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
            lg:grid-cols-4
        ">
            {categories.map(category => (
                <CategoryCard
                    key={category.id}
                    {...category}
                />
            ))}
        </div>
    );
}