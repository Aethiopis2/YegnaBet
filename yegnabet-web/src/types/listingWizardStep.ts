export type ListingWizardStep =
  | "basics"
  | "taxonomy"
  | "attributes"
  | "location"
  | "media"
  | "details"
  | "review";

export interface WizardStepDefinition {
  id: ListingWizardStep;
  title: string;
  description: string;
}

export const LISTING_WIZARD_STEPS: WizardStepDefinition[] = [
  {
    id: "basics",
    title: "Basics",
    description: "Start with the basics",
  },
  {
    id: "taxonomy",
    title: "Category",
    description: "Tell us what you're offering",
  },
  {
    id: "attributes",
    title: "Details",
    description: "Add specific information",
  },
  {
    id: "location",
    title: "Location",
    description: "Where is it?",
  },
  {
    id: "media",
    title: "Photos & video",
    description: "Showcase your listing",
  },
  {
    id: "details",
    title: "Pricing",
    description: "Set your listing information",
  },
  {
    id: "review",
    title: "Review",
    description: "Check everything",
  },
];