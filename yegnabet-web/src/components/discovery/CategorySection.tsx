import { useEffect, useState } from "react";

import { SectionHeader } from "../ui/SectionHeader";
import { CategoryCard } from "./CategoryCard";
import { API, ASSET_URL } from "../../types/api";
import type { Category } from "../../types/category";
import type { ListingMode } from "../../types/listings";
import Loading from "../ui/Loading";

export function CategorySection({listingMode}: { listingMode: ListingMode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/categories/`)
      .then((r) => {
        // correct image url if since its always relative
        setLoading(true);
        r.data.forEach((cat:Category) => {
          if (cat.image) {
            cat.image = ASSET_URL + cat.image;
          }
        })
        
        setCategories(r.data);
      })
      .catch((error) => {
        console.error("Failed to load listing", error);
        setCategories([]);
      })
      .finally(() => {
        setLoading(false);
      });
    }, []);

  if (loading) {
      return (
        <Loading />
      );
    }

  return (
    <section className="mt-8">
      <SectionHeader
        title="Browse by Category"
        actionLabel="View all"
        actionHref={`/categories?mode=${listingMode}`}
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
            listingMode={listingMode}
          />
        ))}

        <CategoryCard
          category={{
            id: "more",
            name: "More",
            description: "All categories",
            image: ASSET_URL + "assets/images/categories/more.jpg",
            type: "service",
            route: "/categories",
          }}
        />
      </div>
    </section>
  );
}