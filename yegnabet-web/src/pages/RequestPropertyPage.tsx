import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Home,
  LandPlot,
  Store,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";
import { PageContainer } from "../components/layout/PageContainer";
import { MatchOptionCard } from "../components/match/MatchOptionCard";
import { MatchProgress } from "../components/match/MatchProgress";

import type {
  PropertyRequest,
} from "../types/request";

const propertyTypes = [
  {
    value: "house",
    label: "House",
    icon: Home,
  },
  {
    value: "apartment",
    label: "Apartment",
    icon: Building2,
  },
  {
    value: "land",
    label: "Land",
    icon: LandPlot,
  },
  {
    value: "commercial",
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
  "Gerji",
];

const features = [
  "Parking",
  "Garden",
  "Furnished",
  "Security",
  "Water supply",
];

export function RequestPropertyPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [request, setRequest] =
    useState<PropertyRequest>({
      id: crypto.randomUUID(),
      type: "property",
      areas: [],
      features: [],
      status: "pending",
      createdAt:
        new Date().toISOString(),
    });

  const update = (
    values: Partial<PropertyRequest>
  ) => {
    setRequest((current) => ({
      ...current,
      ...values,
    }));
  };

  const toggleArea = (area: string) => {
    setRequest((current) => ({
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
    setRequest((current) => ({
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

  const submit = () => {
    const existing = JSON.parse(
      localStorage.getItem(
        "yegna-requests"
      ) ?? "[]"
    );

    localStorage.setItem(
      "yegna-requests",
      JSON.stringify([
        ...existing,
        request,
      ])
    );

    navigate("/requests");
  };

  return (
    <AppShell>
      <PageContainer>
        <main className="mx-auto max-w-xl px-1 py-5">
          <button
            type="button"
            onClick={() =>
              step > 1
                ? setStep(
                    (value) => value - 1
                  )
                : navigate(-1)
            }
            className="
              mb-5
              grid
              size-9
              place-items-center
              rounded-full
              text-gray-500
              hover:bg-gray-100
              dark:hover:bg-white/[0.06]
            "
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
                What do you need?
              </h1>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                Tell us the kind of property
                you're looking for.
              </p>

              <div className="mt-6 grid gap-3">
                {propertyTypes.map(
                  (item) => (
                    <MatchOptionCard
                      key={item.value}
                      label={item.label}
                      icon={item.icon}
                      selected={
                        request.propertyType ===
                        item.value
                      }
                      onClick={() =>
                        update({
                          propertyType:
                            item.value,
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
                Where do you need it?
              </h1>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                Select the areas you'd be
                interested in.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {areas.map((area) => {
                  const selected =
                    request.areas.includes(
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
            </section>
          )}

          {/* STEP 3 */}

          {step === 3 && (
            <section className="mt-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                What's your budget?
              </h1>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <label>
                  <span className="text-[10px] text-gray-400">
                    Minimum
                  </span>

                  <input
                    type="number"
                    value={
                      request.minPrice ??
                      ""
                    }
                    onChange={(event) =>
                      update({
                        minPrice:
                          event.target
                            .value
                            ? Number(
                                event
                                  .target
                                  .value
                              )
                            : undefined,
                      })
                    }
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
                      focus:border-yegna-600
                      dark:border-white/[0.07]
                      dark:bg-white/[0.035]
                      dark:text-white
                    "
                    placeholder="0"
                  />
                </label>

                <label>
                  <span className="text-[10px] text-gray-400">
                    Maximum
                  </span>

                  <input
                    type="number"
                    value={
                      request.maxPrice ??
                      ""
                    }
                    onChange={(event) =>
                      update({
                        maxPrice:
                          event.target
                            .value
                            ? Number(
                                event
                                  .target
                                  .value
                              )
                            : undefined,
                      })
                    }
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
                      focus:border-yegna-600
                      dark:border-white/[0.07]
                      dark:bg-white/[0.035]
                      dark:text-white
                    "
                    placeholder="No limit"
                  />
                </label>
              </div>

              <div className="mt-7">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Bedrooms
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
                            request.bedrooms ===
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
            </section>
          )}

          {/* STEP 4 */}

          {step === 4 && (
            <section className="mt-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Anything else?
              </h1>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                Add things that are important
                to you.
              </p>

              <div className="mt-6 grid gap-3">
                {features.map(
                  (feature) => (
                    <MatchOptionCard
                      key={feature}
                      label={feature}
                      selected={request.features.includes(
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

              <textarea
                value={
                  request.notes ?? ""
                }
                onChange={(event) =>
                  update({
                    notes:
                      event.target.value,
                  })
                }
                placeholder="Anything else you'd like us to know?"
                rows={4}
                className="
                  mt-4
                  w-full
                  resize-none
                  rounded-2xl
                  border
                  border-black/[0.06]
                  bg-white
                  p-4
                  text-sm
                  outline-none
                  focus:border-yegna-600
                  dark:border-white/[0.07]
                  dark:bg-white/[0.035]
                  dark:text-white
                "
              />
            </section>
          )}

          <button
            type="button"
            onClick={() => {
              if (step < 4) {
                setStep(
                  (value) => value + 1
                );
              } else {
                submit();
              }
            }}
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
              transition
              hover:bg-yegna-800
              active:scale-[0.98]
            "
          >
            {step === 4
              ? "Send Request"
              : "Continue"}

            <ArrowRight className="size-4" />
          </button>
        </main>
      </PageContainer>
    </AppShell>
  );
}