export type ListingStatus =
  | "Active"
  | "Pending"
  | "Draft"
  | "Closed"
  | "Cancelled";

export interface OwnerListing {
  id: number;
  listingId?: number;
  title: string;
  category: string;
  location: string;
  provider: string;
  price: number;
  listingStatus: ListingStatus;
  verified: boolean;
  views: number;
  updatedAt: string;
  status?: string;
  createdAt?: string;
  price?: number;
}

export interface OwnerRecordsPage {
  items: OwnerListing[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasMore: boolean;
}
