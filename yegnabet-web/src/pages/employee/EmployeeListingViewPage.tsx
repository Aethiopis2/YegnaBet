import { EmployeeShell, useAppContext } from '../../components/employee/EmployeeShell'
import { Explorer } from '../../components/explorer/Explorer';

function EmployeeListingViewPageComponent() {
    const { user, } = useAppContext();

    return (
        <Explorer
            config={{
                title: "View Listings",
                subtitle:
                    `${user?.fullName}, here are all the listings`,
                showPopularLocations: true,
                showModeTabs: true,
                showFilters: true,
                initialView: "grid",
                mode: "All",
                filters: { status: "All" },
                showMode: false,
                user: user ?? undefined,
            }}
        />
    )
}


const EmployeeListingViewPage = () => {
  return (
    <EmployeeShell>
      <EmployeeListingViewPageComponent />
    </EmployeeShell>
  )
}

export default EmployeeListingViewPage;