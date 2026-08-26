export interface UserProfile {
  id: string;

  firstName: string;
  lastName: string;

  phone: string;
  email: string;

  avatarUrl?: string;

  city: string;
  area: string;

  verified: boolean;
}