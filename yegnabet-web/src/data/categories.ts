import type { Category } from "../components/types/category";

export const categories: Category[] = [
  {
    id: "houses",
    name: "Houses",
    description: "Find your next home",
    image: "/images/categories/houses.jpg",
    type: "house",
    route: "/categories/houses",
  },
  {
    id: "apartments",
    name: "Apartments",
    description: "Modern apartments",
    image: "/images/categories/apartments.jpg",
    type: "apartment",
    route: "/categories/apartments",
  },
  {
    id: "land",
    name: "Land",
    description: "Land for sale",
    image: "/images/categories/land.jpg",
    type: "land",
    route: "/categories/land",
  },
  {
    id: "commercial",
    name: "Commercial",
    description: "Commercial properties",
    image: "/images/categories/commercial.jpg",
    type: "commercial",
    route: "/categories/commercial",
  },
  {
    id: "services",
    name: "Services",
    description: "Trusted professionals",
    image: "/images/categories/services.jpg",
    type: "service",
    route: "/categories/services",
  },
];