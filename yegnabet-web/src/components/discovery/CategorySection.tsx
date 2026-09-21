import { useEffect, useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { CategoryCard } from "./CategoryCard";
import { ASSET_URL } from "../../types/api";
import type { ListingMode } from "../../types/customer/listings";
import Loading from "../ui/common/Loading";
import { Fetch } from "../../lib/common/network";
import type { TaxonomyNode } from "../../types/common/taxonomy";
import { getLeafNodes } from "../../lib/common/taxonomyFunctions";

interface CategoryProps {
  listingMode: ListingMode;
  setDialog: any;
}

export function CategorySection({listingMode, setDialog}: CategoryProps) {
  const [categories, setCategories] = useState<TaxonomyNode[]>([]);
  const [loading, setLoading] = useState(true);
  const url = '/categories';    // api path

  const onSuccess = (category: TaxonomyNode[]) => {
    const nodes = getLeafNodes(category[0]);
    
    // fix up the images in nodes relative to asset url
    nodes.forEach(node => {
      node.image = ASSET_URL + node.image;
    });

    setCategories(nodes);
  };

  useEffect(() => {
    Fetch(url, onSuccess, setLoading, setDialog);
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
        actionHref={`/categories?mode=${listingMode}`} />

      <div className="mt-4 flex gap-4 overflow-x-auto pb-1 scrollbar-none">
        {categories.slice(0, 5).map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            route={`/categories/${category.name}`}
            listingMode={listingMode}
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
          listingMode={listingMode} />
      </div>
    </section>
  );
}