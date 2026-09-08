import type {
  ListingWizardStep,
  ListingWizardStepDefinition,
} from "../../../types/providerListings";

interface Props {
  steps: ListingWizardStepDefinition[];
  currentStep: ListingWizardStep;
}

export function ListingWizardProgress({
  steps,
  currentStep,
}: Props) {
  const currentIndex = steps.findIndex(
    (step) => step.id === currentStep
  );

  return (
    <div className="mt-8">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const completed = index < currentIndex;
          const active = index === currentIndex;

          return (
            <div
              key={step.id}
              className="flex min-w-0 flex-1 items-center"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex h-8 w-8
                    items-center justify-center
                    rounded-full
                    border
                    text-xs
                    font-bold
                    transition-all

                    ${
                      completed || active
                        ? `
                          border-emerald-600
                          bg-emerald-600
                          text-white
                          dark:border-orange-400
                          dark:bg-orange-400
                          dark:text-slate-950
                        `
                        : `
                          border-slate-200
                          bg-white
                          text-slate-400
                          dark:border-white/10
                          dark:bg-white/2
                          dark:text-slate-500
                        `
                    }
                  `}
                >
                  {completed ? "✓" : index + 1}
                </div>

                <span
                  className={`
                    mt-2
                    hidden
                    text-[10px]
                    font-semibold
                    sm:block
                    ${
                      active
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-400 dark:text-slate-500"
                    }
                  `}
                >
                  {step.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`
                    mx-2
                    h-px
                    flex-1
                    transition-colors
                    ${
                      index < currentIndex
                        ? `
                          bg-emerald-600
                          dark:bg-orange-400
                        `
                        : `
                          bg-slate-200
                          dark:bg-white/10
                        `
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}