import axios from "axios";
import { API_BASE } from "../../types/api";
import type {
  CreateProviderAccountRequest,
  ProviderAccount,
  ProviderDirectoryPage,
  UpdateProviderAccountRequest,
} from "../../types/employee/providerAccount";

function providerError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    return new Error(typeof message === "string" ? message : error.message);
  }
  return error instanceof Error ? error : new Error("Provider request failed.");
}

const auth = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export async function getProviders(
  token: string,
  page: number,
  search: string,
  pageSize = 8,
  isActive?: boolean,
): Promise<ProviderDirectoryPage> {
  try {
    const { data } = await API_BASE.get<ProviderDirectoryPage>("/employee/providers", {
      ...auth(token),
      params: { page, pageSize, ...(search.trim() ? { search: search.trim() } : {}), ...(isActive !== undefined ? { isActive } : {}) },
    });
    return data;
  } catch (error) { throw providerError(error); }
}

export async function getProvider(token: string, id: number): Promise<ProviderAccount> {
  try {
    const { data } = await API_BASE.get<ProviderAccount>(`/employee/providers/${id}`, auth(token));
    return data;
  } catch (error) { throw providerError(error); }
}

export async function createProvider(
  token: string,
  request: CreateProviderAccountRequest,
): Promise<ProviderAccount> {
  try {
    const { data } = await API_BASE.post<ProviderAccount>("/employee/providers", request, auth(token));
    return data;
  } catch (error) { throw providerError(error); }
}

export async function updateProvider(
  token: string,
  id: number,
  request: UpdateProviderAccountRequest,
): Promise<ProviderAccount> {
  try {
    const { data } = await API_BASE.put<ProviderAccount>(`/employee/providers/${id}`, request, auth(token));
    return data;
  } catch (error) { throw providerError(error); }
}

export async function removeProvider(token: string, id: number): Promise<void> {
  try { await API_BASE.delete(`/employee/providers/${id}`, auth(token)); }
  catch (error) { throw providerError(error); }
}
