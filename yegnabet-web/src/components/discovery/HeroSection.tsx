import { SearchBar } from "../navigation/SearchBar";

export function HeroSection() {
  return (
    <section className="relative pt-7 sm:pt-10">
      <div
        className="
          absolute
          -right-8 top-0
          hidden h-72 w-72
          rounded-full
          bg-yegna-200/30
          blur-3xl
          dark:bg-yegna-900/20
          lg:block
        "
      />

      <div
        className="
          relative overflow-hidden
          rounded-[2rem]
          bg-[#edf3ed]
          dark:bg-[#16201a]
        "
      >
        <div className="relative min-h-[280px] sm:min-h-[330px]">
          <img
            src="/images/listings/hero-house.jpg"
            alt="Modern home"
            className="
              absolute inset-y-0 right-0
              h-full
              w-[58%]
              object-cover
              object-left
              sm:w-[55%]
            "
          />

          <div
            className="
              absolute inset-0
              bg-gradient-to-r
              from-[#edf3ed]
              via-[#edf3ed]/95
              via-45%
              to-transparent
              dark:from-[#16201a]
              dark:via-[#16201a]/95
            "
          />

          <div className="relative z-10 flex min-h-[280px] max-w-xl flex-col justify-center px-5 py-8 sm:min-h-[330px] sm:px-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-yegna-700 dark:text-yegna-300">
              Your journey starts here
            </p>

            <h1
              className="
                max-w-md
                text-3xl
                font-bold
                leading-[1.05]
                tracking-[-0.045em]
                text-gray-900
                dark:text-white
                sm:text-4xl
              "
            >
              Find what you need,
              <br />
              <span className="text-yegna-700 dark:text-yegna-400">
                anyplace, anytime!
              </span>
            </h1>

            <p className="mt-4 max-w-sm text-xs leading-5 text-gray-500 dark:text-gray-400 sm:text-sm">
              Homes, land, professionals,
              and services — all connected
              through Yegna Bet.
            </p>

            <SearchBar
              className="
                relative z-20
                mt-6
                max-w-xl
                bg-white/95
                dark:bg-[#202a24]/95
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}