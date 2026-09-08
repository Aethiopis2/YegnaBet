export type ProviderListingStatus =
  | "Draft"
  | "Active"
  | "Pending"
  | "Closed"
  | "Cancelled";

export interface ProviderListing {
  id: number;
  title: string;
  category: string;
  location: string;
  price: string;
  image: string;
  status: ProviderListingStatus;
  views: number;
  enquiries: number;
  updated: string;
}

export interface ProviderRequest {
  id: number;
  customer: string;
  request: string;
  location: string;
  budget: string;
  received: string;
  status: "New" | "Contacted" | "Scheduled";
}

export interface ProviderOpportunity {
  id: number;
  type: "attention" | "match" | "improvement";
  title: string;
  description: string;
  action: string;
}

export interface ProviderData {
  provider: {
    name: string;
    initials: string;
    verified: boolean;
    businessName: string;
    businessHealth: number;
  };

  status: {
    activeListings: number;
    totalViews: number;
    inquiries: number;
    deals: number;
  };

  listingSummary: {
    active: number;
    drafts: number;
    pending: number;
    paused: number;
  };

  listings: ProviderListing[];
  requests: ProviderRequest[];
  opportunities: ProviderOpportunity[];
}

// export const providerData = {
//   provider: {
//     name: "Sara Alemu",
//     initials: "SA",
//     verified: true,
//     businessName: "Sara Properties",
//     health: 86,
//   },

//   stats: {
//     activeListings: 12,
//     totalViews: 842,
//     inquiries: 37,
//     deals: 4,
//   },

//   listingSummary: {
//     active: 12,
//     drafts: 2,
//     pending: 1,
//     paused: 1,
//   },

//   listings: [
//     {
//       id: 1,
//       title: "Modern Family House",
//       category: "House",
//       location: "CMC, Addis Ababa",
//       price: "12.5M ETB",
//       image: "/assets/pictures/houses/1.jpg",
//       status: "active",
//       views: 284,
//       enquiries: 31,
//       updated: "2 days ago",
//     },

//     {
//       id: 2,
//       title: "Spacious Family Home",
//       category: "House",
//       location: "Bole, Addis Ababa",
//       price: "9.8M ETB",
//       image: "/assets/pictures/houses/2.jpg",
//       status: "active",
//       views: 191,
//       enquiries: 18,
//       updated: "4 days ago",
//     },

//     {
//       id: 3,
//       title: "Modern City Apartment",
//       category: "Apartment",
//       location: "Kazanchis, Addis Ababa",
//       price: "65K ETB / month",
//       image: "/assets/pictures/apartments/3.jpg",
//       status: "active",
//       views: 143,
//       enquiries: 12,
//       updated: "7 days ago",
//     },

//     {
//       id: 4,
//       title: "Premium Apartment",
//       category: "Apartment",
//       location: "Bole, Addis Ababa",
//       price: "75K ETB / month",
//       image: "/assets/pictures/apartments/4.jpg",
//       status: "draft",
//       views: 0,
//       enquiries: 0,
//       updated: "Never published",
//     },
//   ] satisfies ProviderListing[],

//   requests: [
//     {
//       id: 1,
//       customer: "Sara Bekele",
//       request: "4 bedroom house",
//       location: "CMC",
//       budget: "8M – 12M ETB",
//       received: "10 min ago",
//       status: "new",
//     },

//     {
//       id: 2,
//       customer: "Daniel Kebede",
//       request: "2 bedroom apartment",
//       location: "Bole",
//       budget: "50K – 70K / month",
//       received: "42 min ago",
//       status: "new",
//     },

//     {
//       id: 3,
//       customer: "Mekdes Yohannes",
//       request: "Family house",
//       location: "Summit",
//       budget: "7M – 10M ETB",
//       received: "Yesterday",
//       status: "contacted",
//     },
//   ] satisfies ProviderRequest[],

//   opportunities: [
//     {
//       id: 1,
//       type: "attention",
//       title: "Modern Family House needs an update",
//       description:
//         "This listing has not been updated for 21 days.",
//       action: "Update listing",
//     },

//     {
//       id: 2,
//       type: "match",
//       title: "7 customers match your apartment",
//       description:
//         "Recent searches indicate strong demand around Bole.",
//       action: "View matches",
//     },

//     {
//       id: 3,
//       type: "improvement",
//       title: "Add more photos",
//       description:
//         "Your Modern City Apartment currently has only 2 photos.",
//       action: "Manage photos",
//     },
//   ] satisfies ProviderOpportunity[],
// };