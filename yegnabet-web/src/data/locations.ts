export interface PopularLocation {
  id: string;
  name: string;
  count: number;
  image: string;
}

export const popularLocations: PopularLocation[] = [
  {
    id: "cmc",
    name: "CMC",
    count: 128,
    image: "/images/locations/cmc.jpg",
  },
  {
    id: "bole",
    name: "Bole",
    count: 96,
    image: "/images/locations/bole.jpg",
  },
  {
    id: "saris",
    name: "Saris",
    count: 74,
    image: "/images/locations/saris.jpg",
  },
  {
    id: "summit",
    name: "Summit",
    count: 62,
    image: "/images/locations/summit.jpg",
  },
  {
    id: "kazanchis",
    name: "Kazanchis",
    count: 48,
    image: "/images/locations/kazanchis.jpg",
  },
];