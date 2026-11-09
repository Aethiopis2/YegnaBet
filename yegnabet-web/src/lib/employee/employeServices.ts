import axios from "axios";
import { API_BASE } from "../../types/api";
import type { EmployeeDashboardDto } from "../../types/employee/employeeDashboard";
import type { EmployeeRequest, InquiryStatus } from "../../types/employee/EmployeeRequest";
import type { EmployeeTaxonomyShort } from "../../types/employee/employee";

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