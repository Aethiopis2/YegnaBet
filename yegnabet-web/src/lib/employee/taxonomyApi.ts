import { API } from "../../types/api";
import type { CreateTaxonomyAttributeRequest, CreateTaxonomyNodeRequest, EmployeeTaxonomyNodeDto, TaxonomyAttribute, UpdateTaxonomyAttributeRequest, UpdateTaxonomyNodeRequest } from "../../types/customer/taxonomy";

export async function getTaxonomyTree(taxonomyId: number): Promise<EmployeeTaxonomyNodeDto[]> {
  const response = await API.get<EmployeeTaxonomyNodeDto[]>(`/employee/taxonomies/${taxonomyId}/tree`);
  return response.data;
} // end getTaxonomyTree


export async function updateTaxonomyNode(nodeId: string, 
  request: UpdateTaxonomyNodeRequest): Promise<void> {
  await API.put(`/employee/taxonomies/nodes/${nodeId}`, request);
} // end updateTaxonomyNode


export async function createTaxonomyNode(taxonomyId: number, 
  request: CreateTaxonomyNodeRequest): Promise<EmployeeTaxonomyNodeDto> {

  const response = await API.post<EmployeeTaxonomyNodeDto>(`/employee/taxonomies/${taxonomyId}/nodes`, request);
  return response.data;
} // end createTaxonomyNode


export async function moveTaxonomyNode(nodeId: string, 
  targetParentId: string | null): Promise<void> {

  await API.put(`/employee/taxonomies/nodes/${nodeId}/move`, {
        targetParentId:
          targetParentId === null
            ? null
            : Number(targetParentId),
      });
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

export async function deleteTaxonomyNode(nodeId: string): Promise<void> {
  await API.delete(`/employee/taxonomies/nodes/${nodeId}`);
}

export interface TaxonomyListing {
  id: number;
  title: string;
  status: string;
  price: number | null;
  createdAt: string;
}

export async function getTaxonomyNodeListings(nodeId: string): Promise<TaxonomyListing[]> {
  const response = await API.get<TaxonomyListing[]>(`/employee/taxonomies/nodes/${nodeId}/listings`);
  return response.data;
}
