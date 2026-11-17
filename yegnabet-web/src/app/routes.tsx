import { Routes, Route } from "react-router-dom";

import  HomePage  from "../pages/customer/HomePage";
import { ExplorePage } from "../pages/customer/ExplorePage";
import { CategoryPage } from "../pages/customer/CategoryPage";
import { ListingDetailPage } from "../pages/customer/ListingDetailPage";
import { FindMyMatchPage } from "../pages/customer/FindMyMatchPage";
import { MatchPreferencesPage } from "../pages/customer/MatchPreferencesPage";
import { MatchResultsPage } from "../pages/customer/MatchResultsPage";
import { MyRequestsPage } from "../pages/customer/MyRequestPage";
import { RequestPropertyPage } from "../pages/customer/RequestPropertyPage";
import { InboxPage } from "../pages/customer/InboxPage";
import { ProfilePage } from "../pages/customer/ProfilePage";
import { TaxonomiesPage } from "../pages/employee/TaxonomiesPage";
import { EmployeeDashboardPage } from "../pages/employee/EmployeeDashboardPage";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import CreateListingPage from "../pages/employee/CreateListingPage";
import CategorySectionPage from "../pages/customer/CategorySectionPage";
import LoginPage from "../pages/auth/LoginPage";
import { RequireAuth } from "../auth/RequireAuth";
import LocationsSectionPage from "../pages/customer/LocationsSectionPage";
import SignUpPage from "../pages/auth/SignupPage";
import { EmployeeRequestsPage } from "../pages/employee/EmployeeRequestsPage";
import { EmployeeRequestDetailsPage } from "../pages/employee/EmployeeRequestsDetailsPage";
import EmployeeListingViewPage from "../pages/employee/EmployeeListingViewPage";
import AddEmployeePage from "../pages/employee/AddEmployeePage";
import EmployeeDirectoryPage from "../pages/employee/EmployeeDirectoryPage";
import EditEmployeePage from "../pages/employee/EditEmployeePage";
import ProviderDirectoryPage from "../pages/employee/ProviderDirectoryPage";
import ProviderFormPage from "../pages/employee/ProviderFormPage";
import EmployeeDealsPage from "../pages/employee/EmployeeDealsPage";
import OwnerListings from "../pages/owner/BulidOwnerListings";
import PasswordResetPage from "../pages/auth/PasswordResetPage";
import ProviderListingsPage from "../pages/employee/ProviderListingsPage";
import OwnerCommissionsPage from "../pages/owner/OwnerCommissionsPage";

export function AppRoutes() {
  return (
    <Routes>

      {/* ------------------------------------------------ */}
      {/* Public */}
      {/* ------------------------------------------------ */}

      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/explore"
        element={<ExplorePage />}
      />

      <Route
        path="/categories"
        element={<CategorySectionPage />}
      />

      <Route
        path="/categories/:category"
        element={<CategoryPage />}
      />
      
      <Route
        path="/locations"
        element={<LocationsSectionPage />}
      />

      <Route
        path="/listing/:id"
        element={<ListingDetailPage />}
      />

      <Route
        path="/find-my-match"
        element={<FindMyMatchPage />}
      />

      <Route
        path="/match/preferences"
        element={<MatchPreferencesPage />}
      />

      <Route
        path="/match/results"
        element={<MatchResultsPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route path="/forgot-password" element={<PasswordResetPage />} />
      <Route path="/reset-password" element={<PasswordResetPage />} />

      <Route
        path="/Signup"
        element={<SignUpPage />}
      />

      {/* ------------------------------------------------ */}
      {/* Customer */}
      {/* ------------------------------------------------ */}

      <Route element={<RequireAuth />}>
        <Route
          path="/profile"
          element={<ProfilePage />}
        />
      </Route>

      <Route element={<RequireAuth roles={["Customer"]} />}>
        <Route
          path="/requests"
          element={<MyRequestsPage />}
        />

        <Route
          path="/requests/property"
          element={<RequestPropertyPage />}
        />

        <Route
          path="/inbox"
          element={<InboxPage />}
        />

      </Route>

      {/* ------------------------------------------------ */}
      {/* Employee */}
      {/* ------------------------------------------------ */}

      <Route element={<RequireAuth roles={["Employee"]} />}>

        <Route
          path="/employee/employees/new"
          element={<AddEmployeePage />}
        />

        <Route
          path="/employee/employees"
          element={<EmployeeDirectoryPage />}
        />

        <Route
          path="/employee/employees/:employeeId/edit"
          element={<EditEmployeePage />}
        />

        <Route path="/employee/providers" element={<ProviderDirectoryPage />} />
        <Route path="/employee/providers/new" element={<ProviderFormPage />} />
        <Route path="/employee/providers/:providerId/edit" element={<ProviderFormPage />} />
        <Route path="/employee/providers/:providerId/listings" element={<ProviderListingsPage />} />
        <Route path="/employee/profile" element={<ProfilePage employeeMode />} />

        <Route
          path="/employee"
          element={<EmployeeDashboardPage />}
        />

        <Route
          path="/employee/taxonomies"
          element={<TaxonomiesPage />}
        />

        <Route
          path="/employee/create-listing"
          element={<CreateListingPage />}
        />

      <Route
        path="/employee/requests"
        element={
          <EmployeeRequestsPage />
        }
      />

      <Route
        path="/employee/requests/:id"
        element={
          <EmployeeRequestDetailsPage />
        }
      />

      <Route path="/employee/deals" element={<EmployeeDealsPage />} />

      <Route 
        path="/employee/listings"
        element={
          <EmployeeListingViewPage />
        }
      />
      
      </Route>

      {/* ------------------------------------------------ */}
      {/* Owner */}
      {/* ------------------------------------------------ */}

      <Route element={<RequireAuth roles={["Owner"]} />}>

        <Route
          path="/owner"
          element={<OwnerDashboard />}
        />
        
        <Route 
          path="/owner/listings" 
          element={<OwnerListings />} 
        />
        <Route path="/owner/commissions" element={<OwnerCommissionsPage />} />
        <Route path="/owner/commissions/:transactionId" element={<OwnerCommissionsPage />} />
        
      </Route>

      {/* ------------------------------------------------ */}
      {/* Provider */}
      {/* ------------------------------------------------ */}

      {/* <Route element={<RequireAuth roles={["Provider"]} />}>

        <Route
          path="/provider"
          element={<ProviderDashboard />}
        />

        <Route
          path="/provider/listings/create"
          element={<CreateListingPage />}
        />

        <Route
          path="/provider/listings/:id/edit"
          element={<EditListingPage />}
        />

      </Route> */}

    </Routes>
  );
}
