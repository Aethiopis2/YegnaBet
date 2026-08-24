export interface ProviderListing {
    id: number;
    title: string;
    type: string;
    price: number;
    priceUnit: string;
    status: string;
    image: string;
};

export interface ProviderListingCardProps {
    listing: ProviderListing;
}