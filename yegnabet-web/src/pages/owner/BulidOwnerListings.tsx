import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, Building2, Search, X } from "lucide-react";
import { useAuth } from "../../types/auth/authStore";
import { getOwnerRecords } from "../../lib/owner/ownerService";
import { getProviders } from "../../lib/employee/providerDirectoryApi";
import type { OwnerListing } from "../../types/owner/owner";
import type { ProviderAccount } from "../../types/employee/providerAccount";
import { LoadMoreSentinel } from "../../components/explorer/LoadMoreSentinel";

type RecordType = "listings" | "inquiries" | "deals" | "providers" | "employees";
const labels: Record<RecordType, string> = {
  listings: "Listings", inquiries: "Inquiries", deals: "Deals", providers: "Providers", employees: "Employees",
};
const filters: Record<RecordType, string[]> = {
  listings: ["All", "Active", "Pending", "Draft", "Closed", "Cancelled"],
  inquiries: ["All", "New", "Negotiating", "Completed", "Cancelled"],
  deals: ["All", "Successful", "Pending", "Failed"],
  providers: ["Active", "Inactive", "All"],
  employees: ["Active", "Inactive", "All"],
};

function readType(value: string | null): RecordType {
  return value && value in labels ? value as RecordType : "listings";
}

const dateText = (value?: string) => value ? new Date(value).toLocaleDateString() : "—";

