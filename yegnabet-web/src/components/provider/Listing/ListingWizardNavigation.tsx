import {
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";

import type {
  ListingWizardStep,
} from "../../../types/providerListings";

interface Props {
  step: ListingWizardStep;
  first: boolean;
  last: boolean;

  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function ListingWizardNavigation({
  first,
  last,
  onBack,
  onNext,
  onSubmit,
}: Props) {
  return (
    <div
      className="
        mt-8
        flex
        items-center
        justify-between
        border-t
        border-slate-100
        pt-6

        dark:border-white/10
      "
    >
      <button
        type="button"
        disabled={first}
        onClick={onBack}
        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          px-4 py-3
          text-sm
          font-semibold
          text-slate-600
          transition-colors

          hover:bg-slate-50

          disabled:pointer-events-none
          disabled:opacity-30

          dark:text-slate-300
          dark:hover:bg-white/5
        "
      >
        <ArrowLeft size={17} />
        Back
      </button>

      {last ? (
        <button
          type="button"
          onClick={onSubmit}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-slate-900
            px-5 py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition-all
            hover:-translate-y-0.5
            hover:bg-slate-800

            dark:bg-orange-400
            dark:text-slate-950
            dark:hover:bg-orange-300
          "
        >
          <Check size={17} />
          Submit listing
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-slate-900
            px-5 py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition-all
            hover:-translate-y-0.5
            hover:bg-slate-800

            dark:bg-orange-400
            dark:text-slate-950
            dark:hover:bg-orange-300
          "
        >
          Continue
          <ArrowRight size={17} />
        </button>
      )}
    </div>
  );
}