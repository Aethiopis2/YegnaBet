export type DealStatus = "Pending" | "Successful" | "Failed";

export interface EmployeeDeal {
  id: number;
  inquiryId: number;
  listingId: number;
  listingTitle: string;
  listingLocation: string;
  customerName: string;
  customerPhone: string;
  dealValue: number;
  commissionRate: number;
  commissionAmount: number;
  status: DealStatus;
  completedAt?: string | null;
}

export interface EmployeeDealPage {
  items: EmployeeDeal[];
  page: number;
  pageSize: number;
  hasMore: boolean;
  totalCount: number;
}

export interface UpdateEmployeeDealRequest {
  dealValue: number;
  commissionRate: number;
  status: DealStatus;
}
