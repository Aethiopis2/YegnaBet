import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, ChevronRight, Filter, Image as ImageIcon, Search, Wallet, X } from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";
import { LoadMoreSentinel } from "../../components/explorer/LoadMoreSentinel";
import Loading from "../../components/ui/common/Loading";
import ErrorBlock from "../../components/ui/common/ErrorBlock";
import { useAuth } from "../../types/auth/authStore";
import { ASSET_URL } from "../../types/api";
import { getOwnerCommissionDetail, getOwnerCommissions } from "../../lib/owner/ownerService";
import type { OwnerCommissionDetail, OwnerCommissionFilters, OwnerCommissionListItem } from "../../types/owner/ownerCommission";

const money = (amount: number, currency = "ETB") => new Intl.NumberFormat("en-ET", {
  style: "currency", currency, maximumFractionDigits: 2,
}).format(amount);

function dateInputValue(value: Date) {
  const local = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function periodStart(period: string | null) {
  const days = period === "7d" ? 7 : period === "90d" ? 90 : period === "12m" ? 365 : 30;
  const value = new Date();
  value.setDate(value.getDate() - days);
  return dateInputValue(value);
}

function assetUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  return `${ASSET_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function CommissionListPage() {
  const { accessToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInput = searchParams.get("search") ?? "";
  const [search, setSearch] = useState("");
  const method = searchParams.get("method") ?? "";
  const minAmount = searchParams.get("minAmount") ?? "";
  const maxAmount = searchParams.get("maxAmount") ?? "";
  const noDateFilter = searchParams.get("allDates") === "true";
  const from = searchParams.get("from") ?? (noDateFilter ? "" : periodStart(searchParams.get("period")));
  const to = searchParams.get("to") ?? (noDateFilter ? "" : dateInputValue(new Date()));
  const [items, setItems] = useState<OwnerCommissionListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const loadingRef = useRef(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("allDates");
    setSearchParams(next);
  };

  const loadPage = useCallback(async (pageNumber: number, reset = false) => {
    if (!accessToken || (loadingRef.current && !reset)) return;
    if (reset) requestIdRef.current++;
    const requestId = requestIdRef.current;
    loadingRef.current = true;
    setLoading(true);
    setError("");
    const filters: OwnerCommissionFilters = {
      ...(search ? { search } : {}),
      ...(method ? { method } : {}),
      ...(minAmount !== "" && Number.isFinite(Number(minAmount)) ? { minAmount: Number(minAmount) } : {}),
      ...(maxAmount !== "" && Number.isFinite(Number(maxAmount)) ? { maxAmount: Number(maxAmount) } : {}),
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    };
    try {
      const result = await getOwnerCommissions(accessToken, pageNumber, filters);
      if (requestId !== requestIdRef.current) return;
      setItems(current => reset ? result.items : [...current, ...result.items]);
      setTotalCount(result.totalCount);
      setTotalAmount(result.totalAmount);
      setPage(result.page);
      setHasMore(result.hasMore);
    } catch (loadError) {
      if (requestId === requestIdRef.current)
        setError(loadError instanceof Error ? loadError.message : "Could not load commission records.");
    } finally {
      if (requestId === requestIdRef.current) {
        loadingRef.current = false;
        setLoading(false);
      }
    }
  }, [accessToken, from, maxAmount, method, minAmount, search, to]);

  useEffect(() => {
    loadingRef.current = false;
    setItems([]);
    setPage(0);
    setHasMore(true);
    void loadPage(0, true);
    return () => { requestIdRef.current++; loadingRef.current = false; };
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (!loadingRef.current && hasMore) void loadPage(page + 1);
  }, [hasMore, loadPage, page]);

  const openDetail = (item: OwnerCommissionListItem) => {
    navigate(`/owner/commissions/${item.id}`, { state: { from: `${location.pathname}${location.search}` } });
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    const period = searchParams.get("period");
    if (period) next.set("period", period);
    next.set("allDates", "true");
    setSearchParams(next);
  };

  return (
    <AppShell>
      <PageContainer>
        <main className="mx-auto max-w-6xl px-1 py-6 sm:py-8">
          <Link to="/owner" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"><ArrowLeft size={16} /> Back to dashboard</Link>
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-700 dark:text-orange-400">Owner finance</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Commission records</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Successful listing deals and their earned commissions.</p></div>
            <div className="rounded-2xl border border-purple-100 bg-purple-50 px-5 py-3 dark:border-orange-400/20 dark:bg-orange-400/10"><p className="text-xs text-slate-500 dark:text-slate-400">Filtered total</p><p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{money(totalAmount)}</p></div>
          </header>

          <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
            <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"><Filter size={16} /> Search and filters</div><button type="button" onClick={clearFilters} className="text-xs font-semibold text-purple-700 hover:underline dark:text-orange-400">Clear all</button></div>
            <label className="relative block"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input aria-label="Search commission records" value={searchInput} onChange={event => updateFilter("search", event.target.value)} placeholder="Search listing, category, provider, employee, or reference" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none focus:border-purple-500 dark:border-white/10 dark:bg-white/5 dark:text-white" />{searchInput && <button type="button" onClick={() => updateFilter("search", "")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X size={15} /></button>}</label>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <label className="text-xs font-medium text-slate-500">Listing type<select value={method} onChange={event => updateFilter("method", event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none dark:border-white/10 dark:bg-[#151b17] dark:text-white"><option value="">All types</option><option value="Buy">For sale</option><option value="Rent">For rent</option><option value="Contract">Contract</option><option value="Service">Service</option></select></label>
              <label className="text-xs font-medium text-slate-500">Minimum commission<input type="number" min="0" value={minAmount} onChange={event => updateFilter("minAmount", event.target.value)} placeholder="Any" className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none dark:border-white/10 dark:bg-[#151b17] dark:text-white" /></label>
              <label className="text-xs font-medium text-slate-500">Maximum commission<input type="number" min="0" value={maxAmount} onChange={event => updateFilter("maxAmount", event.target.value)} placeholder="Any" className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none dark:border-white/10 dark:bg-[#151b17] dark:text-white" /></label>
              <label className="text-xs font-medium text-slate-500">From<input type="date" value={from} onChange={event => updateFilter("from", event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none dark:border-white/10 dark:bg-[#151b17] dark:text-white" /></label>
              <label className="text-xs font-medium text-slate-500">To<input type="date" value={to} onChange={event => updateFilter("to", event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none dark:border-white/10 dark:bg-[#151b17] dark:text-white" /></label>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5 dark:border-white/10"><div><h2 className="font-semibold text-slate-900 dark:text-white">Earned commissions</h2><p className="mt-1 text-xs text-slate-500">{totalCount.toLocaleString()} matching transactions</p></div><Wallet size={19} className="text-purple-600 dark:text-orange-400" /></div>
            {error && <div className="p-5"><ErrorBlock message={error} /></div>}
            {loading && items.length === 0 && <p className="p-12 text-center text-sm text-slate-400">Loading commission records…</p>}
            {!loading && !error && items.length === 0 && <p className="p-12 text-center text-sm text-slate-400">No commissions match these filters.</p>}
            <div className="divide-y divide-slate-100 dark:divide-white/10">
              {items.map(item => <button key={item.id} type="button" onClick={() => openDetail(item)} className="flex w-full flex-col gap-3 p-4 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-500 sm:p-5 lg:flex-row lg:items-center lg:justify-between dark:hover:bg-white/[0.03]">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5 sm:size-[76px]">{item.thumbnailUrl ? <img src={assetUrl(item.thumbnailUrl)} alt="" className="size-full object-cover" /> : <div className="grid size-full place-items-center text-slate-400"><ImageIcon size={20} /></div>}</div>
                  <div className="min-w-0"><h3 className="truncate font-semibold text-slate-900 dark:text-white">{item.listingTitle}</h3><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.category} · {item.method} · {item.listingStatus}</p><p className="mt-1 truncate text-xs text-slate-400">Provider {item.providerName} · Employee {item.employeeName}</p></div>
                </div>
                <div className="flex items-center justify-between gap-4 pl-[76px] sm:pl-[92px] lg:pl-0"><div><p className="font-bold text-emerald-700 dark:text-emerald-400">{money(item.commissionAmount, item.currency)}</p><p className="mt-1 text-xs text-slate-400">{dateInputValue(new Date(item.transactionDate))}</p></div><ChevronRight size={18} className="text-slate-400" /></div>
              </button>)}
            </div>
          </section>
          <LoadMoreSentinel hasMore={hasMore} loading={loading} onLoadMore={loadMore} />
        </main>
      </PageContainer>
    </AppShell>
  );
}

function videoEmbed(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`;
    if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      const id = parsed.searchParams.get("v") ?? parsed.pathname.split("/").filter(Boolean).at(-1);
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "vimeo.com") return `https://player.vimeo.com/video/${parsed.pathname.split("/").filter(Boolean).at(-1)}`;
  } catch { return null; }
  return null;
}

