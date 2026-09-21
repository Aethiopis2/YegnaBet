import React, { useEffect, useState } from 'react'
import { AppShell } from '../../components/layout/AppShell'
import { PageContainer } from '../../components/layout/PageContainer'
import { HeroSection } from '../../components/discovery/HeroSection'
import { TransactionMode } from '../../components/explorer/listing/TransactionMode'
import type { ListingMode } from '../../types/customer/listings'
import { OkDialog } from '../../components/ui/common/okDialog'
import { SectionHeader } from '../../components/ui/SectionHeader'
import type { ListingLocation } from '../../types/common/location'
import { Fetch } from '../../lib/common/network'
import Loading from '../../components/ui/common/Loading'
import { PopularLocationCard } from '../../components/explorer/PopularLocationCard'

const LocationsSectitonPage = () => {
    const [listingMode, setListingMode] = useState<ListingMode>("Buy");
    const [dialog, setDialog] = useState({
        open: false,
        message: ""
    });
    const [locations, setLocations] = useState<ListingLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const url = `listings/get-listing-locations`;

    const onSuccess = (locs:ListingLocation[]) => {
        setLocations(locs);
    };

    useEffect(() => {
        Fetch(url, onSuccess, setLoading, setDialog);
    }, []);

    if (loading)
        return <Loading />

    return (
        <AppShell>
            <PageContainer>
                <HeroSection />
                
                <TransactionMode
                    value={listingMode}
                    onChange={(val:ListingMode) => setListingMode(val)} />

                <section className="mt-6">
                    <SectionHeader
                    title="Popular Locations"
                    actionLabel="All Locations"
                    actionHref=""
                    />
            
                    <div className="mt-3 grid grid-cols-7 overflow-x-auto pb-1 scrollbar-none">
                    {locations.map((location) => (
                        <PopularLocationCard
                        key={location.id}
                        location={location}
                        filters={{}}
                        setFilters={()=>{}}
                        />
                    ))}
                    </div>
                </section>

                <OkDialog
                open={dialog.open}
                message={dialog.message}
                onOk={() =>
                    setDialog({
                    open: false,
                    message: "",
                    })
                }
                    />
            </PageContainer>
        </AppShell>
    );
}

export default LocationsSectitonPage