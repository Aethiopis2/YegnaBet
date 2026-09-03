import { useNavigate } from "react-router-dom";

import { cn } from "../../lib/cn";
import type { Category } from "../../types/category";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({
  category,
  className,
}: CategoryCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(category.route)}
      className={cn(
        "group w-20.5 shrink-0",
        "text-center",
        className
      )}
    >
      <div
        className="
          relative aspect-square overflow-hidden
          rounded-2xl
          bg-gray-100
          dark:bg-white/5
        "
      >
        <img
          src={category.image}
          alt={category.name}
          className="
            size-full object-cover
            transition-transform duration-500
            group-hover:scale-110
          "
          loading="lazy"
        />

        <div
          className="
            absolute inset-0
            bg-linear-to-t
            from-black/20
            via-transparent
            to-transparent
            opacity-0
            transition-opacity duration-300
            group-hover:opacity-100
          "
        />
      </div>

      <span
        className="
          mt-2 block
          truncate
          text-xs font-medium
          text-gray-700
          dark:text-gray-300
        "
      >
        {category.name}
      </span>
    </button>
  );
}