function CommissionDetailPage() {
  const { transactionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [detail, setDetail] = useState<OwnerCommissionDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || !transactionId) return;
    let active = true;
    setLoading(true);
    getOwnerCommissionDetail(accessToken, Number(transactionId))
      .then(result => { if (active) setDetail(result); })
      .catch(loadError => { if (active) setError(loadError instanceof Error ? loadError.message : "Could not load commission details."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [accessToken, transactionId]);

  const back = () => {
    const from = (location.state as { from?: string } | null)?.from;
    if (from) navigate(from);
    else navigate("/owner/commissions");
  };

  if (loading) return <AppShell><PageContainer><Loading /></PageContainer></AppShell>;
  if (error || !detail) return <AppShell><PageContainer><div className="mx-auto max-w-5xl py-8"><button type="button" onClick={back} className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500"><ArrowLeft size={16} /> Back to commissions</button><ErrorBlock message={error || "Commission record not found."} /></div></PageContainer></AppShell>;

  const commission = detail.commission;
  const photos = detail.media.filter(media => media.kind.toLowerCase() !== "video" && !/\.(mp4|webm|ogg|mov)(\?|$)/i.test(media.url));
  const videos = detail.media.filter(media => media.kind.toLowerCase() === "video" || /\.(mp4|webm|ogg|mov)(\?|$)/i.test(media.url));

  return (
    <AppShell>
      <PageContainer>
        <main className="mx-auto max-w-6xl px-1 py-6 sm:py-8">
          <button type="button" onClick={back} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"><ArrowLeft size={16} /> Back to commissions</button>
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-700 dark:text-orange-400">Commission detail · #{commission.id}</p><h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{commission.listingTitle}</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{detail.area}, {detail.city}{detail.subArea ? ` · ${detail.subArea}` : ""} · {commission.category}</p></div><div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/10"><p className="text-xs text-emerald-700 dark:text-emerald-300">Commission earned</p><p className="mt-1 text-xl font-bold text-emerald-800 dark:text-emerald-200">{money(commission.commissionAmount, commission.currency)}</p></div></header>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)]">
            <div className="min-w-0 space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-white/10 dark:bg-white/[0.035]"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold text-slate-900 dark:text-white">Listing media</h2><p className="mt-1 text-xs text-slate-500">{photos.length} photos · {videos.length} videos</p></div></div>
                {photos.length ? <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{photos.map((media,index) => <button type="button" key={`${media.url}-${index}`} onClick={() => setPreview(assetUrl(media.url))} className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:bg-white/5"><img src={assetUrl(media.url)} alt={`${commission.listingTitle} photo ${index+1}`} className="size-full object-cover transition hover:scale-105" /></button>)}</div> : <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-400 dark:bg-white/5">No listing photos available.</p>}
                {videos.length > 0 && <div className="mt-4 grid gap-3">{videos.map((media,index) => { const embed = videoEmbed(media.url); return <div key={`${media.url}-${index}`} className="overflow-hidden rounded-xl bg-black">{embed ? <iframe src={embed} title={`${commission.listingTitle} video ${index+1}`} className="aspect-video w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : <video src={assetUrl(media.url)} controls playsInline preload="metadata" className="aspect-video w-full" />}</div>; })}</div>}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-white/10 dark:bg-white/[0.035]"><h2 className="font-semibold text-slate-900 dark:text-white">Listing information</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{[ ["Type", commission.method], ["Status", commission.listingStatus], ["Category", commission.category], ["Listing price", detail.listingPrice == null ? "—" : `${money(detail.listingPrice)}${detail.priceUnit ? ` / ${detail.priceUnit}` : ""}`] ].map(([label,value]) => <div key={label}><p className="text-xs text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{value}</p></div>)}</div>{detail.listingDescription && <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">{detail.listingDescription}</p>}{detail.attributes.length > 0 && <div className="mt-4 grid gap-2 sm:grid-cols-2">{detail.attributes.map(attribute => <div key={attribute.name} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-white/5"><p className="text-[10px] uppercase tracking-wide text-slate-400">{attribute.name}</p><p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">{attribute.value}</p></div>)}</div>}</section>
            </div>

            <aside className="min-w-0 space-y-5">
              <section className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm sm:p-5 dark:border-white/10 dark:bg-white/[0.035]"><h2 className="font-semibold text-slate-900 dark:text-white">Commission breakdown</h2><dl className="mt-4 space-y-3">{[["Deal value",money(commission.dealValue,commission.currency)],["Commission rate",`${commission.commissionRate}%`],["Earned commission",money(commission.commissionAmount,commission.currency)],["Date recorded",new Date(commission.transactionDate).toLocaleString()],["Deal status",detail.dealStatus],["Reference",detail.referenceNumber || "—"]].map(([label,value]) => <div key={label} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 dark:border-white/10"><dt className="text-xs text-slate-500">{label}</dt><dd className="text-right text-sm font-semibold text-slate-800 dark:text-slate-200">{value}</dd></div>)}</dl></section>
              <PersonCard title="Provider" person={detail.provider} />
              <PersonCard title="Employee responsible" person={detail.employee} />
              {detail.customer && <PersonCard title="Customer" person={detail.customer} />}
            </aside>
          </div>
        </main>
      </PageContainer>
      {preview && <div role="dialog" aria-modal="true" aria-label="Listing image preview" onMouseDown={event => { if (event.currentTarget === event.target) setPreview(null); }} className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4"><button type="button" aria-label="Close preview" onClick={() => setPreview(null)} className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white"><X size={20} /></button><img src={preview} alt="Listing image" className="max-h-[88vh] max-w-[94vw] object-contain" /></div>}
    </AppShell>
  );
}

function PersonCard({ title, person }: { title: string; person: OwnerCommissionDetail["provider"] }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-white/10 dark:bg-white/[0.035]"><h2 className="font-semibold text-slate-900 dark:text-white">{title}</h2><p className="mt-3 font-medium text-slate-800 dark:text-slate-200">{person.fullName}</p><a className="mt-1 block break-all text-sm text-purple-700 hover:underline dark:text-orange-400" href={`tel:${person.phoneNumber}`}>{person.phoneNumber}</a>{person.email && <a className="mt-1 block break-all text-sm text-slate-500 hover:underline dark:text-slate-400" href={`mailto:${person.email}`}>{person.email}</a>}</section>;
}

export default function OwnerCommissionsPage() {
  const { transactionId } = useParams();
  return transactionId ? <CommissionDetailPage /> : <CommissionListPage />;
}
