export interface ProviderAccount {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderDirectoryPage {
  items: ProviderAccount[];
  page: number;
  pageSize: number;
  hasMore: boolean;
  totalCount: number;
}

export interface CreateProviderAccountRequest {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface UpdateProviderAccountRequest {
  fullName: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  newPassword?: string;
}
