import { firebaseFirestore } from './firebaseConfig';
import firestore from '@react-native-firebase/firestore';
import { User, Patient, Therapist, UserType } from '../types/user';
import { Appointment } from '../types/appointment';
import { Chat, Message } from '../types/chat';
import { translate } from '../utils/i18n';

type FirestoreData = { [key: string]: any };

const convertToFirestoreData = <T extends FirestoreData>(data: T): T => {
  const converted: FirestoreData = { ...data };
  for (const key in converted) {
    if (converted[key] instanceof Date) {
      converted[key] = firestore.Timestamp.fromDate(converted[key] as Date);
    }
  }
  return converted as T;
};

const handleFirestoreError = (error: unknown, operation: string): never => {
  console.error(`Firestore ${operation} error:`, error);
  throw new Error(translate('Failed to ' + operation as any));
};

export const createUser = async (user: User): Promise<void> => {
  try {
    const userRef = firebaseFirestore.doc(`users/${user.id}`);
    await userRef.set(convertToFirestoreData(user));
  } catch (error) {
    handleFirestoreError(error, 'create user');
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await firebaseFirestore.doc(`users/${userId}`).get();
    if (userDoc.exists) {
      const userData = userDoc.data() as User;
      if (userData.createdAt instanceof firestore.Timestamp) {
        userData.createdAt = userData.createdAt.toDate();
      }
      if (userData.updatedAt instanceof firestore.Timestamp) {
        userData.updatedAt = userData.updatedAt.toDate();
      }
      return userData;
    }
    return null;
  } catch (error) {
    return handleFirestoreError(error, 'get user');
  }
};

export const updateUser = async (userId: string, data: Partial<User>): Promise<void> => {
  try {
    const userRef = firebaseFirestore.doc(`users/${userId}`);
    await userRef.update(convertToFirestoreData(data));
  } catch (error) {
    handleFirestoreError(error, 'update user');
  }
};

export const createPatient = async (patient: Patient): Promise<void> => {
  try {
    const patientRef = firebaseFirestore.doc(`patients/${patient.id}`);
    await patientRef.set(convertToFirestoreData(patient));
  } catch (error) {
    handleFirestoreError(error, 'create patient');
  }
};

export const createTherapist = async (therapist: Therapist): Promise<void> => {
  try {
    const therapistRef = firebaseFirestore.doc(`therapists/${therapist.id}`);
    await therapistRef.set(convertToFirestoreData(therapist));
  } catch (error) {
    handleFirestoreError(error, 'create therapist');
  }
};

export const getTherapists = async (): Promise<Therapist[]> => {
  try {
    const therapistsQuery = firebaseFirestore.collection('therapists');
    const therapistDocs = await therapistsQuery.get();
    return therapistDocs.docs.map(doc => {
      const therapistData = doc.data() as Therapist;
      if (therapistData.createdAt instanceof firestore.Timestamp) {
        therapistData.createdAt = therapistData.createdAt.toDate();
      }
      if (therapistData.updatedAt instanceof firestore.Timestamp) {
        therapistData.updatedAt = therapistData.updatedAt.toDate();
      }
      return therapistData;
    });
  } catch (error) {
    return handleFirestoreError(error, 'get therapists');
  }
};

export const createAppointment = async (appointment: Appointment): Promise<void> => {
  try {
    const appointmentRef = firebaseFirestore.doc(`appointments/${appointment.id}`);
    await appointmentRef.set(convertToFirestoreData(appointment));
  } catch (error) {
    handleFirestoreError(error, 'create appointment');
  }
};

export const getAppointments = async (userId: string, userType: UserType): Promise<Appointment[]> => {
  try {
    const fieldName = userType === 'patient' ? 'patientId' : 'therapistId';
    const appointmentsQuery = firebaseFirestore.collection('appointments').where(fieldName, '==', userId);
    const appointmentDocs = await appointmentsQuery.get();
    return appointmentDocs.docs.map(doc => {
      const appointmentData = doc.data() as Appointment;
      if (appointmentData.startTime instanceof firestore.Timestamp) {
        appointmentData.startTime = appointmentData.startTime.toDate();
      }
      if (appointmentData.endTime instanceof firestore.Timestamp) {
        appointmentData.endTime = appointmentData.endTime.toDate();
      }
      return appointmentData;
    });
  } catch (error) {
    return handleFirestoreError(error, 'get appointments');
  }
};

export const createChat = async (chat: Chat): Promise<void> => {
  try {
    const chatRef = firebaseFirestore.doc(`chats/${chat.id}`);
    await chatRef.set(convertToFirestoreData(chat));
  } catch (error) {
    handleFirestoreError(error, 'create chat');
  }
};

export const getChats = async (userId: string): Promise<Chat[]> => {
  try {
    const chatsQuery = firebaseFirestore.collection('chats').where('patientId', '==', userId);
    const chatDocs = await chatsQuery.get();
    return chatDocs.docs.map(doc => {
      const chatData = doc.data() as Chat;
      if (chatData.createdAt instanceof firestore.Timestamp) {
        chatData.createdAt = chatData.createdAt.toDate();
      }
      if (chatData.lastMessageAt instanceof firestore.Timestamp) {
        chatData.lastMessageAt = chatData.lastMessageAt.toDate();
      }
      return chatData;
    });
  } catch (error) {
    return handleFirestoreError(error, 'get chats');
  }
};

export const createMessage = async (message: Message): Promise<void> => {
  try {
    const messageRef = firebaseFirestore.doc(`messages/${message.id}`);
    await messageRef.set(convertToFirestoreData(message));
  } catch (error) {
    handleFirestoreError(error, 'create message');
  }
};

export const getMessages = async (chatId: string): Promise<Message[]> => {
  try {
    const messagesQuery = firebaseFirestore.collection('messages').where('chatId', '==', chatId);
    const messageDocs = await messagesQuery.get();
    return messageDocs.docs.map(doc => {
      const messageData = doc.data() as Message;
      if (messageData.sentAt instanceof firestore.Timestamp) {
        messageData.sentAt = messageData.sentAt.toDate();
      }
      return messageData;
    });
  } catch (error) {
    return handleFirestoreError(error, 'get messages');
  }
};