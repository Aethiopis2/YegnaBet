import { useEffect, useMemo, useState } from "react";

import type {
ProviderLocation,
ProviderTaxonomy,
} from "../../../types/provider";

import {
createEmptyListingDraft,
LISTING_WIZARD_STEPS,
type ListingDraft,
type ListingWizardProps,
} from "../../../types/providerListings";

import { ListingWizardHeader } from "./ListingWizardHeader";
import { ListingWizardNavigation } from "./ListingWizardNavigation";
import { ListingWizardProgress } from "./ListingWizardProgress";

import { ListingBasicsStep } from "./steps/ListingBasicsStep";
import { ListingTaxonomyStep } from "./steps/ListingTaxonomyStep";
import { ListingAttributesStep } from "./steps/ListingAttributesSteps";
import { ListingLocationStep } from "./steps/ListingLocationSteps";
import { ListingMediaStep } from "./steps/ListingMediaStep";
import { ListingDetailsStep } from "./steps/ListingDetailsStep";
import { ListingReviewStep } from "./steps/ListingReviewStep";
import { API } from "../../../types/api";

export function ListingWizard({
    initialData,
    locations,
    taxonomy,
    providerId,
    listingId,
    onSubmit,
    onCancel,
    mode = "create",
  }: ListingWizardProps) {

  const [stepIndex, setStepIndex] = useState(0);

  const [draft, setDraft] = useState<ListingDraft>(() => ({
    ...createEmptyListingDraft(), ...initialData,}));

  const step =LISTING_WIZARD_STEPS[stepIndex];

  const isFirst = stepIndex === 0;

  const isLast = stepIndex === LISTING_WIZARD_STEPS.length - 1;

  const updateDraft = (
    changes: Partial<ListingDraft>
  ) => {
    setDraft((current) => ({
      ...current,
      ...changes,
    }));
  };

  const next = () => {
    if (!isLast) {
    setStepIndex((current) => current + 1);
    }
  };

  const back = () => {
    if (!isFirst) {
      setStepIndex((current) => current - 1);
    }
  };

  const handleSubmit = async () => {
    await onSubmit(draft);
  };


  return (
  <section
  className="
  rounded-3xl
  border
  border-slate-200/80
  bg-white
  p-5
  shadow-sm
  sm:p-7
  lg:p-8
  dark:border-white/10
  dark:bg-white/4.5
    "
  >
    <ListingWizardHeader
      mode={mode}
      step={step.id}
      onCancel={onCancel}
    />

    <ListingWizardProgress
      steps={LISTING_WIZARD_STEPS}
      currentStep={step.id}
    />

    <div className="mx-auto mt-10 max-w-3xl">
      {step.id === "basics" && (
        <ListingBasicsStep
          value={draft}
          onChange={updateDraft}
        />
      )}

      {step.id === "taxonomy" && (
        <ListingTaxonomyStep
          taxonomy={taxonomy}
          value={draft.taxonomyId}
          onChange={(taxonomyId) =>
            updateDraft({
              taxonomyId,
            })
          }
        />
      )}

      {step.id === "attributes" && (
        <ListingAttributesStep
          attributes={
            draft.attributes
          }
          onChange={(attributes) =>
            updateDraft({
              attributes,
            })
          }
        />
      )}

      {step.id === "location" && (
        <ListingLocationStep
          locations={locations}
          locationId={
            draft.locationId
          }
          latitude={
            draft.latitude
          }
          longitude={
            draft.longitude
          }
          preciseLocation={
            draft.preciseLocation
          }
          onChange={({
            locationId,
            latitude,
            longitude,
            preciseLocation,
          }) =>
            updateDraft({
              locationId,
              latitude,
              longitude,
              preciseLocation,
            })
          }
        />
      )}

      {step.id === "media" && (
        <ListingMediaStep
          photos={draft.photos}
          videos={draft.videos}
          onPhotosChange={(
            photos
          ) =>
            updateDraft({
              photos,
            })
          }
          onVideosChange={(
            videos
          ) =>
            updateDraft({
              videos,
            })
          }
        />
      )}

      {step.id === "details" && (
        <ListingDetailsStep
          value={draft}
          onChange={updateDraft}
        />
      )}

      {step.id === "review" && (
        <ListingReviewStep
          listing={draft}
          taxonomy={taxonomy}
          locations={locations}
        />
      )}
    </div>

    <ListingWizardNavigation
      step={step.id}
      first={isFirst}
      last={isLast}
      onBack={back}
      onNext={next}
      onSubmit={handleSubmit}
    />
  </section>
  );
}