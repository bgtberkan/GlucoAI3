export enum UserType {
  PATIENT = 'PATIENT',
  HEALTHCARE_PROFESSIONAL = 'HEALTHCARE_PROFESSIONAL'
}

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  userType: UserType;
  profilePicture?: string;
}

export interface Patient extends User {
  healthcareProviderId?: string;
}

export interface HealthcareProfessional extends User {
  patients?: string[]; // Patient IDs
  specialty?: string;
}

export type AuthUser = {
  uid: string;
  email: string | null;
} 