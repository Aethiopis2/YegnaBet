import { Building2, Pencil, Search, UserPlus, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EmployeeShell, useAppContext } from "../../components/employee/EmployeeShell";
import { LoadMoreSentinel } from "../../components/explorer/LoadMoreSentinel";
import { OkCancelDialog } from "../../components/ui/common/OkCancelDialog";
import { getProviders, removeProvider } from "../../lib/employee/providerDirectoryApi";
import type { ProviderAccount } from "../../types/employee/providerAccount";

function ProviderDirectoryContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAppContext();
  const [providers, setProviders] = useState<ProviderAccount[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<string>(location.state?.notice ?? "");
  const [removeTarget, setRemoveTarget] = useState<ProviderAccount | null>(null);
  const [removing, setRemoving] = useState(false);
  const loadingRef = useRef(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!token || token === "null") {
      setLoading(false);
      return;
    }
    const requestId = ++requestIdRef.current;
    let active = true;
    loadingRef.current = true;
    setLoading(true);
    setError("");
    setProviders([]);
    setPage(0);
    setHasMore(true);
    getProviders(token, 0, search)
      .then(result => {
        if (!active || requestId !== requestIdRef.current) return;
        setProviders(result.items);
        setPage(result.page);
        setHasMore(result.hasMore);
        setTotalCount(result.totalCount);
      })
      .catch(loadError => {
        if (active && requestId === requestIdRef.current)
          setError(loadError instanceof Error ? loadError.message : "Could not load providers.");
      })
      .finally(() => {
        if (active && requestId === requestIdRef.current) {
          loadingRef.current = false;
          setLoading(false);
        }
      });
    return () => {
      active = false;
      loadingRef.current = false;
      requestIdRef.current++;
    };
  }, [token, search]);

  const loadMore = useCallback(async () => {
    if (!token || loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    setError("");
    const requestId = requestIdRef.current;
    const nextPage = page + 1;
    try {
      const result = await getProviders(token, nextPage, search);
      if (requestId !== requestIdRef.current) return;
      setProviders(current => [...current, ...result.items]);
      setPage(result.page);
      setHasMore(result.hasMore);
      setTotalCount(result.totalCount);
    } catch (loadError) {
      if (requestId === requestIdRef.current)
        setError(loadError instanceof Error ? loadError.message : "Could not load more providers.");
    } finally {
      if (requestId === requestIdRef.current) {
        loadingRef.current = false;
        setLoading(false);
      }
    }
  }, [hasMore, page, search, token]);

  const confirmRemove = async () => {
    if (!token || !removeTarget) return;
    setRemoving(true);
    setError("");
    try {
      await removeProvider(token, removeTarget.id);
      setProviders(current => current.map(provider => provider.id === removeTarget.id
        ? { ...provider, isActive: false }
        : provider));
      setNotice(`${removeTarget.fullName} was deactivated.`);
      setRemoveTarget(null);
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Could not remove provider.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-yegna-700 dark:text-yegna-400">People</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Providers</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage provider accounts and access.</p>
        </div>
        <Link to="/employee/providers/new" className="inline-flex items-center gap-2 rounded-xl bg-yegna-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-yegna-600">
          <UserPlus size={16} /> Add provider
        </Link>
      </header>

      {notice && <div role="status" className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">{notice}<button type="button" onClick={() => setNotice("")} className="ml-4 text-xs font-semibold">Dismiss</button></div>}
      {(error || !token || token === "null") && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{error || "Your session has expired. Sign in again to manage providers."}</div>}

      <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/6 dark:bg-white/[0.035]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 px-5 py-4 dark:border-white/8">
          <div className="flex items-center gap-2 text-sm font-semibold"><Building2 size={17} className="text-yegna-700 dark:text-yegna-400" /> Provider directory <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 dark:bg-white/8 dark:text-gray-300">{totalCount}</span></div>
          <label className="flex w-full items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-gray-400 sm:w-64 dark:border-white/10">
            <Search size={15} />
            <input aria-label="Search providers" value={searchInput} onChange={event => setSearchInput(event.target.value)} placeholder="Search providers" className="min-w-0 flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400 dark:text-white" />
          </label>
        </div>

        {loading && providers.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-gray-400">Loading providers…</p>
        ) : providers.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Users className="mx-auto size-8 text-gray-300 dark:text-gray-600" />
            <p className="mt-3 text-sm font-semibold">{search ? "No providers match that search." : "No provider accounts yet."}</p>
            {!search && <p className="mt-1 text-xs text-gray-400">Add a provider to get started.</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:bg-white/[0.025]">
                <tr><th className="px-5 py-3">Provider</th><th className="px-5 py-3">Phone</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/6">
                {providers.map(provider => (
                  <tr key={provider.id} className="hover:bg-gray-50/70 dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-4"><button type="button" onClick={() => navigate(`/employee/providers/${provider.id}/listings`, { state: { from: `${location.pathname}${location.search}`, token } })} className="text-left"><span className="text-sm font-semibold text-yegna-800 hover:underline dark:text-yegna-300">{provider.fullName}</span><span className="mt-0.5 block text-[10px] text-gray-400">Provider #{provider.id} · View listings</span></button></td>
                    <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-300">{provider.phoneNumber}</td>
                    <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-300">{provider.email || "—"}</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${provider.isActive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-gray-100 text-gray-500 dark:bg-white/8 dark:text-gray-400"}`}>{provider.isActive ? "Active" : "Inactive"}</span></td>
                    <td className="px-5 py-4"><div className="flex justify-end gap-2">
                      <button type="button" onClick={() => navigate(`/employee/providers/${provider.id}/edit`)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-yegna-500 hover:text-yegna-700 dark:border-white/10 dark:text-gray-300 dark:hover:text-yegna-400"><Pencil size={13} /> Edit</button>
                      {provider.isActive && <button type="button" onClick={() => setRemoveTarget(provider)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10">Remove</button>}
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {error && providers.length > 0 && <p role="alert" className="px-5 py-3 text-sm text-red-600">{error}</p>}
      </section>

      <LoadMoreSentinel hasMore={hasMore} loading={loading} onLoadMore={() => void loadMore()} />
      <OkCancelDialog
        open={removeTarget !== null}
        title="Remove provider?"
        message={removeTarget ? `Deactivate ${removeTarget.fullName}'s provider account? Existing listings will remain in the system.` : ""}
        okText="Remove provider"
        variant="danger"
        busy={removing}
        onOk={() => void confirmRemove()}
        onCancel={() => !removing && setRemoveTarget(null)}
      />
    </div>
  );
}

export default function ProviderDirectoryPage() {
  return <EmployeeShell><ProviderDirectoryContent /></EmployeeShell>;
}
