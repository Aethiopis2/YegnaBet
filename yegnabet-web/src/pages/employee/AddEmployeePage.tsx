import { ArrowLeft, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EmployeeShell, useAppContext } from "../../components/employee/EmployeeShell";
import { createEmployeeAccount } from "../../lib/employee/employeeDirectoryApi";

function AddEmployeePageContent() {
  const navigate = useNavigate();
  const { token } = useAppContext();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setError("Your session has expired. Sign in again to add an employee.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await createEmployeeAccount(token, { fullName, phoneNumber, email, password });
      navigate("/employee/employees", {
        state: { notice: `${fullName.trim()} was added to the employee directory.` },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add employee.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link to="/employee/employees" className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-yegna-700 dark:text-gray-400 dark:hover:text-yegna-400">
        <ArrowLeft size={15} /> Employee directory
      </Link>

      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-yegna-700 dark:text-yegna-400">People</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Add Employee</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create an employee account with a sign-in password.</p>
      </header>

      <form onSubmit={submit} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/6 dark:bg-white/[0.035] sm:p-7">
        <div className="mb-6 flex items-center gap-3 border-b border-black/5 pb-5 dark:border-white/8">
          <div className="grid size-10 place-items-center rounded-xl bg-yegna-50 text-yegna-700 dark:bg-yegna-500/10 dark:text-yegna-400">
            <UserPlus size={19} />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Employee details</h2>
            <p className="mt-0.5 text-xs text-gray-400">The new employee can sign in as soon as this account is created.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full name">
            <input autoComplete="name" required minLength={2} maxLength={120} value={fullName} onChange={event => setFullName(event.target.value)} className={inputClass} placeholder="Employee name" />
          </FormField>
          <FormField label="Phone number">
            <input autoComplete="tel" type="tel" required maxLength={30} value={phoneNumber} onChange={event => setPhoneNumber(event.target.value)} className={inputClass} placeholder="+251 …" />
          </FormField>
          <FormField label="Email address">
            <input autoComplete="email" type="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} className={inputClass} placeholder="name@example.com" />
          </FormField>
          <FormField label="Initial password">
            <input autoComplete="new-password" type="password" required minLength={6} value={password} onChange={event => setPassword(event.target.value)} className={inputClass} placeholder="At least 6 characters" />
          </FormField>
        </div>

        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</p>}

        <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-black/5 pt-5 dark:border-white/8">
          <Link to="/employee/employees" className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5">Cancel</Link>
          <button type="submit" disabled={saving} className="rounded-xl bg-yegna-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-yegna-600 disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? "Creating…" : "Create employee"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AddEmployeePage() {
  return <EmployeeShell><AddEmployeePageContent /></EmployeeShell>;
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5"><span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{label}</span>{children}</label>;
}

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-yegna-500 focus:ring-2 focus:ring-yegna-500/10 dark:border-white/10 dark:bg-white/[0.03] dark:text-white";
