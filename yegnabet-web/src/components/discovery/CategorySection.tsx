import { useEffect, useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { CategoryCard } from "./CategoryCard";
import { ASSET_URL } from "../../types/api";
import type { ListingMode } from "../../types/customer/listings";
import Loading from "../ui/common/Loading";
import type { TaxonomyNode } from "../../types/common/taxonomy";
import { getTaxonomyLeafNodes } from "../../lib/customer/customerApi";
import ErrorBlock from "../ui/common/ErrorBlock";
import type { UserProfile } from "../../types/customer/profile";

interface CategoryProps {
  listingMode: ListingMode;
  currentUser: UserProfile | null;
}

export function CategorySection({listingMode, currentUser}: CategoryProps) {
  const [categories, setCategories] = useState<TaxonomyNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const taxonomy = await getTaxonomyLeafNodes();
        setCategories(taxonomy);
      } catch (err) {
        console.error(err);
        setError(String(err));
      } finally {
        setLoading(false);
      }
    }

    getCategories();
  }, []);

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <ErrorBlock message={error} />
  }

  return (
    <section className="mt-8">
      <SectionHeader
        title="Browse by Category"
        actionLabel="View all"
        actionHref={`/categories?mode=${listingMode}`}
        currentUser={currentUser}
        categories={categories} />

      <div className="mt-4 flex gap-4 overflow-x-auto pb-1 scrollbar-none">
        {categories.slice(0, 5).map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            route={`/categories/${category.name}`}
            listingMode={listingMode}
            currentUser={currentUser}
          />
        ))}

        <CategoryCard
          category={{
            id: -1,
            name: "More",
            slug: "more",
            description: "All categories",
            image: ASSET_URL + "/assets/images/categories/more.jpg",
            children: []
          }}
          route="/categories"
          listingMode={listingMode}
          currentUser={currentUser} />
      </div>
    </section>
  );
}