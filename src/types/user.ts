
// src/types/user.ts
export type UserType = 'patient' | 'therapist';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  userType: UserType;
  createdAt: Date;
  updatedAt: Date;
}


export interface Patient extends User {
  dateOfBirth: Date;
  gender: string;
}

export interface Therapist extends User {
  specialization: string;
  licenseNumber: string;
  bio: string;
  languages: string[];
  availability: Availability[];
}

interface Availability {
  day: string;
  startTime: string;
  endTime: string;
}