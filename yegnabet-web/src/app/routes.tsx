import { Routes, Route } from "react-router-dom";

import  HomePage  from "../pages/HomePage";
import { ExplorePage } from "../pages/ExplorePage";
import { CategoryPage } from "../pages/CategoryPage";
import { ListingDetailPage } from "../pages/ListingDetailPage";
import { FindMyMatchPage } from "../pages/FindMyMatchPage";
import { MatchPreferencesPage } from "../pages/MatchPreferencesPage";
import { MatchResultsPage } from "../pages/MatchResultsPage";
import { MyRequestsPage } from "../pages/MyRequestPage";
import { RequestPropertyPage } from "../pages/RequestPropertyPage";

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
    </Routes>
  );
}