export function SubmissionSuccess() {

    return (
        <main className="
            flex
            min-h-screen
            items-center
            justify-center
            bg-stone-50
            p-6
        ">

            <div className="
                w-full
                max-w-md
                rounded-3xl
                border
                border-stone-200
                bg-white
                p-8
                text-center
                shadow-sm
            ">

                <div className="
                    mx-auto
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-amber-50
                    text-2xl
                ">
                    ◐
                </div>

                <h1 className="
                    mt-5
                    text-xl
                    font-semibold
                    text-stone-900
                ">
                    Submitted for verification
                </h1>

                <p className="
                    mt-2
                    text-sm
                    leading-6
                    text-stone-500
                ">
                    Your listing has been sent to Yegna Bet.
                    An employee will review the information before
                    it becomes available to customers.
                </p>

                <a
                    href="/provider"
                    className="
                        mt-6
                        inline-flex
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
                    Back to dashboard
                </a>

            </div>

        </main>
    );
}