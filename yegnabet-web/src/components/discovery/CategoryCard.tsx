import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/cn";
import type { ListingMode } from "../../types/customer/listings";
import type { TaxonomyNode } from "../../types/common/taxonomy";

interface CategoryCardProps {
  category: TaxonomyNode;
  route: string;
  className?: string;
  listingMode?: ListingMode;
}

export function CategoryCard({ category, route, className, listingMode }: CategoryCardProps) {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate(route + `?mode=${listingMode}`)}
      className={cn("group w-20.5 shrink-0", "text-center", className)}>
        
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-white/5">
        <img src={category.image} alt={category.description}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy" />

        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent 
          opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <span className="mt-2 block truncate text-xs font-medium text-gray-700 dark:text-gray-300">
        {category.name}
      </span>
    </button>
  );
}