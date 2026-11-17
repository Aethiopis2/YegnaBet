import { Search, UserPlus, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EmployeeShell, useAppContext } from "../../components/employee/EmployeeShell";
import { OkCancelDialog } from "../../components/ui/common/OkCancelDialog";
import { getEmployeeAccounts, removeEmployeeAccount } from "../../lib/employee/employeeDirectoryApi";
import type { EmployeeAccount } from "../../types/employee/employeeAccount";

function EmployeeDirectoryPageContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAppContext();
  const [employees, setEmployees] = useState<EmployeeAccount[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<string>(location.state?.notice ?? "");
  const [removeTarget, setRemoveTarget] = useState<EmployeeAccount | null>(null);

  useEffect(() => {
    if (!token || token === "null") return;
    let active = true;
    getEmployeeAccounts(token)
      .then(result => { if (active) setEmployees(result); })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : "Could not load the employee directory."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  const visibleEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return employees;
    return employees.filter(employee =>
      [employee.fullName, employee.phoneNumber, employee.email].some(value => value.toLowerCase().includes(term))
    );
  }, [employees, search]);

  const confirmRemove = async () => {
    if (!removeTarget || !token) return;
    setRemoving(true);
    setError("");
    try {
      await removeEmployeeAccount(token, removeTarget.id);
      setEmployees(current => current.map(employee => employee.id === removeTarget.id
        ? { ...employee, isActive: false }
        : employee));
      setNotice(`${removeTarget.fullName} was removed from active employees.`);
      setRemoveTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove this employee.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-yegna-700 dark:text-yegna-400">People</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Edit Employees</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage employee profiles and account access.</p>
        </div>
        <Link to="/employee/employees/new" className="inline-flex items-center gap-2 rounded-xl bg-yegna-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-yegna-600">
          <UserPlus size={16} /> Add employee
        </Link>
      </header>

      {notice && <div role="status" className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">{notice}<button type="button" onClick={() => setNotice("")} className="ml-4 text-xs font-semibold">Dismiss</button></div>}
      {(error || !token || token === "null") && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{error || "Your session has expired. Sign in again to manage employees."}</div>}

      <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/6 dark:bg-white/[0.035]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 px-5 py-4 dark:border-white/8">
          <div className="flex items-center gap-2 text-sm font-semibold"><Users size={17} className="text-yegna-700 dark:text-yegna-400" /> Employee directory <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 dark:bg-white/8 dark:text-gray-300">{employees.length}</span></div>
          <label className="flex w-full items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-gray-400 sm:w-64 dark:border-white/10">
            <Search size={15} />
            <input aria-label="Search employees" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search employees" className="min-w-0 flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400 dark:text-white" />
          </label>
        </div>

        {loading && token && token !== "null" ? (
          <p className="px-5 py-12 text-center text-sm text-gray-400">Loading employees…</p>
        ) : visibleEmployees.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Users className="mx-auto size-8 text-gray-300 dark:text-gray-600" />
            <p className="mt-3 text-sm font-semibold">{search ? "No employees match that search." : "No employee accounts yet."}</p>
            {!search && <p className="mt-1 text-xs text-gray-400">Add an employee to get started.</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:bg-white/[0.025]">
                <tr><th className="px-5 py-3">Employee</th><th className="px-5 py-3">Phone</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/6">
                {visibleEmployees.map(employee => (
                  <tr key={employee.id} className="hover:bg-gray-50/70 dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-4"><p className="text-sm font-semibold">{employee.fullName}</p><p className="mt-0.5 text-[10px] text-gray-400">Employee #{employee.id}</p></td>
                    <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-300">{employee.phoneNumber}</td>
                    <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-300">{employee.email || "—"}</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${employee.isActive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-gray-100 text-gray-500 dark:bg-white/8 dark:text-gray-400"}`}>{employee.isActive ? "Active" : "Inactive"}</span></td>
                    <td className="px-5 py-4"><div className="flex justify-end gap-2">
                      <button type="button" onClick={() => navigate(`/employee/employees/${employee.id}/edit`)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-yegna-500 hover:text-yegna-700 dark:border-white/10 dark:text-gray-300 dark:hover:text-yegna-400">Edit</button>
                      {employee.isActive && employee.id !== user?.id && <button type="button" onClick={() => setRemoveTarget(employee)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10">Remove</button>}
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <OkCancelDialog
        open={removeTarget !== null}
        title="Remove employee?"
        message={removeTarget ? `Deactivate ${removeTarget.fullName}'s employee account? They will no longer be able to sign in. You can reactivate the account from Edit Employee.` : ""}
        okText="Remove employee"
        variant="danger"
        busy={removing}
        onOk={() => void confirmRemove()}
        onCancel={() => !removing && setRemoveTarget(null)}
      />
    </div>
  );
}

export default function EmployeeDirectoryPage() {
  return <EmployeeShell><EmployeeDirectoryPageContent /></EmployeeShell>;
}
