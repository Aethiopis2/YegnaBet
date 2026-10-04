import axios from "axios";
import { API_BASE, BASE_URL_STRING } from "../../types/api";
import type { TaxonomyNode } from "../../types/common/taxonomy";
import type { AddUpdateSavedListing, Listing, ListingLocation, ListingPage } from "../../types/customer/listings";
import type { UserProfile } from "../../types/customer/profile";
import { getLeafNodes } from "../common/taxonomyFunctions";

export async function getCustomerAuth(token: string): Promise<UserProfile> {
    const response = await API_BASE.get('/customer/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status !== 200) {
        throw `Failed to load customer profile (${response.status})`;
    } // end if

    return response.data;
} // end customerAuth


export async function getTaxonomyLeafNodes(): Promise<TaxonomyNode[]> {
    const response = await API_BASE.get('/categories');

    if (response.status !== 200) {
        throw `Failed to load categories (${response.status})`
    }

    // fix taxomomy images relative path
    const nodes = getLeafNodes(await response.data[0]);
        
    // fix up the images in nodes relative to asset url
    nodes.forEach(node  => {
        node.image = node.image ? BASE_URL_STRING + node.image : "";
    });

    return nodes;
} // end getTaxonomyNode


export async function getLocations() : Promise<ListingLocation[]> {
    const response = await API_BASE.get(`listings/get-listing-locations`);

    if (response.status !== 200) {
        throw `Failed to load locations (${response.status})`
    }

    return await response.data;
} // end getLocations


export async function getFeaturedListings(listingMode: string) : Promise<Listing[]> {
    const response = await API_BASE.get(`/listings?featured=true&method=${listingMode}`);

    if (response.status !== 200) {
        throw `Failed to load categories (${response.status})`
    }

    // fix taxomomy images relative path
    const listingPage: ListingPage = await response.data;
        
    // fix up the images in nodes relative to asset url
    listingPage.items.forEach(listing => {
        if (listing.images) {
            listing.images = listing.images.map((img: string) => BASE_URL_STRING + img);
        }
    });

    return listingPage.items;
} // end getFeaturedListings


export async function updateSavedListing(listing: AddUpdateSavedListing): Promise<void> {
    try {
        await API_BASE.post(`/listings/save-listing`, listing);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                `Failed to update saved listing: ${
                    error.response?.status ?? error.message
                }`
            );
        }

        throw error;
    }
} // end updateSavedListing


export async function getListing(listingId: number): Promise<Listing> {
    try {
        const response = await API_BASE.get(`/listings/${listingId}`);
        
        const listing: Listing = await response.data;

        // correct image url if since its always relative
        if (listing.images) {
            listing.images = listing.images.map((img: string) => BASE_URL_STRING + img);
        }

        return listing;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                `Failed to get listing: ${
                    error.response?.status ?? error.message
                }`
            );
        }

        throw error;
    }
} // end getListing