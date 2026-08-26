import type { HealthMetric } from "../../pages/owner/businessHealth";
import { HealthMetricCard } from "./HealthMetricCard";

interface HealthMetricGridProps {
  metrics: HealthMetric[];
  onMetricClick?: (metric: HealthMetric) => void;
}

export function HealthMetricGrid({
  metrics,
  onMetricClick,
}: HealthMetricGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => (
        <HealthMetricCard
          key={metric.id}
          metric={metric}
          onClick={() => onMetricClick?.(metric)}
        />
      ))}
    </div>
  );
}