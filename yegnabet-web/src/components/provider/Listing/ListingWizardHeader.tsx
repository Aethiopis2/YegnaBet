import { ArrowLeft } from "lucide-react";

import type {
  ListingWizardStep,
} from "../../../types/providerListings";

interface Props {
  mode: "create" | "edit";
  step: ListingWizardStep;
  onCancel?: () => void;
}

export function ListingWizardHeader({
  mode,
  step,
  onCancel,
}: Props) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div
          className="
            inline-flex
            rounded-full
            bg-emerald-50
            px-3 py-1
            text-[10px]
            font-bold
            uppercase
            tracking-[0.16em]
            text-emerald-700

            dark:bg-orange-400/10
            dark:text-orange-400
          "
        >
          Provider Studio
        </div>

        <h1
          className="
            mt-3
            text-2xl
            font-bold
            tracking-tight
            text-slate-900
            dark:text-white
          "
        >
          {mode === "edit"
            ? "Edit listing"
            : "Create a listing"}
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          {step === "review"
            ? "Review your listing before submitting it."
            : "Let's build your listing step by step."}
        </p>
      </div>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            px-3 py-2
            text-xs
            font-semibold
            text-slate-600
            transition-colors
            hover:bg-slate-50

            dark:border-white/10
            dark:text-slate-300
            dark:hover:bg-white/5
          "
        >
          <ArrowLeft size={14} />
          Cancel
        </button>
      )}
    </div>
  );
}