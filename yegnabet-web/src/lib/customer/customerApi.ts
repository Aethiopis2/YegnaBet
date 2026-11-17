import axios from "axios";
import { API_BASE, BASE_URL_STRING } from "../../types/api";
import type { TaxonomyAttribute, TaxonomyNode } from "../../types/customer/taxonomy";
import type { AddUpdateSavedListing, Listing, ListingLocation, ListingPage, ListingQueryDto, ListingViewCountRequest, UpdateManagedListingRequest } from "../../types/customer/listings";
import { getLeafNodes } from "../common/taxonomyFunctions";
import type { AuthUser } from "../../types/auth/authTypes";
import type { CustomerInquiryDto } from "../../types/customer/dto/CreateInquiryDto";
import type { MatchPreferences } from "../../types/match";
import type { ListingFilters } from "../../types/customer/explorer";

export async function getCustomerAuth(token: string): Promise<AuthUser> {
    const response = await API_BASE.get('auth/me', {
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
    nodes.forEach(node => {
        if (node.image?.trim()) {
            node.image = node.image.startsWith("http")
                ? node.image
                : BASE_URL_STRING + node.image;
        } else {
            node.image = undefined;
        }
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


export async function getFeaturedListings(listingMode: string, userId?: number) : Promise<Listing[]> {
    const params = new URLSearchParams({ featured: "true", method: listingMode });
    if (userId !== undefined) params.set("userId", String(userId));
    const response = await API_BASE.get(`/listings?${params.toString()}`);

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

export async function getListings(query: ListingQueryDto, token?: string | null): Promise<ListingPage> {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        if (key === "attributes" && typeof value === "object") {
            Object.entries(value as Record<string, unknown>).forEach(([attributeKey, attributeValue]) => {
                if (attributeValue !== undefined && attributeValue !== null && attributeValue !== "") {
                    params.set(`attributes[${attributeKey}]`, String(attributeValue));
                }
            });
        } else if (Array.isArray(value)) {
            value.forEach(item => params.append(key, String(item)));
        } else {
            params.set(key, String(value));
        }
    });

    const { data } = await API_BASE.get<ListingPage>(`/listings?${params.toString()}`, {
        ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    });
    data.items.forEach(listing => {
        listing.images = (listing.images ?? []).map(image =>
            toListingAssetUrl(image)
        );
    });
    return data;
}

function toListingAssetUrl(image: string): string {
    const correctedPath = image.replace("/uploads/listings/", "/uploads/images/");
    return /^https?:\/\//i.test(correctedPath)
        ? correctedPath
        : `${BASE_URL_STRING}${correctedPath.startsWith("/") ? "" : "/"}${correctedPath}`;
}

export async function getMatchExplorerFilters(preferences: MatchPreferences): Promise<ListingFilters> {
    const filters: ListingFilters = {};
    const category = preferences.propertyType?.trim();
    if (category) filters.category = category;
    if (preferences.minPrice !== undefined) filters.minPrice = preferences.minPrice;
    if (preferences.maxPrice !== undefined) filters.maxPrice = preferences.maxPrice;
    if (preferences.verifiedOnly) filters.verified = true;
    if (preferences.areas.length > 0) {
        const locations = await getLocations();
        const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");
        const selectedAreas = new Set(preferences.areas.map(normalize));
        const locationIds = locations
            .filter(location => selectedAreas.has(normalize(`${location.city}, ${location.area}`)))
            .map(location => location.id);
        if (locationIds.length > 0) filters.locationIds = locationIds;
    }

    return filters;
}


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


export async function getListing(listingId: number, userId?: number): Promise<Listing> {
    try {
        const params = userId === undefined ? "" : `?userId=${encodeURIComponent(String(userId))}`;
        const response = await API_BASE.get(`/listings/${listingId}${params}`);
        
        const listing: Listing = await response.data;

        const toAssetUrl = (url: string) => {
            if (/^https?:\/\//i.test(url)) return url;
            if (/^(?:www\.)?(?:youtube\.com|youtu\.be|vimeo\.com)(?:\/|$)/i.test(url))
                return `https://${url}`;
            return `${BASE_URL_STRING}${url.startsWith("/") ? "" : "/"}${url}`;
        };

        // correct image url if since its always relative
        if (listing.images) {
            listing.images = listing.images.map(toAssetUrl);
        }
        if (listing.media) {
            listing.media = listing.media.map(item => ({ ...item, url: toAssetUrl(item.url) }));
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


export async function updateListingViewCount(viewCount: ListingViewCountRequest): Promise<void> {
    try {
        await API_BASE.post(`/listings/update-listing-view-count`, viewCount);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                `Failed to update listing view count: ${
                    error.response?.status ?? error.message
                }`
            );
        }

        throw error;
    } 
}

export async function getManagedListing(listingId: number, token: string): Promise<Listing> {
    const { data } = await API_BASE.get<Listing>(`/listings/${listingId}/manage`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const toAssetUrl = (url: string) => toListingAssetUrl(url);
    data.images = (data.images ?? []).map(toAssetUrl);
    data.media = data.media?.map(item => ({ ...item, url: toAssetUrl(item.url) }));
    return data;
}

export async function updateManagedListing(listingId: number, token: string,
    request: UpdateManagedListingRequest): Promise<Listing> {
    const { data } = await API_BASE.put<Listing>(`/listings/${listingId}/manage`, request, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
}

export async function removeManagedListing(listingId: number, token: string): Promise<void> {
    await API_BASE.delete(`/listings/${listingId}/manage`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function getTaxonomyTree(): Promise<TaxonomyNode[]> {
    const response = await API_BASE.get<TaxonomyNode[]>("/categories");
    return response.data;
}

function taxonomySlug(value: string): string {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function getTaxonomyNodeId(category: string): Promise<number | null> {
    const response = await API_BASE.get<TaxonomyNode[]>("/categories");
    const wanted = taxonomySlug(category);
    const visit = (nodes: TaxonomyNode[]): number | null => {
        for (const node of nodes) {
            if (taxonomySlug(node.slug) === wanted || taxonomySlug(node.name) === wanted) {
                return node.id;
            }
            const childMatch = visit(node.children ?? []);
            if (childMatch !== null) return childMatch;
        }
        return null;
    };
    return visit(response.data);
}


export async function getTaxonomyNodeAttributes(nodeId: number): Promise<TaxonomyAttribute[]> {
    try {
        const ret = await API_BASE.get(`/categories/attributes/${nodeId}`);
        return ret.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                `Failed to update listing view count: ${
                    error.response?.status ?? error.message
                }`
            );
        }

        throw error;
    } 
}


export async function createInquiry(token: string, inquiry: CustomerInquiryDto) : Promise<void> {
    try {
        
        await API_BASE.post(
            `/inquiries/`,
            inquiry, // Request body
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                `Failed to create inquriy: ${
                    error.response?.status ?? error.message
                }`
            );
        }

        throw error;
    }
}
