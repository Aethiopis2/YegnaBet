import type { Listing } from "../components/types/listings";

export const listings: Listing[] = [
  {
    id: 1,
    type: "house",
    title: "Luxury Family House",
    description:
      "Beautiful modern family home in a prime location.",
    price: 12500000,
    currency: "ETB",
    status: "sale",
    location: {
      city: "Addis Ababa",
      area: "CMC",
    },
    images: [
      "/images/listings/house-1.jpg",
    ],
    featured: true,
    verified: true,
    trending: true,
    saved: false,
    metadata: {
      bedrooms: 5,
      bathrooms: 4,
      area: 350,
      parking: 2,
    },
    provider: {
      id: 1,
      name: "Hana Tesfaye",
      company: "Yegna Bet Real Estate",
      avatar: "/images/avatars/hana.jpg",
      verified: true,
    },
  },

  {
    id: 2,
    type: "apartment",
    title: "Modern Apartment",
    description:
      "Contemporary apartment with excellent amenities.",
    price: 6800000,
    currency: "ETB",
    status: "sale",
    location: {
      city: "Addis Ababa",
      area: "Bole",
    },
    images: [
      "/images/listings/apartment-1.jpg",
    ],
    featured: true,
    verified: true,
    saved: false,
    metadata: {
      bedrooms: 3,
      bathrooms: 2,
      area: 160,
      parking: 1,
    },
    provider: {
      id: 2,
      name: "Sara Alemu",
      company: "Yegna Bet Real Estate",
      avatar: "/images/avatars/sara.jpg",
      verified: true,
    },
  },

  {
    id: 3,
    type: "land",
    title: "Prime Land",
    description:
      "Spacious land in a growing residential area.",
    price: 2400000,
    currency: "ETB",
    status: "sale",
    location: {
      city: "Addis Ababa",
      area: "Sululta",
    },
    images: [
      "/images/listings/land-1.jpg",
    ],
    featured: true,
    verified: true,
    saved: false,
    metadata: {
      area: 500,
    },
    provider: {
      id: 3,
      name: "Daniel Kebede",
      company: "Yegna Bet Real Estate",
      avatar: "/images/avatars/daniel.jpg",
      verified: true,
    },
  },

  {
    id: 4,
    type: "house",
    title: "Modern Villa",
    description:
      "Beautiful modern villa with garden and parking.",
    price: 9800000,
    currency: "ETB",
    status: "sale",
    location: {
      city: "Addis Ababa",
      area: "CMC",
    },
    images: [
      "/images/listings/house-2.jpg",
    ],
    verified: true,
    trending: true,
    metadata: {
      bedrooms: 4,
      bathrooms: 3,
      area: 280,
      parking: 2,
    },
    provider: {
      id: 4,
      name: "Liya Mengesha",
      company: "Yegna Bet Real Estate",
      avatar: "/images/avatars/liya.jpg",
      verified: true,
    },
  },
];