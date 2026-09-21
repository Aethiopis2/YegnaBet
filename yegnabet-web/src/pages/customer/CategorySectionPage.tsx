import { useEffect, useState } from "react";
import { HeroSection } from "../../components/discovery/HeroSection"
import { AppShell } from "../../components/layout/AppShell"
import { PageContainer } from "../../components/layout/PageContainer"
import type { ListingMode } from "../../types/customer/listings";
import { TransactionMode } from "../../components/explorer/listing/TransactionMode";
import { getLeafNodes } from "../../lib/common/taxonomyFunctions";
import type { TaxonomyNode } from "../../types/common/taxonomy";
import { ASSET_URL } from "../../types/api";
import { Fetch } from "../../lib/common/network";
import Loading from "../../components/ui/common/Loading";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { CategoryCard } from "../../components/discovery/CategoryCard";
import { OkDialog } from "../../components/ui/common/okDialog";

const CategorySectionPage = () => {
    const [listingMode, setListingMode] = useState<ListingMode>("Buy");
    const [dialog, setDialog] = useState({
        open: false,
        message: ""
    });
    const [categories, setCategories] = useState<TaxonomyNode[]>([]);
    const [loading, setLoading] = useState(true);
    const url = '/categories';    // api path

    const onSuccess = (category: TaxonomyNode[]) => {
        const nodes = getLeafNodes(category[0]);
        
        // fix up the images in cats relative to asset url
        nodes.forEach(node => {
        node.image = ASSET_URL + node.image;
        });

        setCategories(nodes);
    };

    useEffect(() => {
        Fetch(url, onSuccess, setLoading, setDialog);
        }, []);

    if (loading) {
        return (
        <Loading />
        );
    }

    return (
        <AppShell>
            <PageContainer>
                <HeroSection />
                
                <TransactionMode
                    value={listingMode}
                    onChange={(val:ListingMode) => setListingMode(val)} />

                <section className="mt-8">
                    <SectionHeader
                    title="All Categories"
                    actionLabel=""
                    actionHref={""} />
            
                    <div className="mt-4 grid grid-cols-7 overflow-x-auto scrollbar-none">
                        {categories.map((category) => (
                            <CategoryCard
                            key={category.id}
                            category={category}
                            route={`/categories/${category.name}`}
                            listingMode={listingMode}
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
    )
}

export default CategorySectionPage