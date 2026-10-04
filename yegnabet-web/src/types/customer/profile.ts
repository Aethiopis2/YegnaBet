export type UserRole = "Customer" 
  | "Provider"
  | "Employee"
  | "Owner";

export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
  email?: string;
  avatarUrl?: string;
  country?: string;
  city?: string;
  area?: string;
  subArea?: string;
  verified: boolean;
}