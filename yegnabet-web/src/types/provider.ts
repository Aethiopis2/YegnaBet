export interface ProviderTaxonomy {
  id: number;
  name: string;
  children: ProviderTaxonomy[];
}

export interface ProviderLocation {
  id: number;
  city: string;
  area: string;
}