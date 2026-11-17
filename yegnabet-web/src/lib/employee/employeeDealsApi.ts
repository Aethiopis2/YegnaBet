import axios from "axios";
import { API_BASE } from "../../types/api";
import type { EmployeeDeal, EmployeeDealPage, DealStatus, UpdateEmployeeDealRequest } from "../../types/employee/employeeDeal";

function dealError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    return new Error(typeof message === "string" ? message : error.message);
  }
  return error instanceof Error ? error : new Error("Deal request failed.");
}

const auth = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export async function getEmployeeDeals(
  token: string,
  page: number,
  search: string,
  status: DealStatus | "All",
  pageSize = 8,
): Promise<EmployeeDealPage> {
  try {
    const { data } = await API_BASE.get<EmployeeDealPage>("/employee/deals", {
      ...auth(token),
      params: {
        page,
        pageSize,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(status !== "All" ? { status } : {}),
      },
    });
    return data;
  } catch (error) { throw dealError(error); }
}

export async function updateEmployeeDeal(
  token: string,
  dealId: number,
  request: UpdateEmployeeDealRequest,
): Promise<EmployeeDeal> {
  try {
    const { data } = await API_BASE.put<EmployeeDeal>(`/employee/deals/${dealId}`, request, auth(token));
    return data;
  } catch (error) { throw dealError(error); }
}

export async function removeEmployeeDeal(token: string, dealId: number): Promise<void> {
  try { await API_BASE.delete(`/employee/deals/${dealId}`, auth(token)); }
  catch (error) { throw dealError(error); }
}
