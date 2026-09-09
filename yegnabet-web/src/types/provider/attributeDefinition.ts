import type { ListingAttributeValue } from "../../types/providerListings";

export type AttributeType =
  | "Text"
  | "Integer"
  | "Decimal"
  | "Boolean"
  | "Date"
  | "DateTime"
  | "Choice"
  | "MultiChoice";

export interface TNodeAttributeDefinition {
  id: number;
  key: string;
  label: string;
  type: AttributeType;

  // Used by Choice / MultiChoice
  options?: Record<string, string>;
}

export interface ListingAttributeFieldProps {
  attribute: TNodeAttributeDefinition;
  value: ListingAttributeValue;
  onChange: (
    value: ListingAttributeValue
  ) => void;
}