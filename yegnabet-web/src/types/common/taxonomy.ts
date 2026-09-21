import type { LucideIcon } from "lucide-react";

/**
 * @description a taxonomy node is a tree of categories plus more. The interface allows
 *  exchange of taxonomy nodes or category heirarchies from server and represent each
 *  like a tree as it exists in db.
 */
export interface TaxonomyNode {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    children: TaxonomyNode[];
}


/**
 * @description a frontend tailored version of the expanded TaxonomyNode
 */
export interface TaxonomyNodeFront {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;

  icon: LucideIcon;
  active: boolean;
  parentId: string | null;
  sortOrder: number;
  listingCount: number;
  attributes: TaxonomyAttribute[];
  children: TaxonomyNodeFront[];
}


/**
 * @description a variant of TaxonomyNodeview tailored for Employee based
 *  request/responses
 */
export interface EmployeeTaxonomyNodeDto {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId: number | null;
  sortOrder: number;
  isActive: boolean;
  listingCount: number;
  children: EmployeeTaxonomyNodeDto[];
}


/**
 * @description Each taxonomy has withit a set of attributes that describe
 *  its properties.
 */
export interface TaxonomyAttribute {
  id: string;
  name: string;
  key: string;

  type:
    | "string"
    | "integer"
    | "decimal"
    | "boolean"
    | "date"
    | "datetime"
    | "choice";

  required: boolean;
  searchable: boolean;
  filterable: boolean;
  minValue?: number;
  maxValue?: number;
  options?: string[];
}


/**
 * @description
 */
export interface UpdateTaxonomyNodeRequest {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  parentId: number | null;
  sortOrder: number;
  isActive: boolean;
}


/**
 * @description
 */
export interface CreateTaxonomyNodeRequest {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  parentId: number | null;
}