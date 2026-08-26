import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  LogOut,
  Moon,
  ShieldCheck,
  Sun,
  Trash2,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppShell } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";

import {
  AvatarPicker,
} from "../../components/profile/AvatarPicker";

import {
  ProfileField,
} from "../../components/profile/ProfileField";

import { ProfileSection } from "../../components/profile/ProfileSection";

import type {
  UserProfile,
} from "../../types/profile";

import { AccountAction, PreferenceRow, ThemeToggle, Toggle }  from "../../components/profile/ProfileMisc";

const initialProfile: UserProfile = {
  id: "user-1",

  firstName: "Abebe",
  lastName: "Kebede",

  phone: "+251 91 234 5678",
  email: "abebe@example.com",

  city: "Addis Ababa",
  area: "Bole",

  verified: true,
};

export function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] =
    useState<UserProfile>(
      initialProfile
    );

  const [avatarUrl, setAvatarUrl] =
    useState<string>();

  const [saving, setSaving] =
    useState(false);

  const update = (
    values: Partial<UserProfile>
  ) => {
    setProfile((current) => ({
      ...current,
      ...values,
    }));
  };

  const saveProfile = async () => {
    setSaving(true);

    // Backend integration later.
    await new Promise((resolve) =>
      setTimeout(resolve, 600)
    );

    localStorage.setItem(
      "yegna-profile",
      JSON.stringify(profile)
    );

    setSaving(false);
  };

  const handleAvatar = (
    file: File
  ) => {
    const url =
      URL.createObjectURL(file);

    setAvatarUrl(url);

    // Later:
    // upload file to backend.
  };

  return (
    <AppShell>
      <PageContainer>
        <main className="mx-auto max-w-2xl px-1 py-6">
          {/* HEADER */}

          <div className="mb-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
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
                My Profile
              </h1>

              <p className="mt-1 text-xs text-gray-400">
                Manage your personal information
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* PROFILE HEADER */}

            <ProfileSection>
              <AvatarPicker
                name={`${profile.firstName} ${profile.lastName}`}
                imageUrl={
                  avatarUrl ??
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
                      checked={true}
                      onChange={() => {}}
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

            {/* ACCOUNT */}

            <ProfileSection
              title="Account"
            >
              <div className="space-y-1">
                <AccountAction
                  icon={LogOut}
                  title="Log out"
                  onClick={() => {}}
                />

                <AccountAction
                  icon={Trash2}
                  title="Delete account"
                  danger
                  onClick={() => {}}
                />
              </div>
            </ProfileSection>
          </div>
        </main>
      </PageContainer>
    </AppShell>
  );
}