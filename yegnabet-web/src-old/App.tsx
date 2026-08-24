import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/customer/HomePage'
import ListingDetailsPage from './pages/customer/ListingDetailsPage'
import CategoryPage from './pages/customer/CategoryPage'
import SearchPage from './pages/customer/SearchPage'
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import ProviderListingsPage from './pages/provider/ProviderListingsPage'
import ProviderCreateListingPage from './pages/provider/ProviderCreateListingPage'
import ProviderDashboardPage from './pages/provider/ProviderDashboardPage'

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

                <Route
                    path='/employee'
                    element={<EmployeeDashboard />}
                />

                <Route 
                    path="/provider" 
                    element={<ProviderDashboardPage />} 
                />
                
                <Route 
                    path="/provider/listings" 
                    element={<ProviderListingsPage />} 
                />

                <Route 
                    path="/provider/listings/new" 
                    element={<ProviderCreateListingPage />} 
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App