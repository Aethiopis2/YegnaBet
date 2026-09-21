/**
 * @description an interface used to fetch location information to/from
 *  a backend service. A location is but a string of unique names for every listing
 *  that exists and avoid duplication when handling listings with similar locations.
 */
export interface ListingLocation {
    id: number;
    country: string;
    city: string;
    area: string;
    subArea?: string;
    count: number;
}