import type { ProviderTaxonomy } from "../../../../types/employee/employee";

import { ListingTaxonomySelector } from "../taxonomy/ListingTaxonomySelector";

interface Props {
  taxonomy: ProviderTaxonomy[];
  value: number | null;
  onChange: (id: number | null) => void;
}

export function ListingTaxonomyStep({
  taxonomy,
  value,
  onChange,
  }: Props) {
  return ( 
    <ListingTaxonomySelector
      nodes={taxonomy}
      value={value}
      onChange={onChange}
    />
  );
}
