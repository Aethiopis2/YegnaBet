export type UserRole =
  | "Customer"
  | "Provider"
  | "Employee"
  | "Owner";

export interface AuthUser {
  id: number;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  avatarUrl?: string;
  isVerified?: boolean;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  sessionId: string;
  user: AuthUser;
}