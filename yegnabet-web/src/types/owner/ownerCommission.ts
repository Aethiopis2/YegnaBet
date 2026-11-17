export interface OwnerCommissionFilters {
  search?: string;
  method?: string;
  minAmount?: number;
  maxAmount?: number;
  from?: string;
  to?: string;
}

export interface OwnerCommissionListItem {
  id: number;
  dealId: number;
  listingId: number;
  listingTitle: string;
  category: string;
  method: string;
  listingStatus: string;
  providerName: string;
  employeeName: string;
  commissionAmount: number;
  dealValue: number;
  commissionRate: number;
  currency: string;
  transactionDate: string;
  thumbnailUrl?: string | null;
}

export interface OwnerCommissionPage {
  items: OwnerCommissionListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasMore: boolean;
  totalAmount: number;
}

export interface OwnerCommissionPerson {
  id: number;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  avatar?: string | null;
}

export interface OwnerCommissionDetail {
  commission: OwnerCommissionListItem;
  referenceNumber?: string | null;
  listingDescription?: string | null;
  listingPrice?: number | null;
  priceUnit?: string | null;
  city: string;
  area: string;
  subArea?: string | null;
  dealCompletedAt?: string | null;
  dealStatus: string;
  media: { url: string; kind: string; isPrimary: boolean }[];
  attributes: { name: string; value: string }[];
  provider: OwnerCommissionPerson;
  employee: OwnerCommissionPerson;
  customer?: OwnerCommissionPerson | null;
}
