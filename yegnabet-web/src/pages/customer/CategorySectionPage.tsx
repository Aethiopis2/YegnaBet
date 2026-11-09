import { useEffect, useState } from "react";
import { HeroSection } from "../../components/discovery/HeroSection"
import { AppShell, useAppContext } from "../../components/layout/AppShell"
import { PageContainer } from "../../components/layout/PageContainer"
import {  type ListingMode } from "../../types/customer/listings";
import { TransactionMode } from "../../components/explorer/listing/TransactionMode";
import type { TaxonomyNode } from "../../types/customer/taxonomy";
import Loading from "../../components/ui/common/Loading";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { CategoryCard } from "../../components/discovery/CategoryCard";
import { useLocation, } from "react-router-dom";
import { getTaxonomyLeafNodes } from "../../lib/customer/customerApi";
import ErrorBlock from "../../components/ui/common/ErrorBlock";

const CategorySectionPageComponent = () => {
    const location = useLocation();

    const [categories, setCategories] = useState<TaxonomyNode[]>(
        location.state?.categories || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [listingMode, setListingMode] = useState<ListingMode>(
        location.state?.listingMode ?? "Buy"
    );
    
    const { user } = useAppContext();

    useEffect(() => {
        const getCategories = async () => {
            try {
                setLoading(true);
                const taxonomy = await getTaxonomyLeafNodes();
                setCategories(taxonomy);
            } catch (err) {
                console.error(err);
                setError(String(err));
            } finally {
                setLoading(false);
            }
        }
        
        if (!location.state?.categories)
            getCategories();
    }, [categories]);

    
    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <ErrorBlock message={error} />;
    }

    return (
        <PageContainer>
            <HeroSection />
            
            <TransactionMode
                value={listingMode}
                onChange={(val) => setListingMode(val)} />

            <section className="mt-8">
                <SectionHeader
                    title="All Categories"
                    listingMode={listingMode}
                    actionLabel="Home"
                    actionHref={"/"}
                    user={user ?? location.state?.currentUser}
                    categories={categories} />
        
                <div className="mt-4 grid grid-cols-7 overflow-x-auto scrollbar-none">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            route={`/categories/${category.name}`}
                            listingMode={listingMode}
                            user={location.state?.currentUser}
                        />
                    ))}
                </div>
            </section>
        </PageContainer>
    )
}

export default function CategorySectionPage() {
    return (
        <AppShell>
            <CategorySectionPageComponent />
        </AppShell>
    )
}