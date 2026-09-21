import { ASSET_URL } from "../../types/api";
import type { CreateTaxonomyNodeRequest, EmployeeTaxonomyNodeDto, UpdateTaxonomyNodeRequest } from "../../types/common/taxonomy";

export async function getTaxonomyTree(taxonomyId: number): Promise<EmployeeTaxonomyNodeDto[]> {
  const response = await fetch(
    `${ASSET_URL}/api/employee/taxonomies/${taxonomyId}/tree`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load taxonomy tree (${response.status})`
    );
  }

  return response.json();
} // end getTaxonomyTree


export async function updateTaxonomyNode(nodeId: string, 
  request: UpdateTaxonomyNodeRequest): Promise<void> {
  const response = await fetch(
    `${ASSET_URL}/api/employee/taxonomies/nodes/${nodeId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(
      body?.message ??
      `Failed to update taxonomy node (${response.status})`
    );
  }
} // end updateTaxonomyNode


export async function createTaxonomyNode(taxonomyId: number, 
  request: CreateTaxonomyNodeRequest): Promise<EmployeeTaxonomyNodeDto> {

  const response = await fetch(
    `${ASSET_URL}/api/employee/taxonomies/${taxonomyId}/nodes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(
      body?.message ??
      `Failed to create taxonomy node (${response.status})`
    );
  }

  return response.json();
} // end createTaxonomyNode