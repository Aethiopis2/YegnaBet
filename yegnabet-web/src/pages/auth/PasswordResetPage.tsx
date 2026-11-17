import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API_BASE } from "../../types/api";

export default function PasswordResetPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    try {
      if (token) {
        await API_BASE.post("/auth/password/reset", { email, token, newPassword: password });
        setMessage("Your password has been reset. You can now sign in.");
      } else {
        await API_BASE.post("/auth/password/forgot", { email });
        setMessage("If an active account uses that email, reset instructions have been sent.");
      }
    } catch {
      setError("The request could not be completed. Check the form and try again.");
    } finally { setBusy(false); }
  };

  return <main className="flex min-h-screen items-center justify-center px-4">
    <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl dark:bg-zinc-900">
      <h1 className="text-2xl font-bold">{token ? "Choose a new password" : "Forgot your password?"}</h1>
      <p className="mt-2 text-sm text-gray-500">{token ? "Reset links expire after 30 minutes." : "Enter your account email and we’ll send a secure reset link."}</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm">Email address<input className="mt-1 w-full rounded-xl border border-gray-300 bg-transparent px-3 py-2" type="email" required value={email} onChange={event => setEmail(event.target.value)} /></label>
        {token && <label className="block text-sm">New password<input className="mt-1 w-full rounded-xl border border-gray-300 bg-transparent px-3 py-2" type="password" minLength={8} required value={password} onChange={event => setPassword(event.target.value)} /></label>}
        {message && <p role="status" className="text-sm text-emerald-700">{message}</p>}
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-yegna-700 px-4 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Please wait…" : token ? "Reset password" : "Send reset link"}</button>
      </form>
      <Link className="mt-5 block text-center text-sm text-yegna-700" to="/login">Back to sign in</Link>
    </section>
  </main>;
}
