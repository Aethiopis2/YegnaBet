import axios from "axios";
import { API_BASE } from "../../types/api";
import type {
  CreateEmployeeAccountRequest,
  EmployeeAccount,
  UpdateEmployeeAccountRequest,
} from "../../types/employee/employeeAccount";

function employeeError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    return new Error(typeof message === "string" ? message : error.message);
  }
  return error instanceof Error ? error : new Error("Employee request failed.");
}

const headers = (token: string) => ({ Authorization: `Bearer ${token}` });

export async function getEmployeeAccounts(token: string): Promise<EmployeeAccount[]> {
  try {
    const response = await API_BASE.get<EmployeeAccount[]>("/employee/directory", {
      headers: headers(token),
    });
    return response.data;
  } catch (error) {
    throw employeeError(error);
  }
}

export async function getEmployeeAccount(token: string, employeeId: number): Promise<EmployeeAccount> {
  try {
    const response = await API_BASE.get<EmployeeAccount>(`/employee/directory/${employeeId}`, {
      headers: headers(token),
    });
    return response.data;
  } catch (error) {
    throw employeeError(error);
  }
}

export async function createEmployeeAccount(
  token: string,
  request: CreateEmployeeAccountRequest,
): Promise<EmployeeAccount> {
  try {
    const response = await API_BASE.post<EmployeeAccount>("/employee/directory", request, {
      headers: headers(token),
    });
    return response.data;
  } catch (error) {
    throw employeeError(error);
  }
}

export async function updateEmployeeAccount(
  token: string,
  employeeId: number,
  request: UpdateEmployeeAccountRequest,
): Promise<EmployeeAccount> {
  try {
    const response = await API_BASE.put<EmployeeAccount>(`/employee/directory/${employeeId}`, request, {
      headers: headers(token),
    });
    return response.data;
  } catch (error) {
    throw employeeError(error);
  }
}

export async function removeEmployeeAccount(token: string, employeeId: number): Promise<void> {
  try {
    await API_BASE.delete(`/employee/directory/${employeeId}`, {
      headers: headers(token),
    });
  } catch (error) {
    throw employeeError(error);
  }
}
