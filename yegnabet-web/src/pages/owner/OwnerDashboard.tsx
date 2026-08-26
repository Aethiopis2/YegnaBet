import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Download,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { AppShell } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";

import { HealthScore } from "../../components/business/HealthScore";
import { HealthMetricGrid } from "../../components/business/HealthMetricGrid";
import { MarketBalance } from "../../components/business/MarketBalance";
import { OpportunityList } from "../../components/business/OpportunityList";
import { RevenueTrend } from "../../components/business/RevenueTrend";

import { businessHealth } from "./businessHealth";

export default function OwnerDashboard() {
  return (
    <AppShell>
      <PageContainer>
        <main className="pb-10">
          {/* --------------------------------------------------------- */}
          {/* HEADER                                                    */}
          {/* --------------------------------------------------------- */}

          <header className="mb-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="
                      flex h-7 w-7 items-center justify-center
                      rounded-lg
                      bg-emerald-50
                      text-emerald-700

                      dark:bg-orange-400/10
                      dark:text-orange-400
                    "
                  >
                    <Sparkles size={15} />
                  </span>

                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-orange-400">
                    Business intelligence
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Business Health
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  A live view of how Yegna Bet is performing across demand,
                  supply, customers, providers and revenue.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="
                    inline-flex items-center gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4 py-2.5
                    text-sm font-medium
                    text-slate-600
                    shadow-sm

                    hover:bg-slate-50

                    dark:border-white/10
                    dark:bg-white/[0.045]
                    dark:text-slate-300
                    dark:hover:bg-white/[0.08]
                  "
                >
                  <CalendarDays size={16} />
                  Last 30 days
                  <ChevronDown size={14} />
                </button>

                <button
                  type="button"
                  className="
                    inline-flex items-center gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4 py-2.5
                    text-sm font-medium
                    text-slate-600
                    shadow-sm

                    hover:bg-slate-50

                    dark:border-white/10
                    dark:bg-white/[0.045]
                    dark:text-slate-300
                    dark:hover:bg-white/[0.08]
                  "
                >
                  <RefreshCw size={15} />
                  Refresh
                </button>

                <button
                  type="button"
                  className="
                    inline-flex items-center gap-2
                    rounded-xl
                    bg-slate-900
                    px-4 py-2.5
                    text-sm font-semibold
                    text-white
                    shadow-sm

                    hover:bg-slate-800

                    dark:bg-orange-400
                    dark:text-slate-950
                    dark:hover:bg-orange-300
                  "
                >
                  <Download size={15} />
                  Export
                </button>
              </div>
            </div>
          </header>

          {/* --------------------------------------------------------- */}
          {/* OVERALL HEALTH                                            */}
          {/* --------------------------------------------------------- */}

          <section
            className="
              relative
              mb-6
              overflow-hidden
              rounded-3xl
              border
              border-slate-200/80
              bg-white
              p-6
              shadow-sm

              dark:border-white/10
              dark:bg-white/[0.045]
            "
          >
            {/* decorative glow */}
            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-64
                w-64
                rounded-full
                bg-emerald-500/5
                blur-3xl

                dark:bg-orange-400/10
              "
            />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
              <HealthScore score={businessHealth.overall} />

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Overall business health
                  </h2>

                  <span
                    className="
                      rounded-full
                      bg-emerald-50
                      px-3 py-1
                      text-xs font-semibold
                      text-emerald-700

                      dark:bg-orange-400/10
                      dark:text-orange-400
                    "
                  >
                    Healthy
                  </span>
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Yegna Bet is performing well overall. Demand is strong and
                  customer health remains high, while marketplace liquidity
                  and provider activity are the areas that deserve the most
                  attention.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/5">
                    <div className="text-xs text-slate-400">
                      vs previous period
                    </div>

                    <div className="mt-1 font-semibold text-emerald-600 dark:text-orange-400">
                      +6 points
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/5">
                    <div className="text-xs text-slate-400">
                      strongest area
                    </div>

                    <div className="mt-1 font-semibold text-slate-900 dark:text-white">
                      Demand
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/5">
                    <div className="text-xs text-slate-400">
                      needs attention
                    </div>

                    <div className="mt-1 font-semibold text-slate-900 dark:text-white">
                      Liquidity
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl
                  border
                  border-slate-200
                  px-4 py-3
                  text-sm font-semibold
                  text-slate-700

                  hover:bg-slate-50

                  dark:border-white/10
                  dark:text-slate-300
                  dark:hover:bg-white/5
                "
              >
                View health report
                <ArrowRight size={15} />
              </button>
            </div>
          </section>

          {/* --------------------------------------------------------- */}
          {/* SIX HEALTH DIMENSIONS                                     */}
          {/* --------------------------------------------------------- */}

          <section className="mb-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Business dimensions
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                The six signals that make up the overall health score.
              </p>
            </div>

            <HealthMetricGrid
              metrics={businessHealth.metrics}
              onMetricClick={(metric) => {
                console.log("Selected health metric:", metric.id);
              }}
            />
          </section>

          {/* --------------------------------------------------------- */}
          {/* MARKET + REVENUE                                          */}
          {/* --------------------------------------------------------- */}

          <section className="mb-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
            <MarketBalance
              searches={businessHealth.market.searches}
              relevantResults={businessHealth.market.relevantResults}
              activeListings={businessHealth.market.activeListings}
            />

            <RevenueTrend
              current={businessHealth.revenue.current}
              previous={businessHealth.revenue.previous}
              growth={businessHealth.revenue.growth}
            />
          </section>

          {/* --------------------------------------------------------- */}
          {/* OPPORTUNITIES                                              */}
          {/* --------------------------------------------------------- */}

          <OpportunityList
            opportunities={businessHealth.opportunities}
            onSelect={(opportunity) => {
              console.log(
                "Selected opportunity:",
                opportunity.id
              );
            }}
          />
        </main>
      </PageContainer>
    </AppShell>
  );
}