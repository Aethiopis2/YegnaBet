export type DashboardPeriod = "7d" | "30d" | "90d" | "12m";

export interface OwnerDashboardSummary {
  period: DashboardPeriod;
  from: string;
  to: string;

  overview: {
    totalListings: number;
    activeListings: number;
    pendingListings: number;
    draftListings: number;
    closedListings: number;
    cancelledListings: number;
    totalCustomers: number;
    totalProviders: number;
    totalEmployees: number;
  };

  inquiries: {
    total: number;
    new: number;
    negotiating: number;
    completed: number;
    cancelled: number;
  };

  deals: {
    completedInPeriod: number;
    successful: number;
    pending: number;
    failed: number;
  };

  revenue: {
    commissionGenerated: number;
    previousPeriodCommission: number;
    growthPercentage: number;
  };

  listings: {
    verified: number;
    featured: number;
    unverified: number;
  };

  categories: {
    id: number;
    name: string;
    taxonomy: string;
    listingCount: number;
  }[];
}