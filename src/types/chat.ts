
// src/types/chat.ts

import { Timestamp, FieldValue } from 'firebase/firestore';

export interface Chat {
  id: string;
  chatUniqueId: string;
  patientId: string;
  therapistId: string;
  therapistName: string;
  lastMessage: string;
  createdAt: Date | Timestamp | FieldValue;
  lastMessageAt: Date | Timestamp | FieldValue;
  isArchived: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  sentAt: Date | Timestamp;
}