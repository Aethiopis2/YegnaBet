export interface EmployeeAccount {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeAccountRequest {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface UpdateEmployeeAccountRequest {
  fullName: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  newPassword?: string;
}
