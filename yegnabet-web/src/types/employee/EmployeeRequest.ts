export type InquiryStatus =
  | "New"
  | "Negotiating"
  | "Completed"
  | "Cancelled";

interface CustomerSm {
  id: number;
  name: string;
  phoneNumber: string;
  email?: string;
}

interface ListingSm {
  id: number;
  title: string;
  category: string;
  location: string;
  price?: number;
  imageUrl?: string;
}

export interface EmployeeRequest {
  id: number;
  customer: CustomerSm;
  listing: ListingSm;
  status: InquiryStatus;
  createdAt: string;
}