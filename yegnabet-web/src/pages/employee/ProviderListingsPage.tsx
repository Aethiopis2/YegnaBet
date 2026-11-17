import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmployeeShell, useAppContext } from "../../components/employee/EmployeeShell";
import { Explorer } from "../../components/explorer/Explorer";
import { getProvider } from "../../lib/employee/providerDirectoryApi";
import type { ProviderAccount } from "../../types/employee/providerAccount";

function ProviderListingsContent() {
  const { providerId } = useParams();
  const id = Number(providerId);
  const { user, token } = useAppContext();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<ProviderAccount | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !Number.isFinite(id) || id <= 0) return;
    let active = true;
    getProvider(token, id)
      .then(account => { if (active) setProvider(account); })
      .catch(loadError => { if (active) setError(loadError instanceof Error ? loadError.message : "Could not load provider."); });
    return () => { active = false; };
  }, [id, token]);

  if (error) return <div role="alert" className="mx-auto max-w-6xl rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}<button className="ml-4 underline" onClick={() => navigate(-1)}>Back to providers</button></div>;

  return (
    <Explorer config={{
      title: provider ? `${provider.fullName}'s listings` : "Provider listings",
      subtitle: provider ? `${provider.phoneNumber}${provider.email ? ` · ${provider.email}` : ""}` : "Loading provider…",
      providerId: id,
      mode: "All",
      filters: { status: "All" },
      showMode: false,
      showModeTabs: false,
      showPopularLocations: false,
      showFilters: true,
      initialView: "grid",
      user: user ?? undefined,
    }} />
  );
}

export default function ProviderListingsPage() {
  return <EmployeeShell><ProviderListingsContent /></EmployeeShell>;
}
