interface ListingFormProps {
    type: ListingType;
    onBack: () => void;
    onSubmit: () => void;
}

/*********************** */
type ListingType =
    | "house"
    | "apartment"
    | "land"
    | "service";

/*********************** */

export function ListingForm({
    type,
    onBack,
    onSubmit
}: ListingFormProps) {

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="
                mt-8
                space-y-6
                rounded-2xl
                border
                border-stone-200
                bg-white
                p-6
                shadow-sm
            "
        >

            <div>
                <button
                    type="button"
                    onClick={onBack}
                    className="
                        text-sm
                        text-stone-500
                        hover:text-stone-900
                    "
                >
                    ← Change type
                </button>

                <h2 className="
                    mt-4
                    text-lg
                    font-semibold
                    text-stone-900
                ">
                    {type === "service"
                        ? "Service information"
                        : "Property information"}
                </h2>
            </div>


            <div>
                <label className="
                    text-sm
                    font-medium
                    text-stone-700
                ">
                    Title
                </label>

                <input
                    className="
                        mt-2
                        w-full
                        rounded-xl
                        border
                        border-stone-200
                        px-4
                        py-3
                        text-sm
                        outline-none
                        focus:border-stone-400
                    "
                    placeholder={
                        type === "service"
                            ? "Professional electrician"
                            : "Modern house near Bole"
                    }
                />
            </div>


            <div className="
                grid
                gap-4
                sm:grid-cols-2
            ">

                <div>
                    <label className="
                        text-sm
                        font-medium
                        text-stone-700
                    ">
                        City
                    </label>

                    <select className="
                        mt-2
                        w-full
                        rounded-xl
                        border
                        border-stone-200
                        bg-white
                        px-4
                        py-3
                        text-sm
                    ">
                        <option>Addis Ababa</option>
                        <option>Adama</option>
                        <option>Bishoftu</option>
                        <option>Gondar</option>
                    </select>
                </div>


                <div>
                    <label className="
                        text-sm
                        font-medium
                        text-stone-700
                    ">
                        Area
                    </label>

                    <input
                        className="
                            mt-2
                            w-full
                            rounded-xl
                            border
                            border-stone-200
                            px-4
                            py-3
                            text-sm
                        "
                        placeholder="Bole"
                    />
                </div>

            </div>


            <div>
                <label className="
                    text-sm
                    font-medium
                    text-stone-700
                ">
                    Price
                </label>

                <input
                    type="number"
                    className="
                        mt-2
                        w-full
                        rounded-xl
                        border
                        border-stone-200
                        px-4
                        py-3
                        text-sm
                    "
                    placeholder="25000"
                />
            </div>


            <div>
                <label className="
                    text-sm
                    font-medium
                    text-stone-700
                ">
                    Description
                </label>

                <textarea
                    className="
                        mt-2
                        h-32
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-stone-200
                        px-4
                        py-3
                        text-sm
                    "
                    placeholder="Describe what you are offering..."
                />
            </div>


            <div>
                <label className="
                    text-sm
                    font-medium
                    text-stone-700
                ">
                    Photos / supporting documents
                </label>

                <div className="
                    mt-2
                    flex
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-xl
                    border-2
                    border-dashed
                    border-stone-200
                    p-8
                    text-sm
                    text-stone-400
                    hover:border-stone-300
                ">
                    + Upload files
                </div>
            </div>


            <div className="
                rounded-xl
                bg-amber-50
                p-4
                text-sm
                text-amber-800
            ">
                Your submission will be reviewed by a Yegna Bet
                employee before it becomes visible to customers.
            </div>


            <button
                type="submit"
                className="
                    w-full
                    rounded-xl
                    bg-stone-900
                    px-5
                    py-3
                    text-sm
                    font-medium
                    text-white
                    hover:bg-stone-800
                "
            >
                Submit for verification
            </button>

        </form>
    );
}