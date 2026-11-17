import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { cn } from "../../lib/cn";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onSearch?: (search: string) => void;
}

export function SearchBar({
  className,
  placeholder = "Search houses, land, services...",
  value = "",
  onSearch,
}: SearchBarProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState(value);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = search.trim();
    if (onSearch) {
      onSearch(term);
      return;
    }

    const params = new URLSearchParams();
    if (term) params.set("search", term);
    navigate(`/explore${params.size ? `?${params.toString()}` : ""}`);
  };

  return (
    <form
      onSubmit={submit}
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

      <input
        type="search"
        value={search}
        onChange={event => setSearch(event.target.value)}
        aria-label="Search listings"
        className="
          min-w-0 flex-1
          truncate
          text-left text-sm
          text-gray-400
          outline-none
          dark:text-gray-500"
          placeholder={placeholder}
      />

      <button
        type="button"
        aria-label="Search listings"
        type="submit"
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
        <Search className="size-[18px]" />
      </button>
    </form>
  );
}
