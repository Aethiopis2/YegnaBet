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