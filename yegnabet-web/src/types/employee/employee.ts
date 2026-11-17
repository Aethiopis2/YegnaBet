export type EmployeeListingStatus =
  | "Draft"
  | "Active"
  | "Pending"
  | "Closed"
  | "Cancelled";


export interface EmployeeTaxonomyShort {
  id: number;
  name: string;
  children: EmployeeTaxonomyShort[];
}

export interface ProviderLocation {
  id: number;
  city: string;
  area: string;
}


export interface EmployeeListing {
  id: number;
  title: string;
  category: string;
  location: string;
  price: string;
  image: string;
  status: EmployeeListingStatus;
  views: number;
  enquiries: number;
  updated: string;
}