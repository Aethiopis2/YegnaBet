import { BriefcaseBusiness, Pencil, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EmployeeShell, useAppContext } from "../../components/employee/EmployeeShell";
import { LoadMoreSentinel } from "../../components/explorer/LoadMoreSentinel";
import { OkCancelDialog } from "../../components/ui/common/OkCancelDialog";
import { getEmployeeDeals, removeEmployeeDeal, updateEmployeeDeal } from "../../lib/employee/employeeDealsApi";
import type { DealStatus, EmployeeDeal } from "../../types/employee/employeeDeal";

const money = new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB", maximumFractionDigits: 2 });

function EmployeeDealsContent() {
  const { token } = useAppContext();
  const [deals, setDeals] = useState<EmployeeDeal[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DealStatus | "All">("All");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editTarget, setEditTarget] = useState<EmployeeDeal | null>(null);
  const [removeTarget, setRemoveTarget] = useState<EmployeeDeal | null>(null);
  const [dealValue, setDealValue] = useState("");
  const [commissionRate, setCommissionRate] = useState("");
  const [editStatus, setEditStatus] = useState<DealStatus>("Pending");
  const [saving, setSaving] = useState(false);
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
    setDeals([]);
    setPage(0);
    setHasMore(true);
    getEmployeeDeals(token, 0, search, status)
      .then(result => {
        if (!active || requestId !== requestIdRef.current) return;
        setDeals(result.items);
        setPage(result.page);
        setHasMore(result.hasMore);
        setTotalCount(result.totalCount);
      })
      .catch(loadError => {
        if (active && requestId === requestIdRef.current)
          setError(loadError instanceof Error ? loadError.message : "Could not load deals.");
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
  }, [search, status, token]);

  const loadMore = useCallback(async () => {
    if (!token || loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    setError("");
    const requestId = requestIdRef.current;
    try {
      const result = await getEmployeeDeals(token, page + 1, search, status);
      if (requestId !== requestIdRef.current) return;
      setDeals(current => [...current, ...result.items]);
      setPage(result.page);
      setHasMore(result.hasMore);
      setTotalCount(result.totalCount);
    } catch (loadError) {
      if (requestId === requestIdRef.current)
        setError(loadError instanceof Error ? loadError.message : "Could not load more deals.");
    } finally {
      if (requestId === requestIdRef.current) {
        loadingRef.current = false;
        setLoading(false);
      }
    }
  }, [hasMore, page, search, status, token]);

  const openEdit = (deal: EmployeeDeal) => {
    setEditTarget(deal);
    setDealValue(String(deal.dealValue));
    setCommissionRate(String(deal.commissionRate));
    setEditStatus(deal.status);
  };

  const saveDeal = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !editTarget) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateEmployeeDeal(token, editTarget.id, {
        dealValue: Number(dealValue),
        commissionRate: Number(commissionRate),
        status: editStatus,
      });
      setDeals(current => current.map(deal => deal.id === updated.id ? updated : deal));
      setEditTarget(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save deal changes.");
    } finally {
      setSaving(false);
    }
  };

  const confirmRemove = async () => {
    if (!token || !removeTarget) return;
    setRemoving(true);
    setError("");
    try {
      await removeEmployeeDeal(token, removeTarget.id);
      setDeals(current => current.filter(deal => deal.id !== removeTarget.id));
      setTotalCount(current => Math.max(0, current - 1));
      setRemoveTarget(null);
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Could not remove deal.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-yegna-700 dark:text-yegna-400">Sales</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Deals</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track negotiations, agreed prices, and commission through completion.</p>
      </header>

      {(error || !token || token === "null") && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{error || "Your session has expired. Sign in again to manage deals."}</div>}

      <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/6 dark:bg-white/[0.035]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 px-5 py-4 dark:border-white/8">
          <div className="flex items-center gap-2 text-sm font-semibold"><BriefcaseBusiness size={17} className="text-yegna-700 dark:text-yegna-400" /> Deal pipeline <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 dark:bg-white/8 dark:text-gray-300">{totalCount}</span></div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <label className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-gray-400 dark:border-white/10">
              <Search size={15} />
              <input aria-label="Search deals" value={searchInput} onChange={event => setSearchInput(event.target.value)} placeholder="Search listing or customer" className="min-w-0 flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400 dark:text-white sm:w-56" />
            </label>
            <select aria-label="Filter deals by status" value={status} onChange={event => setStatus(event.target.value as DealStatus | "All")} className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none dark:border-white/10 dark:bg-[#151b17] dark:text-white">
              <option value="All">All statuses</option>
              <option value="Pending">In progress</option>
              <option value="Successful">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        {loading && deals.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-gray-400">Loading deals…</p>
        ) : deals.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <BriefcaseBusiness className="mx-auto size-8 text-gray-300 dark:text-gray-600" />
            <p className="mt-3 text-sm font-semibold">{search ? "No deals match that search." : "No deals in this view yet."}</p>
            <p className="mt-1 text-xs text-gray-400">Deals appear here when an inquiry enters negotiation.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] text-left">
              <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:bg-white/[0.025]">
                <tr><th className="px-5 py-3">Listing / customer</th><th className="px-5 py-3">Agreed price</th><th className="px-5 py-3">Commission</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Completed</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/6">
                {deals.map(deal => (
                  <tr key={deal.id} className="hover:bg-gray-50/70 dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-4"><p className="text-sm font-semibold">{deal.listingTitle}</p><p className="mt-0.5 text-[10px] text-gray-400">{deal.listingLocation} · {deal.customerName} · {deal.customerPhone}</p></td>
                    <td className="px-5 py-4 text-xs font-semibold">{money.format(deal.dealValue)}</td>
                    <td className="px-5 py-4"><p className="text-xs font-semibold">{money.format(deal.commissionAmount)}</p><p className="mt-0.5 text-[10px] text-gray-400">{deal.commissionRate}%</p></td>
                    <td className="px-5 py-4"><StatusPill status={deal.status} /></td>
                    <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-300">{deal.completedAt ? new Date(deal.completedAt).toLocaleDateString() : "—"}</td>
                    <td className="px-5 py-4"><div className="flex justify-end gap-2">
                      <button type="button" onClick={() => openEdit(deal)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-yegna-500 hover:text-yegna-700 dark:border-white/10 dark:text-gray-300 dark:hover:text-yegna-400"><Pencil size={13} /> Edit</button>
                      {deal.status !== "Successful" && <button type="button" onClick={() => setRemoveTarget(deal)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10">Remove</button>}
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {error && deals.length > 0 && <p role="alert" className="px-5 py-3 text-sm text-red-600">{error}</p>}
      </section>

      <LoadMoreSentinel hasMore={hasMore} loading={loading} onLoadMore={() => void loadMore()} />

      {editTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !saving) setEditTarget(null); }}>
          <form onSubmit={event => void saveDeal(event)} className="w-full max-w-lg space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#171d19]">
            <div><h2 className="text-base font-semibold">Edit deal</h2><p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{editTarget.listingTitle} · {editTarget.customerName}</p></div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">Negotiated price (ETB)<input type="number" min="0.01" step="0.01" required value={dealValue} onChange={event => setDealValue(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-gray-900 outline-none focus:border-yegna-500 dark:border-white/10 dark:bg-white/[0.035] dark:text-white" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">Commission (%)<input type="number" min="0" max="100" step="0.01" required value={commissionRate} onChange={event => setCommissionRate(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-gray-900 outline-none focus:border-yegna-500 dark:border-white/10 dark:bg-white/[0.035] dark:text-white" /></label>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">Deal status<select value={editStatus} disabled={editTarget.status === "Successful"} onChange={event => setEditStatus(event.target.value as DealStatus)} className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-gray-900 outline-none dark:border-white/10 dark:bg-[#17201b] dark:text-white"><option value="Pending">In progress</option><option value="Successful">Completed</option><option value="Failed">Failed</option></select></label>
            </div>
            <p className="rounded-xl bg-yegna-50 px-3 py-2 text-xs text-yegna-800 dark:bg-yegna-900/20 dark:text-yegna-300">Estimated commission: {money.format((Number(dealValue) || 0) * (Number(commissionRate) || 0) / 100)}</p>
            {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setEditTarget(null)} disabled={saving} className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-white/5">Cancel</button><button type="submit" disabled={saving} className="rounded-xl bg-yegna-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-yegna-600 disabled:opacity-60">{saving ? "Saving…" : "Save deal"}</button></div>
          </form>
        </div>
      )}

      <OkCancelDialog
        open={removeTarget !== null}
        title="Remove deal?"
        message={removeTarget ? `Remove the in-progress deal for ${removeTarget.listingTitle}? Completed deals are retained with their financial records.` : ""}
        okText="Remove deal"
        variant="danger"
        busy={removing}
        onOk={() => void confirmRemove()}
        onCancel={() => !removing && setRemoveTarget(null)}
      />
    </div>
  );
}

function StatusPill({ status }: { status: DealStatus }) {
  const styles: Record<DealStatus, string> = {
    Pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    Successful: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    Failed: "bg-gray-100 text-gray-500 dark:bg-white/8 dark:text-gray-400",
  };
  const labels: Record<DealStatus, string> = { Pending: "In progress", Successful: "Completed", Failed: "Failed" };
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[status]}`}>{labels[status]}</span>;
}

export default function EmployeeDealsPage() {
  return <EmployeeShell><EmployeeDealsContent /></EmployeeShell>;
}
