import CategoryCard from "./CategoryCard";

export function CategoryGrid() {

    const categories = [
        {
            name: "Houses",
            image: "assets/pictures/category-icons/house-icon.png",
            count: 246
        },
        {
            name: "Apartments",
            image: "assets/pictures/category-icons/apartment-icon.png",
            count: 184
        },
        {
            name: "Land",
            image: "assets/pictures/category-icons/land-icon.png",
            count: 128
        },
        {
            name: "Cleaners",
            image: "assets/pictures/category-icons/cleaner-icon.png",
            count: 96
        },
        {
            name: "Electricians",
            image: "assets/pictures/category-icons/electrician-icon.png",
            count: 74
        },
        {
            name: "Accountants",
            image: "assets/pictures/category-icons/accountant-icon.png",
            count: 51
        }
    ];

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
                    key={category.name}
                    {...category}
                />
            ))}
        </div>
    );
}