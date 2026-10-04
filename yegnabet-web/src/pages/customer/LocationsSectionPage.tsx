import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { PageContainer } from '../../components/layout/PageContainer'
import { HeroSection } from '../../components/discovery/HeroSection'
import { TransactionMode } from '../../components/explorer/listing/TransactionMode'
import type { ListingMode } from '../../types/customer/listings'
import { SectionHeader } from '../../components/ui/SectionHeader'
import type { ListingLocation } from '../../types/common/location'
import Loading from '../../components/ui/common/Loading'
import { PopularLocationCard } from '../../components/explorer/PopularLocationCard'
import { getLocations } from '../../lib/customer/customerApi'
import ErrorBlock from '../../components/ui/common/ErrorBlock'
import { fromQueryString, toQueryString } from '../../lib/common/utils'


const LocationsSectionPage = () => {
    const navigate = useNavigate();
    const locations = useLocation();
    const [searchParam] = useSearchParams();
    const mode = (searchParam.get("mode") ?? "Buy");
    const queryString = location.search;

    const [listingMode, setListingMode] = useState<ListingMode>(mode as ListingMode);
    const [listingLocations, setListingLocations] = useState<ListingLocation[]>([]);
    const [loading, setLoading] = useState(false);
    const filters = fromQueryString(queryString);
    const [error, setError] = useState("");


    useEffect(() => {
    const loadLocations = async () => {
        setLoading(true);
        try {
            const locs = await getLocations();
            setListingLocations(locs);
        } catch (err) {
            console.error(err);
            setError(String(err));
        }
        finally {
            setLoading(false);
        }
    };

        loadLocations();
    }, []);

    if (loading) return <Loading />

    if (error) return <ErrorBlock message={error} />;

    return (
        <AppShell currentUser={locations.state?.currentUser}>
            <PageContainer>
                <HeroSection />
                
                <TransactionMode
                    value={listingMode}
                    onChange={(val:ListingMode) => setListingMode(val)} />

                <section className="mt-6">
                    <SectionHeader
                        title="Popular Locations"
                        actionLabel=""
                        actionHref=""
                        currentUser={locations.state?.currentUser}
                    />
            
                    <div className="mt-3 grid grid-cols-7 overflow-x-auto pb-1 scrollbar-none">
                        {listingLocations.map((location) => (
                            <div onClick={() => {
                                filters.location = location.area;
                                navigate(`/explore${toQueryString(filters)}` + (mode && `&mode=${mode}`))
                            }}>
                                <PopularLocationCard
                                    key={location.id}
                                    location={location}
                                    filters={{}}
                                    setFilters={() => {}}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </PageContainer>
        </AppShell>
    );
}

export default LocationsSectionPage