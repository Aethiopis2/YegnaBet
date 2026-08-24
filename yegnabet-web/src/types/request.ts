export type RequestType =
  | "property"
  | "service"
  | "alert";

export type RequestStatus =
  | "pending"
  | "searching"
  | "matches-found"
  | "completed"
  | "cancelled";

export interface PropertyRequest {
  id: string;
  type: "property";

  propertyType?: string;

  city?: string;

  areas: string[];

  minPrice?: number;
  maxPrice?: number;

  bedrooms?: number;
  bathrooms?: number;

  features: string[];

  notes?: string;

  status: RequestStatus;

  createdAt: string;
}

export interface AlertRequest {
  id: string;
  type: "alert";

  title: string;

  propertyType?: string;

  city?: string;

  areas: string[];

  minPrice?: number;
  maxPrice?: number;

  bedrooms?: number;

  verifiedOnly: boolean;

  status: RequestStatus;

  createdAt: string;
}

export type UserRequest =
  | PropertyRequest
  | AlertRequest;