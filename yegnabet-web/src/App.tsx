import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/customer/HomePage'
import ListingDetailsPage from './pages/customer/ListingDetailsPage'
import CategoryPage from './pages/customer/CategoryPage'
import SearchPage from './pages/customer/SearchPage'

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route
                    path="/category/:categoryId/:categoryName"
                    element={<CategoryPage />}
                />

                <Route
                    path="/search"
                    element={<SearchPage />}
                />

                <Route
                    path="/listing/:listingId"
                    element={<ListingDetailsPage />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App