export default function OwnerListings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const type = readType(searchParams.get("type"));
  const period = searchParams.get("period") ?? "30d";
  const providerIdParam = Number(searchParams.get("providerId"));
  const providerId = Number.isFinite(providerIdParam) && providerIdParam > 0 ? providerIdParam : undefined;
  const providerName = searchParams.get("providerName");
  const requestedStatus = searchParams.get("status") ?? (type === "providers" || type === "employees" ? "Active" : "All");
  const status = filters[type].includes(requestedStatus) ? requestedStatus : (type === "providers" || type === "employees" ? "Active" : "All");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<OwnerListing[]>([]);
  const [providers, setProviders] = useState<ProviderAccount[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<OwnerListing | null>(null);
  const loadingRef = useRef(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const loadPage = useCallback(async (pageNumber: number, reset = false) => {
    if (!accessToken || (loadingRef.current && !reset)) return;
    if (reset) requestIdRef.current++;
    const requestId = requestIdRef.current;
    loadingRef.current = true;
    setLoading(true);
    setError("");
    try {
      if (type === "providers") {
        const result = await getProviders(accessToken, pageNumber, search, 10,
          status === "All" ? undefined : status === "Active");
        if (requestId !== requestIdRef.current) return;
        setProviders(current => reset ? result.items : [...current, ...result.items]);
        setRows([]);
        setTotalCount(result.totalCount);
        setPage(result.page);
        setHasMore(result.hasMore);
      } else {
        const result = await getOwnerRecords(type, accessToken, pageNumber, {
          status, search, period, providerId: type === "listings" ? providerId : undefined,
        });
        if (requestId !== requestIdRef.current) return;
        setRows(current => reset ? result.items : [...current, ...result.items]);
        setProviders([]);
        setTotalCount(result.totalCount);
        setPage(result.page);
        setHasMore(result.hasMore);
      }
    } catch (loadError) {
      if (requestId === requestIdRef.current)
        setError(loadError instanceof Error ? loadError.message : "Could not load records.");
    } finally {
      if (requestId === requestIdRef.current) {
        loadingRef.current = false;
        setLoading(false);
      }
    }
  }, [accessToken, period, providerId, search, status, type]);

  useEffect(() => {
    loadingRef.current = false;
    setRows([]);
    setProviders([]);
    setPage(0);
    setHasMore(true);
    void loadPage(0, true);
    return () => { requestIdRef.current++; loadingRef.current = false; };
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (!loadingRef.current && hasMore) void loadPage(page + 1);
  }, [hasMore, loadPage, page]);

  const changeStatus = (nextStatus: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("status", nextStatus);
    setSearchParams(next);
  };

  const openProviderListings = (provider: ProviderAccount) => {
    const params = new URLSearchParams({ type: "listings", status: "All", period });
    params.set("providerId", String(provider.id));
    params.set("providerName", provider.fullName);
    navigate(`/owner/listings?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-[#0c111b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7">
          <Link to="/owner" className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white"><ArrowLeft size={16} /> Back to dashboard</Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{providerId && type === "listings" ? `${providerName || "Provider"} listings` : `${labels[type]} management`}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {providerId && type === "listings" ? "Listings assigned to this provider." : type === "inquiries" || type === "deals" ? `Records from the selected ${period} dashboard period.` : `Browse and filter ${labels[type].toLowerCase()} in the system.`}
          </p>
        </header>

        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap gap-2">
            {filters[type].map(value => (
              <button key={value} type="button" onClick={() => changeStatus(value)} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${status === value ? "bg-slate-900 text-white dark:bg-orange-400 dark:text-slate-950" : "border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"}`}>
                {value === "All" ? `All ${labels[type].toLowerCase()}` : value}
              </button>
            ))}
          </div>
          <label className="relative mt-4 block max-w-xl">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input aria-label={`Search ${labels[type].toLowerCase()}`} value={searchInput} onChange={event => setSearchInput(event.target.value)} placeholder={`Search ${labels[type].toLowerCase()}...`} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-white" />
            {searchInput && <button type="button" aria-label="Clear search" onClick={() => setSearchInput("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"><X size={15} /></button>}
          </label>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/10">
            <div><h2 className="font-semibold text-slate-900 dark:text-white">{labels[type]}</h2><p className="mt-1 text-xs text-slate-500">{totalCount.toLocaleString()} matching records</p></div>
            {type === "providers" && <Building2 size={18} className="text-slate-400" />}
          </div>

          {error && <p role="alert" className="m-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</p>}
          {loading && rows.length === 0 && providers.length === 0 ? <p className="p-12 text-center text-sm text-slate-400">Loading {labels[type].toLowerCase()}…</p> : null}
          {!loading && !error && totalCount === 0 ? <p className="p-12 text-center text-sm text-slate-400">No {labels[type].toLowerCase()} match these filters.</p> : null}

          {type === "providers" ? (
            <div className="divide-y divide-slate-100 dark:divide-white/10">
              {providers.map(provider => <button type="button" key={provider.id} onClick={() => openProviderListings(provider)} className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 dark:hover:bg-white/5">
                <div><h3 className="font-semibold text-slate-900 dark:text-white">{provider.fullName}</h3><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{provider.phoneNumber}{provider.email ? ` · ${provider.email}` : ""}</p></div>
                <div className="flex items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${provider.isActive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`}>{provider.isActive ? "Active" : "Inactive"}</span>{provider.isVerified && <span className="inline-flex items-center gap-1 text-xs text-emerald-600"><BadgeCheck size={14} /> Verified</span>}<span className="text-xs text-slate-400">Joined {dateText(provider.createdAt)}</span></div>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">View listings →</span>
              </button>)}
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/10">
              {rows.map(row => type === "employees" ? <button type="button" key={row.id} onClick={() => setSelectedEmployee(row)} className="flex w-full flex-col gap-3 p-5 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 dark:hover:bg-white/5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-slate-900 dark:text-white">{row.title}</h3>{row.verified && <BadgeCheck size={15} className="text-emerald-500" />}</div><p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{row.provider ? `Phone: ${row.provider}` : "Employee account"}</p></div><div className="flex items-center gap-3 text-xs"><span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">{row.status}</span><span className="text-slate-400">Joined {dateText(row.createdAt)}</span><span className="font-semibold text-emerald-700 dark:text-emerald-400">View details →</span></div>
              </button> : <button type="button" key={row.id} onClick={() => navigate(`/listing/${row.listingId ?? row.id}?edit=true`, { state: { from: `${window.location.pathname}${window.location.search}` } })} className="flex w-full flex-col gap-3 p-5 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 dark:hover:bg-white/5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-slate-900 dark:text-white">{row.title}</h3>{row.verified && <BadgeCheck size={15} className="text-emerald-500" />}</div><p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{row.category}{row.location ? ` · ${row.location}` : ""}{row.provider ? ` · ${row.provider}` : ""}</p></div>
                <div className="flex flex-wrap items-center gap-3 text-xs"><span className="font-semibold text-slate-700 dark:text-slate-200">{type === "deals" ? `${(row.price ?? 0).toLocaleString()} ETB deal` : type === "listings" ? `${(row.price ?? 0).toLocaleString()} ETB` : `${row.views} views`}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">{row.status ?? row.listingStatus}</span><span className="text-slate-400">{dateText(row.createdAt)}</span></div>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Open listing →</span>
              </button>)}
            </div>
          )}
        </section>

        <LoadMoreSentinel hasMore={hasMore} loading={loading} onLoadMore={loadMore} />
      </div>
      {selectedEmployee && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setSelectedEmployee(null); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="employee-detail-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#151b17]">
          <div className="flex items-start justify-between gap-3"><div><h2 id="employee-detail-title" className="text-lg font-bold text-slate-900 dark:text-white">{selectedEmployee.title}</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Employee account details</p></div><button type="button" aria-label="Close details" onClick={() => setSelectedEmployee(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"><X size={18} /></button></div>
          <dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-3"><dt className="text-slate-500">Phone</dt><dd className="font-medium text-slate-800 dark:text-slate-200">{selectedEmployee.provider || "—"}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">Status</dt><dd className="font-medium text-slate-800 dark:text-slate-200">{selectedEmployee.status}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">Verified</dt><dd className="font-medium text-slate-800 dark:text-slate-200">{selectedEmployee.verified ? "Yes" : "No"}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">Joined</dt><dd className="font-medium text-slate-800 dark:text-slate-200">{dateText(selectedEmployee.createdAt)}</dd></div></dl>
        </section>
      </div>}
    </div>
  );
}
