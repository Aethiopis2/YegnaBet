import { useEffect, useState } from "react";
import { Building2, Plus, Search } from "lucide-react";
import type { ListingProviderDraft } from "../../../../types/provider/providerTypes";
import type { ProviderAccount } from "../../../../types/employee/providerAccount";
import { getProviders } from "../../../../lib/employee/providerDirectoryApi";
import { ListingTextField } from "../fields/ListingTextField";

interface Props {
  value: ListingProviderDraft;
  token?: string;
  validationError?: string;
  onChange: (value: ListingProviderDraft) => void;
}

export function ListingProviderStep({ value, token, onChange, validationError }: Props) {
  const [mode, setMode] = useState<"existing" | "new">(value.providerId ? "existing" : "new");
  const [search, setSearch] = useState("");
  const [providers, setProviders] = useState<ProviderAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode !== "existing" || !token) return;
    let active = true;
    setLoading(true);
    getProviders(token, 0, search, 30)
      .then(result => { if (active) setProviders(result.items.filter(provider => provider.isActive)); })
      .catch(loadError => { if (active) setError(loadError instanceof Error ? loadError.message : "Could not load providers."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [mode, search, token]);

  const useExistingProvider = (provider: ProviderAccount) => {
    onChange({
      providerId: provider.id,
      fullName: provider.fullName,
      phoneNumber: provider.phoneNumber,
      email: provider.email,
      password: "",
    });
  };

  const switchMode = (nextMode: "existing" | "new") => {
    setMode(nextMode);
    setError("");
    if (nextMode === "new" || nextMode === "existing") {
      onChange({ providerId: undefined, fullName: "", phoneNumber: "", email: "", password: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Who provides this listing?</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose an existing provider or create a provider account for the listing owner.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
        <button type="button" onClick={() => switchMode("existing")} className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${mode === "existing" ? "bg-white text-yegna-800 shadow-sm dark:bg-white/10 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
          Select existing
        </button>
        <button type="button" onClick={() => switchMode("new")} className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold ${mode === "new" ? "bg-white text-yegna-800 shadow-sm dark:bg-white/10 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
          <Plus size={15} /> Add provider
        </button>
      </div>

      {mode === "existing" ? (
        <div className="space-y-4">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-slate-400 dark:border-white/10">
            <Search size={15} />
            <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Find a provider by name, phone, or email" className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white" />
          </label>
          {value.providerId && <div className="flex items-center gap-2 rounded-xl border border-yegna-200 bg-yegna-50 px-3 py-2.5 text-sm font-semibold text-yegna-800 dark:border-yegna-900 dark:bg-yegna-900/20 dark:text-yegna-300"><Building2 size={16} /> Selected: {value.fullName}</div>}
          {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
          {loading ? <p className="py-4 text-center text-sm text-slate-400">Loading providers…</p> : (
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {providers.map(provider => (
                <button key={provider.id} type="button" onClick={() => useExistingProvider(provider)} className={`w-full rounded-xl border p-3 text-left transition ${value.providerId === provider.id ? "border-yegna-500 bg-yegna-50 dark:bg-yegna-900/20" : "border-slate-200 hover:border-yegna-300 dark:border-white/10 dark:hover:border-yegna-700"}`}>
                  <span className="block text-sm font-semibold text-slate-800 dark:text-white">{provider.fullName}</span>
                  <span className="mt-0.5 block text-xs text-slate-400">{provider.phoneNumber} · {provider.email}</span>
                </button>
              ))}
              {!loading && providers.length === 0 && <p className="py-4 text-center text-sm text-slate-400">No active providers found. Add one to continue.</p>}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <ListingTextField label="Provider full name" value={value.fullName} onChange={event => onChange({ ...value, fullName: event.target.value })} placeholder="Provider or owner name" required />
          <ListingTextField label="Phone number" type="tel" value={value.phoneNumber} onChange={event => onChange({ ...value, phoneNumber: event.target.value })} placeholder="+251…" required />
          <ListingTextField label="Email address" type="email" value={value.email} onChange={event => onChange({ ...value, email: event.target.value })} placeholder="name@example.com" required />
          <ListingTextField label="Initial password" type="password" minLength={6} value={value.password} onChange={event => onChange({ ...value, password: event.target.value })} hint="The provider can change this after signing in." required />
        </div>
      )}
      {validationError && <p role="alert" className="text-xs font-medium text-red-600">{validationError}</p>}
    </div>
  );
}
