
// src/types/appointment.ts

import { Timestamp } from 'firebase/firestore';

export interface Appointment {
  id: string;
  patientId: string;
  therapistId: string;
  therapistName: string; 
  startTime: Date | Timestamp;
  endTime: Date | Timestamp;
  status: 'scheduled' | 'completed' | 'cancelled';
}