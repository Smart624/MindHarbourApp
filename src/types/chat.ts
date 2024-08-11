
// src/types/chat.ts

import { Timestamp } from 'firebase/firestore';

export interface Chat {
  id: string;
  patientId: string;
  therapistId: string;
  createdAt: Date | Timestamp;
  lastMessageAt: Date | Timestamp;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  sentAt: Date | Timestamp;
}