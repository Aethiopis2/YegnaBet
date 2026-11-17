import { useCallback, useEffect, useState } from "react";
import { getOwnerDashboardSummary } from "../../lib/owner/ownerService";

import type {
  DashboardPeriod,
  OwnerDashboardSummary,
} from "../../types/owner/ownerDashboard";
import { useAuth } from "../../types/auth/authStore";

export function useOwnerDashboard() {
  const [period, setPeriod] = useState<DashboardPeriod>("30d");
  const [data, setData] = useState<OwnerDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useAuth();

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getOwnerDashboardSummary(period, String(accessToken));
      setData(result);
    } catch (err) {
      console.error("Failed to load owner dashboard:", err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    data,
    period,
    setPeriod,
    loading,
    error,
    refresh: loadDashboard,
  };
}
