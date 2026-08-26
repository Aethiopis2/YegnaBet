import {
  BarChart3,
  BriefcaseBusiness,
  Eye,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";

import { AppShell } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";

import { ProviderHealth } from "../../components/provider/ProviderHealth";
import { ProviderStatCard } from "../../components/provider/ProviderStatCard";
import { ProviderListingPreview } from "../../components/provider/ProviderListingPreview";
import { ProviderOpportunityList } from "../../components/provider/ProviderOpportunityList";

import { providerData } from "./providerData";

export default function ProviderDashboard() {
  const provider = providerData.provider;

  return (
    <AppShell>
      <PageContainer>
        <main className="pb-12">

          {/* ======================================================== */}
          {/* HEADER                                                   */}
          {/* ======================================================== */}

          <header className="mb-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="
                      rounded-full
                      bg-emerald-50
                      px-3 py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-emerald-700

                      dark:bg-orange-400/10
                      dark:text-orange-400
                    "
                  >
                    Provider Studio
                  </span>

                  {provider.verified && (
                    <span className="text-xs text-emerald-600 dark:text-orange-400">
                      ✓ Verified
                    </span>
                  )}
                </div>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Good morning, {provider.name.split(" ")[0]} 👋
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Here's how your listings and business are doing.
                </p>
              </div>

              <button
                type="button"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-900
                  px-5 py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                  hover:bg-slate-800

                  dark:bg-orange-400
                  dark:text-slate-950
                  dark:hover:bg-orange-300
                "
              >
                <Plus size={18} />
                Add Listing
              </button>
            </div>
          </header>

          {/* ======================================================== */}
          {/* PROVIDER HEALTH                                          */}
          {/* ======================================================== */}

          <div className="mb-6">
            <ProviderHealth score={provider.health} />
          </div>

          {/* ======================================================== */}
          {/* STATISTICS                                                */}
          {/* ======================================================== */}

          <section className="mb-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <ProviderStatCard
                label="Active listings"
                value={providerData.stats.activeListings}
                change="+2"
                icon={BriefcaseBusiness}
              />

              <ProviderStatCard
                label="Listing views"
                value={providerData.stats.totalViews}
                change="+18%"
                icon={Eye}
              />

              <ProviderStatCard
                label="Customer enquiries"
                value={providerData.stats.enquiries}
                change="+12%"
                icon={MessageCircle}
              />

              <ProviderStatCard
                label="Deals"
                value={providerData.stats.deals}
                change="+33%"
                icon={BarChart3}
              />

            </div>
          </section>

          {/* ======================================================== */}
          {/* LISTINGS                                                  */}
          {/* ======================================================== */}

          <section className="mb-8">

            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  My Listings
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage the properties and services you currently offer.
                </p>
              </div>

              <button
                type="button"
                className="
                  hidden
                  items-center
                  gap-1
                  text-sm
                  font-semibold
                  text-emerald-700
                  sm:flex

                  dark:text-orange-400
                "
              >
                View all
                <span>→</span>
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {providerData.listings.map((listing) => (
                <ProviderListingPreview
                  key={listing.id}
                  listing={listing}
                  onEdit={(item) =>
                    console.log("Edit listing", item.id)
                  }
                  onOpen={(item) =>
                    console.log("Open listing", item.id)
                  }
                />
              ))}

              {/* ADD LISTING CARD */}

              <button
                type="button"
                className="
                  group
                  flex
                  min-h-[340px]
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border-2
                  border-dashed
                  border-slate-200
                  bg-slate-50/50
                  text-slate-400
                  transition-all
                  hover:border-emerald-400
                  hover:bg-emerald-50/40
                  hover:text-emerald-600

                  dark:border-white/10
                  dark:bg-white/[0.02]
                  dark:hover:border-orange-400/40
                  dark:hover:bg-orange-400/5
                  dark:hover:text-orange-400
                "
              >
                <div
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-full
                    border
                    border-current
                    transition-transform
                    group-hover:scale-110
                  "
                >
                  <Plus size={21} />
                </div>

                <span className="mt-4 font-semibold">
                  Add another listing
                </span>

                <span className="mt-1 text-xs opacity-70">
                  House, apartment, land or service
                </span>
              </button>
            </div>
          </section>

          {/* ======================================================== */}
          {/* LOWER AREA                                                */}
          {/* ======================================================== */}

          <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">

            {/* PERFORMANCE */}

            <section
              className="
                rounded-2xl
                border border-slate-200/80
                bg-white
                p-6
                shadow-sm

                dark:border-white/10
                dark:bg-white/[0.045]
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    Listing performance
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Engagement over the last 30 days.
                  </p>
                </div>

                <BarChart3
                  size={19}
                  className="text-emerald-600 dark:text-orange-400"
                />
              </div>

              <div className="mt-8 flex h-44 items-end gap-2">
                {[28, 36, 31, 43, 39, 52, 47, 61, 58, 69, 74, 81, 77, 89].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="
                        group
                        relative
                        flex-1
                        rounded-t-md
                        bg-emerald-100
                        dark:bg-orange-400/10
                      "
                      style={{
                        height: `${height}%`,
                      }}
                    >
                      <div
                        className="
                          absolute
                          inset-x-0
                          bottom-0
                          rounded-t-md
                          bg-emerald-600
                          dark:bg-orange-400
                        "
                        style={{
                          height: "100%",
                          opacity:
                            0.35 + index * 0.035,
                        }}
                      />
                    </div>
                  )
                )}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
            </section>

            {/* REQUESTS */}

            <section
              className="
                overflow-hidden
                rounded-2xl
                border border-slate-200/80
                bg-white
                shadow-sm

                dark:border-white/10
                dark:bg-white/[0.045]
              "
            >
              <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 dark:border-white/10">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    Recent requests
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Customers looking for something you offer.
                  </p>
                </div>

                <Users
                  size={19}
                  className="text-emerald-600 dark:text-orange-400"
                />
              </div>

              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {providerData.requests.map((request) => (
                  <button
                    key={request.id}
                    type="button"
                    className="
                      flex w-full
                      items-center gap-4
                      px-6 py-4
                      text-left
                      transition-colors
                      hover:bg-slate-50
                      dark:hover:bg-white/[0.035]
                    "
                  >
                    <div
                      className="
                        flex h-10 w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-slate-100
                        text-xs
                        font-bold
                        text-slate-600
                        dark:bg-white/10
                        dark:text-slate-300
                      "
                    >
                      {request.customer
                        .split(" ")
                        .map((x) => x[0])
                        .join("")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {request.customer}
                        </span>

                        {request.status === "new" && (
                          <span
                            className="
                              rounded-full
                              bg-emerald-50
                              px-2 py-1
                              text-[9px]
                              font-bold
                              uppercase
                              text-emerald-700

                              dark:bg-orange-400/10
                              dark:text-orange-400
                            "
                          >
                            New
                          </span>
                        )}
                      </div>

                      <div className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                        {request.request} · {request.location}
                      </div>

                      <div className="mt-1 text-[11px] text-slate-400">
                        {request.budget} · {request.received}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="
                  flex w-full
                  items-center
                  justify-center
                  gap-2
                  border-t
                  border-slate-100
                  px-5 py-4
                  text-xs
                  font-semibold
                  text-emerald-700

                  dark:border-white/10
                  dark:text-orange-400
                "
              >
                View all requests →
              </button>
            </section>
          </section>

          {/* ======================================================== */}
          {/* OPPORTUNITIES                                             */}
          {/* ======================================================== */}

          <div className="mt-6">
            <ProviderOpportunityList
              items={providerData.opportunities}
              onSelect={(item) =>
                console.log("Opportunity", item.id)
              }
            />
          </div>

        </main>
      </PageContainer>
    </AppShell>
  );
}