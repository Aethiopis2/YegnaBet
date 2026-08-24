import type { ListingType } from "./listings";

export interface Category {
    id: string;
    name: string;
    description?: string;
    image: string;
    type: ListingType;
    route: string;
}