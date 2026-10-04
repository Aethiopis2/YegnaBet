import { useEffect, useState } from "react";
import { HeroSection } from "../../components/discovery/HeroSection"
import { AppShell } from "../../components/layout/AppShell"
import { PageContainer } from "../../components/layout/PageContainer"
import type { ListingMode } from "../../types/customer/listings";
import { TransactionMode } from "../../components/explorer/listing/TransactionMode";
import type { TaxonomyNode } from "../../types/common/taxonomy";
import Loading from "../../components/ui/common/Loading";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { CategoryCard } from "../../components/discovery/CategoryCard";
import { useLocation } from "react-router-dom";
import { getTaxonomyLeafNodes } from "../../lib/customer/customerApi";
import ErrorBlock from "../../components/ui/common/ErrorBlock";

const CategorySectionPage = () => {
    const location = useLocation();

    const [listingMode, setListingMode] = useState<ListingMode>("Buy");
    const [categories, setCategories] = useState<TaxonomyNode[]>(
        location.state?.categories || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <ErrorBlock message={error} />;
    }

    return (
        <AppShell currentUser={location.state?.currentUser}>
            <PageContainer>
                <HeroSection />
                
                <TransactionMode
                    value={listingMode}
                    onChange={(val:ListingMode) => setListingMode(val)} />

                <section className="mt-8">
                    <SectionHeader
                        title="All Categories"
                        actionLabel=""
                        actionHref={""}
                        currentUser={location.state?.currentUser} />
            
                    <div className="mt-4 grid grid-cols-7 overflow-x-auto scrollbar-none">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                route={`/categories/${category.name}`}
                                listingMode={listingMode}
                                currentUser={location.state?.currentUser}
                            />
                        ))}
                    </div>
                </section>
            </PageContainer>
        </AppShell>
    )
}

export default CategorySectionPage