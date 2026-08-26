import type { LucideIcon } from "lucide-react";

export type TaxonomyAttributeType =
  | "text"
  | "integer"
  | "decimal"
  | "boolean"
  | "choice";

export interface TaxonomyAttribute {
  id: string;
  name: string;
  key: string;
  type: TaxonomyAttributeType;

  required: boolean;
  searchable: boolean;
  filterable: boolean;

  minValue?: number;
  maxValue?: number;

  options?: string[];
}

export interface TaxonomyNode {
  id: string;
  name: string;
  slug: string;
  description?: string;

  icon?: LucideIcon;

  active: boolean;

  parentId: string | null;

  sortOrder: number;

  listingCount: number;

  attributes: TaxonomyAttribute[];

  children: TaxonomyNode[];
}

export interface TaxonomyDefinition {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}