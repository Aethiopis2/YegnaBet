import { CategoryGrid } from "../../components/customer/CategoryGrid";
import SearchBar from "../../components/customer/SearchBar";

const HomePage = () => {
    return (
        <div className="min-h-screen bg-stone-50">
            <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
                <header className="flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-bold tracking-tight text-stone-900">
                            Yegna Bet
                        </div>

                        <div className="text-sm text-stone-500">
                            Find what you need, anyplace, anytime!
                        </div>
                    </div>

                    <button className="rounded-full bg-white p-3 shadow-sm ring-1 ring-stone-200">
                        <span className="text-lg">☰</span>
                    </button>
                </header>

                <div className="mt-8">
                    <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-stone-900 sm:text-xl">
                        <p className="mt-4 max-w-lg text-base leading-7 text-stone-500">
                            Homes, land, professionals, and services - all connected through Yegna Bet.
                        </p>
                    </h1>
                </div>

                <div className="mt-7">
                    <SearchBar />
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-5 flex items-end justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-stone-900">
                            Explore
                        </h2>

                        <p className="text-sm text-stone-500">
                            What are you looking for?
                        </p>
                    </div>
                </div>

                <CategoryGrid />
            </section>
        </div>
    );
}

export default HomePage