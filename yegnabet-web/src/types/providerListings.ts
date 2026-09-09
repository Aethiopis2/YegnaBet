import type { ProviderLocation } from "./provider";

export interface ListingPhotoDraft {
  id?: number;
  url: string;
  file?: File;
  isPrimary: boolean;
}

export interface ListingVideoDraft {
  id?: number;
  url: string;
}

export type ListingAttributeValue =
  | string
  | number
  | boolean;

export interface ListingDraft {
  id?: number;

  title: string;
  description: string;

  price: string;
  priceUnit: string;
  method: string;

  taxonomyId: number | null;
  city: string;
  area: string;
  subArea?: string;

  attributes: Record<string, ListingAttributeValue>;

  photos: ListingPhotoDraft[];
  videos: ListingVideoDraft[];

  latitude: number | null;
  longitude: number | null;

  preciseLocation: boolean;
}

export type ListingWizardStep =
  | "basics"
  | "taxonomy"
  | "attributes"
  | "location"
  | "media"
  | "details"
  | "review";

export interface ListingWizardStepDefinition {
  id: ListingWizardStep;
  title: string;
  description: string;
}

export const LISTING_WIZARD_STEPS: ListingWizardStepDefinition[] = [
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

export interface ListingWizardProps {
  initialData?: Partial<ListingDraft>;

  locations: ProviderLocation[];

  onSubmit: (listing: ListingDraft) => Promise<void>;

  onCancel?: () => void;

  mode?: "create" | "edit";
  providerId?: number;
  listingId?: number;
}

export function createEmptyListingDraft(): ListingDraft {
  return {
    title: "",
    description: "",

    price: "",
    priceUnit: "",
    method: "",

    taxonomyId: null,
    // locationId: null,
    city: "",
    area: "",
    subArea: "",

    attributes: {},

    photos: [],
    videos: [],

    latitude: null,
    longitude: null,

    preciseLocation: false,
  };
}