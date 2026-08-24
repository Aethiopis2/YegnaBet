import { Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { cn } from "../lib/cn";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({
  className,
  placeholder = "Search houses, land, services...",
}: SearchBarProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "flex h-14 items-center gap-3",
        "rounded-full border",
        "border-black/6 bg-white",
        "px-5",
        "shadow-[0_5px_25px_rgba(0,0,0,0.06)]",
        "dark:border-white/8 dark:bg-white/5",
        className
      )}
    >
      <Search className="size-5 shrink-0 text-gray-400" />

      <button
        type="button"
        onClick={() => navigate("/search")}
        className="
          min-w-0 flex-1
          truncate
          text-left text-sm
          text-gray-400
          outline-none
          dark:text-gray-500
        "
      >
        {placeholder}
      </button>

      <button
        type="button"
        aria-label="Open filters"
        onClick={() => navigate("/search")}
        className="
          grid size-10 shrink-0 place-items-center
          rounded-full
          bg-yegna-700
          text-white
          transition-transform duration-200
          hover:scale-105
          active:scale-95
        "
      >
        <SlidersHorizontal className="size-[18px]" />
      </button>
    </div>
  );
}