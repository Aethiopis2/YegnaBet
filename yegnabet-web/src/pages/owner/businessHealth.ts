export type HealthTrend = "up" | "down" | "stable";

export interface HealthMetric {
  id: string;
  label: string;
  score: number;
  description: string;
  value: string;
  trend?: string;
  trendDirection?: HealthTrend;
  icon: string;
  accent?: "green" | "orange" | "blue" | "purple";
}

export interface Opportunity {
  id: number;
  severity: "high" | "medium" | "positive";
  title: string;
  description?: string;
  value?: string;
  action?: string;
}

export const businessHealth = {
  overall: 78,

  metrics: [
    {
      id: "demand",
      label: "Demand",
      score: 84,
      description: "Customer interest across the marketplace",
      value: "4,820",
      trend: "+12.4%",
      trendDirection: "up",
      icon: "search",
      accent: "green",
    },

    {
      id: "supply",
      label: "Supply",
      score: 76,
      description: "Active listings available to customers",
      value: "1,642",
      trend: "+8.1%",
      trendDirection: "up",
      icon: "building",
      accent: "blue",
    },

    {
      id: "liquidity",
      label: "Liquidity",
      score: 69,
      description: "How efficiently demand becomes relevant results",
      value: "31%",
      trend: "+4.8%",
      trendDirection: "up",
      icon: "activity",
      accent: "orange",
    },

    {
      id: "financial",
      label: "Financial",
      score: 71,
      description: "Revenue and transaction performance",
      value: "18%",
      trend: "+18%",
      trendDirection: "up",
      icon: "wallet",
      accent: "purple",
    },

    {
      id: "customer",
      label: "Customer",
      score: 82,
      description: "Customer retention and engagement",
      value: "64%",
      trend: "+6.2%",
      trendDirection: "up",
      icon: "users",
      accent: "green",
    },

    {
      id: "provider",
      label: "Provider",
      score: 75,
      description: "Provider activity and retention",
      value: "71%",
      trend: "-2.1%",
      trendDirection: "down",
      icon: "briefcase",
      accent: "orange",
    },
  ] satisfies HealthMetric[],

  opportunities: [
    {
      id: 1,
      severity: "high",
      title: "Apartment demand exceeds supply",
      description:
        "Customer searches for apartments are significantly higher than available inventory.",
      value: "27%",
      action: "View apartments",
    },

    {
      id: 2,
      severity: "medium",
      title: "Providers need attention",
      description:
        "43 providers have not updated their listings recently.",
      value: "43",
      action: "Review providers",
    },

    {
      id: 3,
      severity: "high",
      title: "Enquiries are going unanswered",
      description:
        "18% of customer enquiries currently receive no response.",
      value: "18%",
      action: "Investigate",
    },

    {
      id: 4,
      severity: "positive",
      title: "Bole is outperforming the city",
      description:
        "Property conversion in Bole is significantly above the city average.",
      value: "2.1×",
      action: "Explore",
    },

    {
      id: 5,
      severity: "positive",
      title: "Land revenue is accelerating",
      description:
        "Land-related revenue continues to grow strongly.",
      value: "+34%",
      action: "View report",
    },
  ] satisfies Opportunity[],

  market: {
    searches: 4820,
    relevantResults: 1494,
    activeListings: 1642,
    activeProviders: 438,
    responseRate: 82,
  },

  revenue: {
    current: 18_420_000,
    previous: 15_610_000,
    growth: 18,
  },
};