import type { EmployeeRequest } from "./EmployeeRequest";

export const mockRequests: EmployeeRequest[] = [
  {
    id: 1001,
    listingId: 501,
    customer: {
      id: 201,
      name: "Abebe Kebede",
      phoneNumber: "+251911234567",
    },
    listing: {
      title: "Modern 3 Bedroom Apartment",
      category: "Apartment",
      location: "Bole, Addis Ababa",
      price: 85000,
    },
    status: "New",
    createdAt: "2026-11-06T07:30:00Z",
  },
  {
    id: 1002,
    listingId: 502,
    customer: {
      id: 202,
      name: "Mekdes Alemu",
      phoneNumber: "+251922345678",
    },
    listing: {
      title: "Commercial Shop for Rent",
      category: "Commercial",
      location: "Piazza, Addis Ababa",
      price: 45000,
    },
    status: "Negotiating",
    createdAt: "2026-11-05T10:15:00Z",
  },
  {
    id: 1003,
    listingId: 503,
    customer: {
      id: 203,
      name: "Dawit Tadesse",
      phoneNumber: "+251933456789",
    },
    listing: {
      title: "Residential Land",
      category: "Land",
      location: "Bishoftu",
      price: 2500000,
    },
    status: "Completed",
    createdAt: "2026-11-03T08:00:00Z",
  },
  {
    id: 1004,
    listingId: 504,
    customer: {
      id: 204,
      name: "Sara Girma",
      phoneNumber: "+251944567890",
    },
    listing: {
      title: "Two Bedroom Apartment",
      category: "Apartment",
      location: "CMC, Addis Ababa",
      price: 55000,
    },
    status: "Cancelled",
    createdAt: "2026-11-01T12:00:00Z",
  },
];