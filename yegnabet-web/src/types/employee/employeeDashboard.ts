type InquiryStatus = 'new' | 'negotiated' | 'completed' | 'cancelled';

export interface EmployeeDashboardStats {
    newRequests: number;
    activeRequests: number;
    completedRequests: number;
    needsAttention: number;
    requestGrowth: number;
}


export interface DailyInquiryTrend {
    date: Date; // ISO date string
    count: number;
}


export interface EmployeeInquiryDto {
    id: number;
    listingId: number;
    customerName: string;
    listingTitle: string;
    status: InquiryStatus;
    createdAt: string; // ISO date string
}


export interface EmployeeDashboardDto {
    stats: EmployeeDashboardStats;
    weeklyActivities: DailyInquiryTrend[];
    recentRequests: EmployeeInquiryDto[];
    activeRequests: EmployeeInquiryDto[];
}