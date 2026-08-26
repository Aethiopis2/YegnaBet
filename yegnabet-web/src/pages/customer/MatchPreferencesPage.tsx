import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  Home,
  LandPlot,
  Store,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppShell } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";

import { MatchOptionCard } from "../../components/match/MatchOptionCard";
import { MatchProgress } from "../../components/match/MatchProgress";

import type {
  MatchPreferences,
  MatchPropertyType,
} from "../../types/match";

const propertyTypes = [
  {
    value: "house" as MatchPropertyType,
    label: "House",
    icon: Home,
  },
  {
    value: "apartment" as MatchPropertyType,
    label: "Apartment",
    icon: Building2,
  },
  {
    value: "land" as MatchPropertyType,
    label: "Land",
    icon: LandPlot,
  },
  {
    value: "commercial" as MatchPropertyType,
    label: "Commercial",
    icon: Store,
  },
];

const areas = [
  "Bole",
  "CMC",
  "Kazanchis",
  "Ayat",
  "Saris",
  "Summit",
  "Lebu",
  "Gerji",
];

const features = [
  "Parking",
  "Garden",
  "Furnished",
  "Security",
  "Water supply",
  "Solar backup",
];

export function MatchPreferencesPage() {
  const navigate = useNavigate();

  const [preferences, setPreferences] =
    useState<MatchPreferences>({
      propertyType: undefined,
      city: "Addis Ababa",
      areas: [],
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      features: [],
      verifiedOnly: false,
    });

  const [step, setStep] = useState(1);

  const update = (
    values: Partial<MatchPreferences>
  ) => {
    setPreferences((current) => ({
      ...current,
      ...values,
    }));
  };

  const toggleArea = (area: string) => {
    setPreferences((current) => ({
      ...current,
      areas: current.areas.includes(area)
        ? current.areas.filter(
            (item) => item !== area
          )
        : [...current.areas, area],
    }));
  };

  const toggleFeature = (
    feature: string
  ) => {
    setPreferences((current) => ({
      ...current,
      features: current.features.includes(
        feature
      )
        ? current.features.filter(
            (item) => item !== feature
          )
        : [...current.features, feature],
    }));
  };

  const next = () => {
    if (step < 4) {
      setStep((value) => value + 1);
      return;
    }

    sessionStorage.setItem(
      "yegna-match-preferences",
      JSON.stringify(preferences)
    );

    navigate("/match/results");
  };

  const back = () => {
    if (step > 1) {
      setStep((value) => value - 1);
    } else {
      navigate(-1);
    }
  };

  return (
    <AppShell>
      <PageContainer>
        <main className="mx-auto max-w-xl px-1 py-5">
          <button
            type="button"
            onClick={back}
            className="
              mb-5
              grid
              size-9
              place-items-center
              rounded-full
              text-gray-500
              transition
              hover:bg-gray-100
              dark:hover:bg-white/[0.06]
            "
            aria-label="Go back"
          >
            <ArrowLeft className="size-4" />
          </button>

          <MatchProgress
            current={step}
            total={4}
          />

          {/* STEP 1 */}

          {step === 1 && (
            <section className="mt-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                What are you looking for?
              </h1>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                Choose the type of property
                that fits your needs.
              </p>

              <div className="mt-6 grid gap-3">
                {propertyTypes.map(
                  (type) => (
                    <MatchOptionCard
                      key={type.value}
                      label={type.label}
                      icon={type.icon}
                      selected={
                        preferences.propertyType ===
                        type.value
                      }
                      onClick={() =>
                        update({
                          propertyType:
                            type.value,
                        })
                      }
                    />
                  )
                )}
              </div>
            </section>
          )}

          {/* STEP 2 */}

          {step === 2 && (
            <section className="mt-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Where should it be?
              </h1>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                Select one or more areas.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {areas.map((area) => {
                  const selected =
                    preferences.areas.includes(
                      area
                    );

                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() =>
                        toggleArea(area)
                      }
                      className={`
                        rounded-full
                        border
                        px-4
                        py-2.5
                        text-xs
                        font-medium
                        transition-all
                        ${
                          selected
                            ? "border-yegna-700 bg-yegna-700 text-white"
                            : "border-black/[0.06] bg-white text-gray-500 dark:border-white/[0.07] dark:bg-white/[0.035] dark:text-gray-400"
                        }
                      `}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() =>
                  update({ areas: [] })
                }
                className="
                  mt-4
                  text-xs
                  font-medium
                  text-gray-400
                  hover:text-yegna-700
                "
              >
                Any area
              </button>
            </section>
          )}

          {/* STEP 3 */}

          {step === 3 && (
            <section className="mt-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Tell us your budget
              </h1>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                Don't worry — you can leave
                either side flexible.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <label>
                  <span className="text-[10px] font-medium text-gray-400">
                    Minimum
                  </span>

                  <input
                    type="number"
                    value={
                      preferences.minPrice ??
                      ""
                    }
                    onChange={(event) =>
                      update({
                        minPrice:
                          event.target.value
                            ? Number(
                                event.target
                                  .value
                              )
                            : undefined,
                      })
                    }
                    placeholder="0"
                    className="
                      mt-2
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-black/[0.06]
                      bg-white
                      px-3
                      text-sm
                      outline-none
                      transition
                      focus:border-yegna-600
                      dark:border-white/[0.07]
                      dark:bg-white/[0.035]
                      dark:text-white
                    "
                  />
                </label>

                <label>
                  <span className="text-[10px] font-medium text-gray-400">
                    Maximum
                  </span>

                  <input
                    type="number"
                    value={
                      preferences.maxPrice ??
                      ""
                    }
                    onChange={(event) =>
                      update({
                        maxPrice:
                          event.target.value
                            ? Number(
                                event.target
                                  .value
                              )
                            : undefined,
                      })
                    }
                    placeholder="No limit"
                    className="
                      mt-2
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-black/[0.06]
                      bg-white
                      px-3
                      text-sm
                      outline-none
                      transition
                      focus:border-yegna-600
                      dark:border-white/[0.07]
                      dark:bg-white/[0.035]
                      dark:text-white
                    "
                  />
                </label>
              </div>

              <div className="mt-8">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Minimum bedrooms
                </p>

                <div className="mt-3 flex gap-2">
                  {[1, 2, 3, 4, 5].map(
                    (number) => (
                      <button
                        key={number}
                        type="button"
                        onClick={() =>
                          update({
                            bedrooms:
                              number,
                          })
                        }
                        className={`
                          grid
                          size-11
                          place-items-center
                          rounded-xl
                          border
                          text-xs
                          font-semibold
                          ${
                            preferences.bedrooms ===
                            number
                              ? "border-yegna-700 bg-yegna-700 text-white"
                              : "border-black/[0.06] bg-white text-gray-500 dark:border-white/[0.07] dark:bg-white/[0.035]"
                          }
                        `}
                      >
                        {number}
                        {number === 5 && "+"}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="mt-7">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Minimum bathrooms
                </p>

                <div className="mt-3 flex gap-2">
                  {[1, 2, 3, 4].map(
                    (number) => (
                      <button
                        key={number}
                        type="button"
                        onClick={() =>
                          update({
                            bathrooms:
                              number,
                          })
                        }
                        className={`
                          grid
                          size-11
                          place-items-center
                          rounded-xl
                          border
                          text-xs
                          font-semibold
                          ${
                            preferences.bathrooms ===
                            number
                              ? "border-yegna-700 bg-yegna-700 text-white"
                              : "border-black/[0.06] bg-white text-gray-500 dark:border-white/[0.07] dark:bg-white/[0.035]"
                          }
                        `}
                      >
                        {number}
                        {number === 4 && "+"}
                      </button>
                    )
                  )}
                </div>
              </div>
            </section>
          )}

          {/* STEP 4 */}

          {step === 4 && (
            <section className="mt-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                What matters to you?
              </h1>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                Pick anything you'd like your
                ideal property to have.
              </p>

              <div className="mt-6 grid gap-3">
                {features.map(
                  (feature) => (
                    <MatchOptionCard
                      key={feature}
                      label={feature}
                      selected={preferences.features.includes(
                        feature
                      )}
                      onClick={() =>
                        toggleFeature(
                          feature
                        )
                      }
                    />
                  )
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  update({
                    verifiedOnly:
                      !preferences.verifiedOnly,
                  })
                }
                className={`
                  mt-3
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  p-4
                  text-left
                  ${
                    preferences.verifiedOnly
                      ? "border-yegna-600 bg-yegna-50 dark:bg-yegna-900/20"
                      : "border-black/[0.05] bg-white dark:border-white/[0.06] dark:bg-white/[0.035]"
                  }
                `}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Verified properties only
                  </p>

                  <p className="mt-0.5 text-[10px] text-gray-400">
                    Only show properties
                    reviewed by Yegna Bet
                  </p>
                </div>

                <div
                  className={`
                    h-6
                    w-11
                    rounded-full
                    p-1
                    transition
                    ${
                      preferences.verifiedOnly
                        ? "bg-yegna-700"
                        : "bg-gray-200 dark:bg-white/10"
                    }
                  `}
                >
                  <div
                    className={`
                      size-4
                      rounded-full
                      bg-white
                      shadow
                      transition-transform
                      ${
                        preferences.verifiedOnly
                          ? "translate-x-5"
                          : ""
                      }
                    `}
                  />
                </div>
              </button>
            </section>
          )}

          <button
            type="button"
            onClick={next}
            className="
              mt-8
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-yegna-700
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-yegna-700/15
              transition-all
              hover:bg-yegna-800
              active:scale-[0.98]
            "
          >
            {step === 4
              ? "Find My Matches"
              : "Continue"}

            <ArrowRight className="size-4" />
          </button>
        </main>
      </PageContainer>
    </AppShell>
  );
}