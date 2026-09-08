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
import ProviderDashboard from "../pages/provider/ProviderDashboard";
import CreateListingPage from "../pages/provider/CreateListingPage";
import EditListingPage from "../pages/provider/EditListingPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/explore"
        element={<ExplorePage />}
      />

      <Route
        path="/categories/:category"
        element={<CategoryPage />}
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

      <Route
        path="/profile"
        element={<ProfilePage />}
      />

      <Route
        path="/employee"
        element={<EmployeeDashboardPage />}
      />

      <Route
        path="/employee/taxonomies"
        element={<TaxonomiesPage />}
      />

      <Route
        path="/owner"
        element={<OwnerDashboard />}
      />

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
    </Routes>
  );
}