import axios from "axios";
import { API_BASE } from "../../types/api";
import type { EmployeeDashboardDto } from "../../types/employee/employeeDashboard";
import type { EmployeeRequest, InquiryStatus } from "../../types/employee/EmployeeRequest";
import type { EmployeeTaxonomyShort } from "../../types/employee/employee";
import type { TNodeAttributeDefinition } from "../../types/provider/attributeDefinition";
import { createListingDraftFormData } from "../provider/providerManagement";
import type { ListingDraft } from "../../types/provider/providerTypes";

export async function EmployeeDashboard(token: string): Promise<EmployeeDashboardDto> {
    try {
    const response = await API_BASE.get(`employee`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;

    } catch (err) {
      if (axios.isAxiosError(err)) {
            throw new Error(
                `${err.name}: ${err.message}`
            );
        }
        
        throw err;
    }
} // end EmployeeDashboard


export async function getEmployeeRequests(token: string): Promise<EmployeeRequest[]> {
    try {
        const response = await API_BASE.get(`employee/requests`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw new Error(
                `${err.name}: ${err.message}`
            );
        }
        
        throw err;
    }
} // end getEmployeeRequests


export async function updateInquiryStatus(token: string, inquiryId: number, status: InquiryStatus): Promise<EmployeeRequest> {
    try {
        const response = await API_BASE.put(`employee/updateRequest`, { inquiryId, status }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw new Error(
                `${err.name}: ${err.message}`
            );
        }
        
        throw err;
    }
} // end updateInquiryStatus


export async function getTaxonomyNodesShort(token: string): Promise<EmployeeTaxonomyShort[]> {
    try {
        const response = await API_BASE.get(`employee/getTaxonomyNodesShort`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw new Error(
                `${err.name}: ${err.message}`
            );
        }
        
        throw err;
    }
} // end getTaxonomyNodesShort


export async function getEmpTaxonomyNodeAttributes(token: string, nodeId: number): Promise<TNodeAttributeDefinition[]> {
    try {
        const response = await API_BASE.get(`employee/getTaxonomyNodeAtrributes?nodeId=${nodeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw new Error(
                `${err.name}: ${err.message}`
            );
        }
        
        throw err;
    }
} // end getTaxonomyNodeAttributes



export async function createEmployeeListing(token: string, draft: ListingDraft): Promise<void> {
    try {
        const formData = createListingDraftFormData(draft);
        
        await API_BASE.post(`employee`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (err) {
        if (axios.isAxiosError(err)) {
            console.error("Status:", err.response?.status);
            console.error("Response:", err.response?.data);
            console.error("Request:", err.config?.url);
            throw new Error(
                `${err.name}: ${err.message}: ${err.response?.data}`
            );
        }
        
        throw err;
    }
} // end createEmployeeListing