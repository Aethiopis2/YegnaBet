import { API, ASSET_URL } from "../../types/api";
import type { CreateTaxonomyAttributeRequest, CreateTaxonomyNodeRequest, EmployeeTaxonomyNodeDto, TaxonomyAttribute, UpdateTaxonomyAttributeRequest, UpdateTaxonomyNodeRequest } from "../../types/common/taxonomy";

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


export async function moveTaxonomyNode(nodeId: string, 
  targetParentId: string | null): Promise<void> {

  const response = await fetch(
    `${ASSET_URL}/employee/taxonomies/nodes/${nodeId}/move`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        targetParentId:
          targetParentId === null
            ? null
            : Number(targetParentId),
      }),
    }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(
      body?.message ??
      `Failed to move taxonomy node (${response.status})`
    );
  }
} // end moveTaxonomyNode


export async function getTaxonomyAttributes(nodeId: string) {
  const response = await API.get<TaxonomyAttribute[]>(
    `/employee/taxonomies/nodes/${nodeId}/attributes`
  );

  return response.data;
} // end getTaxonomyAttributes


export async function createTaxonomyAttribute(
  nodeId: string,
  request: CreateTaxonomyAttributeRequest
) {
  const response = await API.post<TaxonomyAttribute>(
    `/employee/taxonomies/nodes/${nodeId}/attributes`,
    request
  );

  return response.data;
} // end CreateTaxonomyAttribute


export async function updateTaxonomyAttribute(
  nodeId: string,
  attributeId: string,
  request: UpdateTaxonomyAttributeRequest
) {
  await API.put(
    `/employee/taxonomies/nodes/${nodeId}/attributes/${attributeId}`,
    request
  );
} // updateTaxonomyAttribute


export async function deleteTaxonomyAttribute(
  nodeId: string,
  attributeId: string
) {
  await API.delete(
    `/employee/taxonomies/nodes/${nodeId}/attributes/${attributeId}`
  );
} // deleteTaxonomyAttribute