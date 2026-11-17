import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Sun,
  Trash2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE, ASSET_URL } from "../../types/api";
import { useAuth } from "../../types/auth/authStore";

import { AppShell } from "../../components/layout/AppShell";
import { EmployeeShell } from "../../components/employee/EmployeeShell";
import { PageContainer } from "../../components/layout/PageContainer";

import {
  AvatarPicker,
} from "../../components/profile/AvatarPicker";

import {
  ProfileField,
} from "../../components/profile/ProfileField";

import { ProfileSection } from "../../components/profile/ProfileSection";

import { AccountAction, PreferenceRow, ThemeToggle, Toggle }  from "../../components/profile/ProfileMisc";

interface ProfileState {
  id: string; firstName: string; lastName: string; phone: string; email: string;
  city: string; area: string; verified: boolean; avatarUrl?: string; receiveNotifications: boolean;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: unknown } } }).response;
    if (typeof response?.data?.message === "string") return response.data.message;
  }
  return fallback;
}

interface ProfilePageProps {
  employeeMode?: boolean;
}

export function ProfilePage({ employeeMode = false }: ProfilePageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileState | null>(null);

  const [saving, setSaving] =
    useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    API_BASE.get("/user/profile", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(({ data }) => {
        if (cancelled) return;
        const names = String(data.fullName ?? "").trim().split(/\s+/);
        setProfile({
          id: String(data.id), firstName: names.shift() ?? "", lastName: names.join(" "),
          phone: data.phoneNumber ?? "", email: data.email ?? "", city: data.city ?? "", area: data.area ?? "",
          verified: Boolean(data.verified), avatarUrl: data.avatarUrl ? `${ASSET_URL}${data.avatarUrl}` : undefined,
          receiveNotifications: data.receiveNotifications ?? true,
        });
      })
      .catch((loadError) => { if (!cancelled) setError(loadError.response?.data?.message ?? "Could not load your profile."); });
    return () => { cancelled = true; };
  }, [accessToken]);

  const update = (
    values: Partial<ProfileState>
  ) => {
    setSaved(false);
    setProfile((current) => current ? ({
      ...current,
      ...values,
    }) : current);
  };

  const saveProfile = async () => {
    if (!profile || !accessToken) return;
    setSaving(true);
    setError("");
    try {
      await API_BASE.put("/user/profile", {
        fullName: `${profile.firstName} ${profile.lastName}`.trim(),
        phoneNumber: profile.phone, email: profile.email || null,
        city: profile.city, area: profile.area,
        receiveNotifications: profile.receiveNotifications,
      }, { headers: { Authorization: `Bearer ${accessToken}` } });
      setSaved(true);
    } catch (saveError: unknown) {
      setError(getErrorMessage(saveError, "Could not save your profile."));
    } finally { setSaving(false); }
  };

  const handleAvatar = (
    file: File
  ) => {
    if (!accessToken) return;
    const form = new FormData();
    form.append("file", file);
    setError("");
    API_BASE.post("/user/profile/avatar", form, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(({ data }) => update({ avatarUrl: `${ASSET_URL}${data.avatarUrl}` }))
      .catch((uploadError: unknown) => setError(getErrorMessage(uploadError, "Could not upload your avatar.")));
  };

  const handleDeleteAccount = async () => {
    if (!accessToken || !window.confirm("Delete your account? You will be signed out and cannot use it again.")) return;
    try {
      await API_BASE.delete("/user/profile", { headers: { Authorization: `Bearer ${accessToken}` } });
      await logout();
      navigate("/login", { replace: true });
    } catch (deleteError: unknown) { setError(getErrorMessage(deleteError, "Could not delete your account.")); }
  };

  const PageShell = employeeMode ? EmployeeShell : AppShell;

  if (!profile) return <PageShell><PageContainer><p className="p-8 text-sm text-gray-500">{error || "Loading profile…"}</p></PageContainer></PageShell>;

  return (
    <PageShell>
      <PageContainer>
        <main className="mx-auto max-w-2xl px-1 py-6">
          {/* HEADER */}

          <div className="mb-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (employeeMode) {
                  const returnTo = (location.state as { from?: string } | null)?.from;
                  navigate(returnTo || "/employee");
                } else {
                  navigate(-1);
                }
              }}
              className="
                grid
                size-9
                place-items-center
                rounded-full
                text-gray-500
                transition
                hover:bg-gray-100
                dark:hover:bg-white/[0.06]
              "
            >
              <ArrowLeft className="size-4" />
            </button>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {employeeMode ? "Employee Profile" : "My Profile"}
              </h1>

              <p className="mt-1 text-xs text-gray-400">
                Manage your personal information
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* PROFILE HEADER */}

            <ProfileSection title="Profile photo">
              <AvatarPicker
                name={`${profile.firstName} ${profile.lastName}`}
                imageUrl={
                  profile.avatarUrl
                }
                onChange={handleAvatar}
              />

              {profile.verified && (
                <div
                  className="
                    mt-5
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-emerald-50
                    px-3
                    py-2.5
                    text-xs
                    text-emerald-700

                    dark:bg-emerald-900/10
                    dark:text-emerald-300
                  "
                >
                  <CheckCircle2 className="size-4" />

                  <div>
                    <p className="font-semibold">
                      Verified profile
                    </p>

                    <p className="mt-0.5 text-[9px] opacity-70">
                      Your identity has been
                      verified by Yegna Bet.
                    </p>
                  </div>
                </div>
              )}
            </ProfileSection>

            {/* PERSONAL INFORMATION */}

            <ProfileSection
              title="Personal information"
              description="Basic information about you."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileField
                  label="First name"
                  value={profile.firstName}
                  onChange={(value) =>
                    update({
                      firstName: value,
                    })
                  }
                />

                <ProfileField
                  label="Last name"
                  value={profile.lastName}
                  onChange={(value) =>
                    update({
                      lastName: value,
                    })
                  }
                />
              </div>
            </ProfileSection>

            {/* CONTACT */}

            <ProfileSection
              title="Contact information"
              description="How Yegna Bet can reach you."
            >
              <div className="space-y-4">
                <ProfileField
                  label="Phone number"
                  value={profile.phone}
                  type="tel"
                  onChange={(value) =>
                    update({
                      phone: value,
                    })
                  }
                />

                <ProfileField
                  label="Email address"
                  value={profile.email}
                  type="email"
                  onChange={(value) =>
                    update({
                      email: value,
                    })
                  }
                />
              </div>
            </ProfileSection>

            {/* LOCATION */}

            <ProfileSection
              title="Location"
              description="Used to make property recommendations more relevant."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileField
                  label="City"
                  value={profile.city}
                  onChange={(value) =>
                    update({
                      city: value,
                    })
                  }
                />

                <ProfileField
                  label="Area"
                  value={profile.area}
                  onChange={(value) =>
                    update({
                      area: value,
                    })
                  }
                />
              </div>
            </ProfileSection>

            {/* VERIFICATION */}

            <ProfileSection
              title="Verification"
              description="Manage your identity verification."
            >
              <button
                type="button"
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  bg-gray-50
                  p-3
                  text-left
                  dark:bg-white/[0.035]
                "
              >
                <div className="grid size-10 place-items-center rounded-xl bg-yegna-50 text-yegna-700 dark:bg-yegna-900/20 dark:text-yegna-300">
                  <ShieldCheck className="size-5" />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    Identity verification
                  </p>

                  <p className="mt-1 text-[9px] text-gray-400">
                    {profile.verified
                      ? "Your identity is verified."
                      : "Verify your identity to build trust."}
                  </p>
                </div>

                <ChevronRight className="size-4 text-gray-400" />
              </button>
            </ProfileSection>

            {/* PREFERENCES */}

            <ProfileSection
              title="Preferences"
              description="Control how Yegna Bet behaves."
            >
              <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
                <PreferenceRow
                  icon={Sun}
                  title="Appearance"
                  description="Light or dark theme"
                  action={
                    <ThemeToggle />
                  }
                />

                <PreferenceRow
                  icon={CheckCircle2}
                  title="Notifications"
                  description="Receive property matches and updates"
                  action={
                    <Toggle
                      checked={profile.receiveNotifications}
                      onChange={() => update({ receiveNotifications: !profile.receiveNotifications })}
                    />
                  }
                />
              </div>
            </ProfileSection>

            {/* SAVE */}

            <button
              type="button"
              onClick={saveProfile}
              disabled={saving}
              className="
                h-12
                w-full
                rounded-xl
                bg-yegna-700
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-yegna-700/15
                transition
                hover:bg-yegna-800
                active:scale-[0.98]
                disabled:cursor-wait
                disabled:opacity-60
              "
            >
              {saving
                ? "Saving..."
                : "Save changes"}
            </button>
            {saved && <p role="status" className="text-center text-sm text-emerald-700">Profile saved.</p>}
            {error && <p role="alert" className="text-center text-sm text-red-600">{error}</p>}

            {/* ACCOUNT */}

            <ProfileSection
              title="Account"
            >
              <div className="space-y-1">
                <AccountAction
                  icon={Trash2}
                  title="Delete account"
                  danger
                  onClick={() => { void handleDeleteAccount(); }}
                />
              </div>
            </ProfileSection>
          </div>
        </main>
      </PageContainer>
    </PageShell>
  );
}
