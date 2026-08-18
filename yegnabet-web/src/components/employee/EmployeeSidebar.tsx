import { SidebarItem } from "./SidebarItem";

export function EmployeeSidebar() {
    return (
        <aside className="
            fixed
            inset-y-0
            left-0
            z-40
            w-64
            border-r
            border-stone-200
            bg-white
        ">

            <div className="
                flex
                h-16
                items-center
                border-b
                border-stone-200
                px-6
            ">
                <div>
                    <div className="
                        text-lg
                        font-bold
                        text-stone-900
                    ">
                        Yegna Bet
                    </div>

                    <div className="
                        text-xs
                        text-stone-400
                    ">
                        Operations
                    </div>
                </div>
            </div>


            <nav className="p-4">

                <SidebarItem
                    icon="▦"
                    label="Dashboard"
                    active
                />

                <SidebarItem
                    icon="↗"
                    label="Requests"
                />

                <SidebarItem
                    icon="⌂"
                    label="Listings"
                />

                <div className="
                    my-4
                    border-t
                    border-stone-100
                " />

                <SidebarItem
                    icon="▥"
                    label="Reports"
                />

                <SidebarItem
                    icon="⚙"
                    label="Settings"
                />

            </nav>

        </aside>
    );
}