const EmployeeHeader = () => {
    return (
        <header className="
            fixed
            left-64
            right-0
            top-0
            z-30
            flex
            h-16
            items-center
            justify-end
            border-b
            border-stone-200
            bg-white/95
            px-6
            backdrop-blur
        ">

            <div className="
                flex
                items-center
                gap-4
            ">

                <button className="
                    relative
                    rounded-full
                    p-2
                    text-stone-500
                    hover:bg-stone-100
                ">
                    🔔

                    <span className="
                        absolute
                        right-1
                        top-1
                        h-2
                        w-2
                        rounded-full
                        bg-red-500"
                    />
                </button>


                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    <div className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        bg-stone-200
                        font-semibold
                        text-stone-700
                    ">
                        AB
                    </div>

                    <div className="hidden sm:block">
                        <div className="
                            text-sm
                            font-medium
                            text-stone-900
                        ">
                            Abebe
                        </div>

                        <div className="
                            text-xs
                            text-stone-400
                        ">
                            Employee
                        </div>
                    </div>

                </div>

            </div>

        </header>
    );
}

export default EmployeeHeader