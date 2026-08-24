export interface ListingCardProps {
  id: number;
  title: string;
  area: string;
  price: number;
  priceUnit: string;
  image: string;
  trustScore: number;
  isVerified: boolean;
}


export interface ListingFullProps {
  id: number;
  title: string;
  description: string;
  area: string;
  price: number;
  priceUnit: string;
  image: string;
  trustScore: number;
  isVerified: boolean;
  providerName: string;
}


export interface ListingStatusCount {
    status: string;
    count: number;
}