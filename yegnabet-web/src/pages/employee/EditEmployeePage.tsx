import { ArrowLeft, KeyRound, Save, UserRoundCog } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EmployeeShell, useAppContext } from "../../components/employee/EmployeeShell";
import { OkCancelDialog } from "../../components/ui/common/OkCancelDialog";
import { getEmployeeAccount, removeEmployeeAccount, updateEmployeeAccount } from "../../lib/employee/employeeDirectoryApi";
import type { EmployeeAccount } from "../../types/employee/employeeAccount";

function EditEmployeePageContent() {
  const navigate = useNavigate();
  const { employeeId: employeeIdParam } = useParams();
  const employeeId = Number(employeeIdParam);
  const { token, user } = useAppContext();
  const [employee, setEmployee] = useState<EmployeeAccount | null>(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isVerified, setIsVerified] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || token === "null" || !Number.isInteger(employeeId) || employeeId <= 0) return;
    let active = true;
    getEmployeeAccount(token, employeeId)
      .then(result => {
        if (!active) return;
        setEmployee(result);
        setFullName(result.fullName);
        setPhoneNumber(result.phoneNumber);
        setEmail(result.email);
        setIsActive(result.isActive);
        setIsVerified(result.isVerified);
      })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : "Could not load employee."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [employeeId, token]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !employee) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateEmployeeAccount(token, employee.id, {
        fullName,
        phoneNumber,
        email,
        isActive,
        isVerified,
        ...(newPassword ? { newPassword } : {}),
      });
      setEmployee(updated);
      setNewPassword("");
      navigate("/employee/employees", { state: { notice: `${updated.fullName}'s account was updated.` } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save employee changes.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!token || !employee) return;
    setRemoving(true);
    setError("");
    try {
      await removeEmployeeAccount(token, employee.id);
      navigate("/employee/employees", { state: { notice: `${employee.fullName} was removed from active employees.` } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove employee.");
      setConfirmRemove(false);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link to="/employee/employees" className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-yegna-700 dark:text-gray-400 dark:hover:text-yegna-400"><ArrowLeft size={15} /> Employee directory</Link>
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-yegna-700 dark:text-yegna-400">People</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Edit Employee</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update profile information, access, or password.</p>
      </header>

      {(error || !token || token === "null" || !Number.isInteger(employeeId) || employeeId <= 0) && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{error || (!token || token === "null" ? "Your session has expired. Sign in again." : "Employee account could not be loaded.")}</p>}
      {loading && token && token !== "null" && Number.isInteger(employeeId) && employeeId > 0 && <p className="rounded-2xl border border-black/5 bg-white px-5 py-12 text-center text-sm text-gray-400 dark:border-white/6 dark:bg-white/[0.035]">Loading employee…</p>}
      {!loading && employee && (
        <form onSubmit={submit} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/6 dark:bg-white/[0.035] sm:p-7">
          <div className="mb-6 flex items-center gap-3 border-b border-black/5 pb-5 dark:border-white/8">
            <div className="grid size-10 place-items-center rounded-xl bg-yegna-50 text-yegna-700 dark:bg-yegna-500/10 dark:text-yegna-400"><UserRoundCog size={19} /></div>
            <div><h2 className="text-sm font-semibold">{employee.fullName}</h2><p className="mt-0.5 text-xs text-gray-400">Employee #{employee.id}</p></div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full name"><input required minLength={2} maxLength={120} autoComplete="name" value={fullName} onChange={event => setFullName(event.target.value)} className={inputClass} /></FormField>
            <FormField label="Phone number"><input required maxLength={30} type="tel" autoComplete="tel" value={phoneNumber} onChange={event => setPhoneNumber(event.target.value)} className={inputClass} /></FormField>
            <FormField label="Email address"><input required maxLength={254} type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className={inputClass} /></FormField>
            <FormField label="New password (optional)"><div className="relative"><KeyRound size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="password" autoComplete="new-password" minLength={6} value={newPassword} onChange={event => setNewPassword(event.target.value)} className={`${inputClass} pl-10`} placeholder="Leave blank to keep current" /></div></FormField>
          </div>

          <div className="mt-6 grid gap-3 border-t border-black/5 pt-5 sm:grid-cols-2 dark:border-white/8">
            <ToggleField title="Account active" description="Active employees can sign in." checked={isActive} onChange={setIsActive} disabled={employee.id === user?.id} />
            <ToggleField title="Verified" description="Employee account is trusted and verified." checked={isVerified} onChange={setIsVerified} />
          </div>

          <div className="mt-7 flex flex-wrap justify-between gap-3 border-t border-black/5 pt-5 dark:border-white/8">
            <div>{employee.isActive && employee.id !== user?.id && <button type="button" onClick={() => setConfirmRemove(true)} className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10">Remove employee</button>}</div>
            <div className="flex gap-3"><Link to="/employee/employees" className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5">Cancel</Link><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-yegna-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-yegna-600 disabled:cursor-not-allowed disabled:opacity-60"><Save size={15} />{saving ? "Saving…" : "Save changes"}</button></div>
          </div>
        </form>
      )}

      <OkCancelDialog open={confirmRemove} title="Remove employee?" message={`Deactivate ${employee?.fullName ?? "this employee"}'s account? They will no longer be able to sign in. You can reactivate the account later.`} okText="Remove employee" variant="danger" busy={removing} onOk={() => void remove()} onCancel={() => !removing && setConfirmRemove(false)} />
    </div>
  );
}

export default function EditEmployeePage() {
  return <EmployeeShell><EditEmployeePageContent /></EmployeeShell>;
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5"><span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{label}</span>{children}</label>;
}

function ToggleField({ title, description, checked, onChange, disabled = false }: { title: string; description: string; checked: boolean; onChange: (value: boolean) => void; disabled?: boolean }) {
  return <label className={`flex items-center justify-between gap-4 rounded-xl border border-gray-200 px-4 py-3 dark:border-white/10 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}><span><span className="block text-xs font-semibold">{title}</span><span className="mt-0.5 block text-[10px] text-gray-400">{disabled ? "You cannot deactivate your own account." : description}</span></span><input type="checkbox" checked={checked} disabled={disabled} onChange={event => onChange(event.target.checked)} className="size-4 accent-yegna-700" /></label>;
}

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-yegna-500 focus:ring-2 focus:ring-yegna-500/10 dark:border-white/10 dark:bg-white/[0.03] dark:text-white";
