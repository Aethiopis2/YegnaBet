import { Routes, Route } from "react-router-dom";

import  HomePage  from "../pages/HomePage";
import { ExplorePage } from "../pages/ExplorePage";
import { CategoryPage } from "../pages/CategoryPage";
import { ListingDetailPage } from "../pages/ListingDetailPage";

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
    </Routes>
  );
}