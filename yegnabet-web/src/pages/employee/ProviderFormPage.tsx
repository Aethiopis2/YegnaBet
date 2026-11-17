import { ArrowLeft, Save, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EmployeeShell, useAppContext } from "../../components/employee/EmployeeShell";
import Loading from "../../components/ui/common/Loading";
import {
  createProvider,
  getProvider,
  updateProvider,
} from "../../lib/employee/providerDirectoryApi";
import type { ProviderAccount } from "../../types/employee/providerAccount";

function ProviderFormContent() {
  const { providerId } = useParams();
  const id = providerId ? Number(providerId) : null;
  const isEditing = id !== null;
  const { token } = useAppContext();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<ProviderAccount | null>(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing || !token || !id || !Number.isInteger(id) || id <= 0) {
      setLoading(false);
      return;
    }
    let active = true;
    getProvider(token, id)
      .then(result => {
        if (!active) return;
        setProvider(result);
        setFullName(result.fullName);
        setPhoneNumber(result.phoneNumber);
        setEmail(result.email);
        setIsActive(result.isActive);
        setIsVerified(result.isVerified);
      })
      .catch(loadError => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load provider.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, isEditing, token]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      if (isEditing && id) {
        await updateProvider(token, id, {
          fullName,
          phoneNumber,
          email,
          isActive,
          isVerified,
          ...(password ? { newPassword: password } : {}),
        });
      } else {
        await createProvider(token, { fullName, phoneNumber, email, password });
      }
      navigate("/employee/providers", {
        replace: true,
        state: { notice: `${fullName} was ${isEditing ? "updated" : "added"}.` },
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save provider.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link to="/employee/providers" className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-yegna-700 dark:text-gray-400 dark:hover:text-yegna-400"><ArrowLeft size={15} /> Provider directory</Link>
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-yegna-700 dark:text-yegna-400">People</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{isEditing ? "Edit provider" : "Add provider"}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{isEditing ? `Update ${provider?.fullName ?? "provider"}'s account details.` : "Create a provider account for the system."}</p>
      </header>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{error}</p>}
      {isEditing && !provider && !error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Provider account could not be loaded.</p>}

      <form onSubmit={event => void submit(event)} className="space-y-5 rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/6 dark:bg-white/[0.035] sm:p-7">
        <div className="flex items-center gap-2 border-b border-black/5 pb-4 text-sm font-semibold dark:border-white/8"><UserRound size={17} className="text-yegna-700 dark:text-yegna-400" /> Account details</div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full name" value={fullName} onChange={setFullName} required />
          <FormField label="Phone number" value={phoneNumber} onChange={setPhoneNumber} required type="tel" />
          <FormField label="Email address" value={email} onChange={setEmail} required type="email" />
          <FormField label={isEditing ? "New password (optional)" : "Password"} value={password} onChange={setPassword} required={!isEditing} minLength={6} type="password" />
        </div>

        {isEditing && (
          <div className="grid gap-3 border-t border-black/5 pt-4 dark:border-white/8 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border border-black/5 p-3 text-sm dark:border-white/8">
              <input type="checkbox" checked={isActive} onChange={event => setIsActive(event.target.checked)} className="size-4 accent-yegna-700" />
              <span><span className="block font-semibold">Active account</span><span className="text-xs text-gray-400">Inactive providers cannot sign in.</span></span>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-black/5 p-3 text-sm dark:border-white/8">
              <input type="checkbox" checked={isVerified} onChange={event => setIsVerified(event.target.checked)} className="size-4 accent-yegna-700" />
              <span className="flex items-center gap-1.5"><ShieldCheck size={15} /> Verified provider</span>
            </label>
          </div>
        )}

        <div className="flex justify-end border-t border-black/5 pt-4 dark:border-white/8">
          <button type="submit" disabled={saving || (isEditing && !provider)} className="inline-flex items-center gap-2 rounded-xl bg-yegna-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-yegna-600 disabled:cursor-not-allowed disabled:opacity-60"><Save size={15} /> {saving ? "Saving…" : isEditing ? "Save changes" : "Create provider"}</button>
        </div>
      </form>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
      {label}
      <input type={type} value={value} onChange={event => onChange(event.target.value)} required={required} minLength={minLength} className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-gray-900 outline-none focus:border-yegna-500 dark:border-white/10 dark:bg-white/[0.035] dark:text-white" />
    </label>
  );
}

export default function ProviderFormPage() {
  return <EmployeeShell><ProviderFormContent /></EmployeeShell>;
}
