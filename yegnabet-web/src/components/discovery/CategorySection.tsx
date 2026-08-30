import { useEffect, useState } from "react";

import { SectionHeader } from "../ui/SectionHeader";
import { CategoryCard } from "./CategoryCard";
import { API } from "../../types/api";
import type { Category } from "../../types/category";

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
        API.get(`/categories/`).then(r => setCategories(r.data));
    }, []);

  return (
    <section className="mt-8">
      <SectionHeader
        title="Browse by Category"
        actionLabel="View all"
        actionHref="/categories"
      />

      <div
        className="
          mt-4
          flex gap-4
          overflow-x-auto
          pb-1
          scrollbar-none
        "
      >
        {categories.slice(0, 5).map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
          />
        ))}

        <CategoryCard
          category={{
            id: "more",
            name: "More",
            description: "All categories",
            image: "assets/images/categories/more.jpg",
            type: "service",
            route: "/categories",
          }}
        />
      </div>
    </section>
  );
}