
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  MetronomeIcon,
  RefreshCw,
  X,
} from "lucide-react";

import { AppShell } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";
import { RevenueTrend } from "../../components/business/RevenueTrend";

import { useOwnerDashboard } from "../../components/hooks/useOwnerDashboard";

// Adjust these imports to your actual component locations.
import Loading from "../../components/ui/common/Loading";
import  ErrorBlock  from "../../components/ui/common/ErrorBlock";

import type {
  DashboardPeriod,
  OwnerDashboardSummary,
} from "../../types/owner/ownerDashboard";
import { useNavigate } from "react-router-dom";

interface Metric {
  id: string;
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
  accent: string;
}



function ListingStatusBreakdown({
  total,
  active,
  pending,
  draft,
  closed,
  cancelled,
}: {
  total: number;
  active: number;
  pending: number;
  draft: number;
  closed: number;
  cancelled: number;
}) {
  const statuses = [
    { label: "Active", value: active, color: "bg-emerald-500" },
    { label: "Pending", value: pending, color: "bg-amber-500" },
    { label: "Draft", value: draft, color: "bg-slate-400" },
    { label: "Closed", value: closed, color: "bg-blue-500" },
    { label: "Cancelled", value: cancelled, color: "bg-red-500" },
  ];

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/4.5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Inventory status
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Distribution of all listings
          </p>
        </div>

        <span className="text-2xl font-bold text-slate-900 dark:text-white">
          {formatNumber(total)}
        </span>
      </div>

      <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        {statuses.map((status) => (
          <div
            key={status.label}
            className={`${status.color} transition-all`}
            style={{
              width: `${total > 0 ? (status.value / total) * 100 : 0}%`,
            }}
            title={`${status.label}: ${status.value}`}
          />
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {statuses.map((status) => (
          <div
            key={status.label}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${status.color}`} />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {status.label}
              </span>
            </div>

            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {formatNumber(status.value)}
              <span className="ml-2 font-normal text-slate-400">
                {total > 0
                  ? `${((status.value / total) * 100).toFixed(1)}%`
                  : "0%"}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}


function ListingQuality({
  verified,
  featured,
  unverified,
}: {
  verified: number;
  featured: number;
  unverified: number;
}) {
  const total = verified + unverified;
  const verificationRate =
    total > 0 ? (verified / total) * 100 : 0;

  const items = [
    { label: "Verified listings", value: verified },
    { label: "Featured listings", value: featured },
    { label: "Unverified listings", value: unverified },
  ];

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/4.5">
      <h3 className="font-semibold text-slate-900 dark:text-white">
        Listing quality
      </h3>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Verification and promotion status across inventory.
      </p>

      <div className="mt-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {verificationRate.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-500">
              Verification coverage
            </p>
          </div>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all dark:bg-orange-400"
            style={{ width: `${verificationRate}%` }}
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between"
          >
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {item.label}
            </span>

            <span className="font-semibold text-slate-900 dark:text-white">
              {formatNumber(item.value)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}


const formatNumber = (value?: number | null) =>
  (value ?? 0).toLocaleString();

function MetricCard({
  metric,
  onClick,
}: {
  metric: Metric;
  onClick: () => void;
}) {
  const Icon = metric.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-slate-200/80 bg-white p-5 text-left 
        shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/4.5"
    >
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.accent}`}>
          <Icon size={19} />
        </div>

        <ArrowRight
          size={17}
          className="text-slate-300 transition-transform group-hover:translate-x-1 dark:text-slate-600"
        />
      </div>

      <div className="mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {formatNumber(metric.value)}
      </div>

      <div className="mt-1 font-medium text-slate-700 dark:text-slate-200">
        {metric.label}
      </div>

      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {metric.description}
      </p>
    </button>
  );
}

function MetricDetails({
  metric,
  summary,
  onClose,
  onClick,
}: {
  metric: Metric;
  summary: OwnerDashboardSummary;
  onClose: () => void;
  onClick: (type: string, status: string) => void;
}) {
  const details: Record<string, { label: string; value: number }[]> = {
    listings: [
      { label: "Active", value: summary.overview.activeListings },
      { label: "Pending", value: summary.overview.pendingListings },
      { label: "Draft", value: summary.overview.draftListings },
      { label: "Closed", value: summary.overview.closedListings },
      { label: "Cancelled", value: summary.overview.cancelledListings },
    ],
    inquiries: [
      { label: "New", value: summary.inquiries.new },
      { label: "Negotiating", value: summary.inquiries.negotiating },
      { label: "Completed", value: summary.inquiries.completed },
      { label: "Cancelled", value: summary.inquiries.cancelled },
    ],
    deals: [
      { label: "Successful", value: summary.deals.successful },
      { label: "Pending", value: summary.deals.pending },
      { label: "Failed", value: summary.deals.failed },
    ],
    providers: [
      { label: "Active providers", value: summary.overview.totalProviders },
    ],
    employees: [
      { label: "Total employees", value: summary.overview.totalEmployees },
    ],
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/4.5">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => onClick(metric.id, metric.id === "deals" ? "Successful" : metric.id === "providers" || metric.id === "employees" ? "Active" : "All")} className="text-left">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {metric.label} breakdown
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {metric.description}
          </p>
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(details[metric.id] ?? []).map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onClick(metric.id, item.label.startsWith("Active ") ? "Active" : item.label.startsWith("Total ") ? "All" : item.label)}
            className="rounded-xl bg-slate-50 p-4 text-left transition hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {item.label}
            </div>
            <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {formatNumber(item.value)}
            </div>
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Select a breakdown to open matching records with paging and filters.
      </p>
    </div>
  );
}

export default function OwnerDashboard() {
  const {
    data,
    period,
    setPeriod,
    loading,
    error,
    refresh,
  } = useOwnerDashboard();

  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const periods: { label: string; value: DashboardPeriod }[] = [
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
    { label: "Last 90 days", value: "90d" },
    { label: "Last 12 months", value: "12m" },
  ];

  const metrics: Metric[] = data
    ? [
        {
          id: "listings",
          label: "Total listings",
          value: data.overview.totalListings,
          description: `${formatNumber(data.overview.activeListings)} currently active`,
          icon: Building2,
          accent: "bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400",
        },
        {
          id: "inquiries",
          label: "Inquiries",
          value: data.inquiries.total,
          description: `${formatNumber(data.inquiries.new)} new during this period`,
          icon: ClipboardList,
          accent: "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
        },
        {
          id: "deals",
          label: "Successful deals",
          value: data.deals.completedInPeriod,
          description: "Completed during this period",
          icon: CheckCircle2,
          accent: "bg-purple-50 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400",
        },
        {
          id: "providers",
          label: "Providers",
          value: data.overview.totalProviders,
          description: "Registered providers",
          icon: BriefcaseBusiness,
          accent: "bg-orange-50 text-orange-600 dark:bg-orange-400/10 dark:text-orange-400",
        },
        {
          id: "employees",
          label: "Employees",
          value: data.overview.totalEmployees,
          description: "Registered employees",
          icon: Activity,
          accent: "bg-cyan-50 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-400",
        },
      ]
    : [];

  const navigate = useNavigate();
  const activeCategory = data?.categories.find(
    (category) => category.id === selectedCategory
  );

  return (
    <AppShell>
      <PageContainer>
        <main className="pb-10">
          <header className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-orange-400/10 dark:text-orange-400">
                  <Activity size={15} />
                </span>

                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-orange-400">
                  Business intelligence
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Owner Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                An operational overview of YegnaBet's marketplace,
                transactions, providers and revenue.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <CalendarDays
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={period}
                  onChange={(e) =>
                    setPeriod(e.target.value as DashboardPeriod)
                  }
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm font-medium text-slate-600 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                >
                  {periods.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <button
                type="button"
                onClick={refresh}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white 
                  px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 
                  disabled:opacity-50 dark:border-white/10 dark:bg-white/4.5 
                  dark:text-slate-300 dark:hover:bg-white/8"
              >
                <RefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </header>

          {loading && !data && <Loading />}

          {error && (
            <div className="mb-5">
              <ErrorBlock message={error} />
            </div>
          )}

          {data && (
            <>
              <section className="mb-7">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Business overview
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Select a metric to inspect its breakdown.
                    </p>
                  </div>

                  {loading && (
                    <RefreshCw size={16} className="animate-spin text-slate-400" />
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {metrics.map((metric) => (
                    <MetricCard
                      key={metric.id}
                      metric={metric}
                      onClick={() => setSelectedMetric(metric)}
                    />
                  ))}
                </div>
              </section>

              {selectedMetric && (
                <section className="mb-7 cursor-pointer underline">
                  <MetricDetails
                    metric={selectedMetric}
                    summary={data}
                    onClose={() => setSelectedMetric(null)}
                  onClick={(type, status) => {
                    const params = new URLSearchParams({ type, status, period });
                    navigate(`/owner/listings?${params.toString()}`);
                  }}
                  />
                </section>
              )}

              <section className="mb-7 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
                <RevenueTrend
                  current={data.revenue.commissionGenerated}
                  previous={data.revenue.previousPeriodCommission}
                  growth={data.revenue.growthPercentage}
                  onClick={() => navigate(`/owner/commissions?period=${period}`)}
                />

                <ListingQuality
                  verified={data.listings.verified}
                  featured={data.listings.featured}
                  unverified={data.listings.unverified}
                />

                <ListingStatusBreakdown
                  total={data.overview.totalListings}
                  active={data.overview.activeListings}
                  pending={data.overview.pendingListings}
                  draft={data.overview.draftListings}
                  closed={data.overview.closedListings}
                  cancelled={data.overview.cancelledListings}
                />

                <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/10 
                  dark:bg-white/4.5">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Inquiry pipeline
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Inquiries received during the selected period.
                  </p>

                  <div className="mt-6 space-y-5">
                    {[
                      { label: "New", value: data.inquiries.new },
                      { label: "Negotiating", value: data.inquiries.negotiating },
                      { label: "Completed", value: data.inquiries.completed },
                      { label: "Cancelled", value: data.inquiries.cancelled },
                    ].map((item) => {
                      const percentage = data.inquiries.total > 0
                        ? (item.value / data.inquiries.total) * 100
                        : 0;

                      return (
                        <div key={item.label}>
                          <div className="mb-2 flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-300">
                              {item.label}
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {formatNumber(item.value)}
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                            <div
                              className="h-full rounded-full bg-emerald-600 transition-all duration-500 dark:bg-orange-400"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </section>

              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm 
                dark:border-white/10 dark:bg-white/4.5">
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Listing categories
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Inventory distribution across marketplace categories.
                  </p>
                </div>

                {data.categories.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No active categories found.
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {data.categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() =>
                          setSelectedCategory(
                            selectedCategory === category.id
                              ? null
                              : category.id
                          )
                        }
                        className={`rounded-xl border p-4 text-left transition ${
                          selectedCategory === category.id
                            ? "border-emerald-500 bg-emerald-50 dark:border-orange-400 dark:bg-orange-400/10"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-white/10 dark:bg-white/2.5 dark:hover:bg-white/6"
                        }`}
                      >
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {category.taxonomy}
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {category.name}
                          </span>
                          <span className="text-lg font-bold text-slate-900 dark:text-white">
                            {formatNumber(category.listingCount)}
                          </span>
                        </div>

                        <div className="mt-2 text-xs text-slate-500">
                          Listings
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {activeCategory && (
                  <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {activeCategory.name}
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          {formatNumber(activeCategory.listingCount)} assigned listings
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedCategory(null)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
                      >
                        <X size={17} />
                      </button>
                    </div>
                  </div>
                )}
              </section>

              <div className="mt-5 text-xs text-slate-400">
                Data period: {new Date(data.from).toLocaleDateString()} –{" "}
                {new Date(data.to).toLocaleDateString()}
              </div>
            </>
          )}
        </main>
      </PageContainer>
    </AppShell>
  );
}
