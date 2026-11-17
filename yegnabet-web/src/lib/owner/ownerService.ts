import OwnerListings from "../../pages/owner/BulidOwnerListings";
import { API } from "../../types/api";
import type { Listing } from "../../types/customer/listings";
import type { OwnerListing, OwnerRecordsPage } from "../../types/owner/owner";
import type { OwnerCommissionDetail, OwnerCommissionFilters, OwnerCommissionPage } from "../../types/owner/ownerCommission";
import type {
  DashboardPeriod,
  OwnerDashboardSummary,
} from "../../types/owner/ownerDashboard";

export async function getOwnerDashboardSummary(
  period: DashboardPeriod,
  token: string
): Promise<OwnerDashboardSummary> {
  const { data } = await API.get<OwnerDashboardSummary>(
    "/owner/dashboard/summary",
    { 
      params: { period },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
}


export async function getListingsByStatus(
  param: string,
  token: string,
): Promise<OwnerListing[]> {
  const response = await API.get(`/owner/dashboard/${param}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.status !== 200) {
    throw new Error(`Failed to load listings (${response.status})`);
  }

  return response.data;
}

export async function getOwnerRecords(
  type: string,
  token: string,
  page: number,
  options: { status?: string; search?: string; period?: string; providerId?: number } = {},
): Promise<OwnerRecordsPage> {
  const { data } = await API.get<OwnerRecordsPage>("/owner/dashboard/records", {
    params: { type, page, pageSize: 10, ...options },
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function getOwnerCommissions(
  token: string,
  page: number,
  filters: OwnerCommissionFilters,
): Promise<OwnerCommissionPage> {
  const { data } = await API.get<OwnerCommissionPage>("/owner/commissions", {
    params: { page, pageSize: 10, ...filters },
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function getOwnerCommissionDetail(token: string, transactionId: number): Promise<OwnerCommissionDetail> {
  const { data } = await API.get<OwnerCommissionDetail>(`/owner/commissions/${transactionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
