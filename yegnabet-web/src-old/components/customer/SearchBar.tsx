const SearchBar = () => {
  return (
        <div className="
            flex
            items-center
            gap-3
            rounded-2xl
            bg-white
            px-4
            py-4
            shadow-sm
            ring-1
            ring-stone-200
            transition
            focus-within:ring-2
            focus-within:ring-stone-400
        ">

            <span className="text-xl text-stone-400">
                🔍
            </span>

            <input
                type="text"
                placeholder="Search homes, land, people or services..."
                className="
                    w-full
                    bg-transparent
                    text-base
                    text-stone-900
                    outline-none
                    placeholder:text-stone-400
                "
            />

        </div>
    );
}

export default SearchBar