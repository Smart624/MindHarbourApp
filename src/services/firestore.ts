import { firestore } from './firebaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
  DocumentReference,
  Timestamp
} from 'firebase/firestore';
import { User, Patient, Therapist, UserType } from '../types/user';
import { Appointment } from '../types/appointment';
import { Chat, Message } from '../types/chat';
import { translate } from '../utils/i18n';

const convertToFirestoreData = <T extends DocumentData>(data: T): WithFieldValue<T> => {
  const converted: Record<string, any> = { ...data };
  for (const key in converted) {
    if (converted[key] instanceof Date) {
      converted[key] = Timestamp.fromDate(converted[key] as Date);
    }
  }
  return converted as WithFieldValue<T>;
};

const handleFirestoreError = (error: unknown, operation: string): never => {
  console.error(`Firestore ${operation} error:`, error);
  throw new Error(translate('Failed to ' + operation as any));
};

export const createUser = async (user: User): Promise<void> => {
  try {
    const userRef = doc(firestore, 'users', user.id) as DocumentReference<User>;
    await setDoc(userRef, convertToFirestoreData(user));
  } catch (error) {
    handleFirestoreError(error, 'create user');
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', userId) as DocumentReference<User>);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.createdAt instanceof Timestamp) {
        userData.createdAt = userData.createdAt.toDate();
      }
      if (userData.updatedAt instanceof Timestamp) {
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
    const userRef = doc(firestore, 'users', userId) as DocumentReference<User>;
    await updateDoc(userRef, convertToFirestoreData(data));
  } catch (error) {
    handleFirestoreError(error, 'update user');
  }
};

export const createPatient = async (patient: Patient): Promise<void> => {
  try {
    const patientRef = doc(firestore, 'patients', patient.id) as DocumentReference<Patient>;
    await setDoc(patientRef, convertToFirestoreData(patient));
  } catch (error) {
    handleFirestoreError(error, 'create patient');
  }
};

export const createTherapist = async (therapist: Therapist): Promise<void> => {
  try {
    const therapistRef = doc(firestore, 'therapists', therapist.id) as DocumentReference<Therapist>;
    await setDoc(therapistRef, convertToFirestoreData(therapist));
  } catch (error) {
    handleFirestoreError(error, 'create therapist');
  }
};

export const getTherapists = async (): Promise<Therapist[]> => {
  try {
    const therapistsQuery = query(collection(firestore, 'therapists'));
    const therapistDocs = await getDocs(therapistsQuery);
    return therapistDocs.docs.map(doc => {
      const therapistData = doc.data() as Therapist;
      if (therapistData.createdAt instanceof Timestamp) {
        therapistData.createdAt = therapistData.createdAt.toDate();
      }
      if (therapistData.updatedAt instanceof Timestamp) {
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
    const appointmentRef = doc(firestore, 'appointments', appointment.id) as DocumentReference<Appointment>;
    await setDoc(appointmentRef, convertToFirestoreData(appointment));
  } catch (error) {
    handleFirestoreError(error, 'create appointment');
  }
};

export const getAppointments = async (userId: string, userType: UserType): Promise<Appointment[]> => {
  try {
    const fieldName = userType === 'patient' ? 'patientId' : 'therapistId';
    const appointmentsQuery = query(collection(firestore, 'appointments'), where(fieldName, '==', userId));
    const appointmentDocs = await getDocs(appointmentsQuery);
    return appointmentDocs.docs.map(doc => {
      const appointmentData = doc.data() as Appointment;
      if (appointmentData.startTime instanceof Timestamp) {
        appointmentData.startTime = appointmentData.startTime.toDate();
      }
      if (appointmentData.endTime instanceof Timestamp) {
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
    const chatRef = doc(firestore, 'chats', chat.id) as DocumentReference<Chat>;
    await setDoc(chatRef, convertToFirestoreData(chat));
  } catch (error) {
    handleFirestoreError(error, 'create chat');
  }
};

export const getChats = async (userId: string): Promise<Chat[]> => {
  try {
    const chatsQuery = query(
      collection(firestore, 'chats'),
      where('patientId', '==', userId)
    );
    const chatDocs = await getDocs(chatsQuery);
    return chatDocs.docs.map(doc => {
      const chatData = doc.data() as Chat;
      if (chatData.createdAt instanceof Timestamp) {
        chatData.createdAt = chatData.createdAt.toDate();
      }
      if (chatData.lastMessageAt instanceof Timestamp) {
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
    const messageRef = doc(firestore, 'messages', message.id) as DocumentReference<Message>;
    await setDoc(messageRef, convertToFirestoreData(message));
  } catch (error) {
    handleFirestoreError(error, 'create message');
  }
};

export const getMessages = async (chatId: string): Promise<Message[]> => {
  try {
    const messagesQuery = query(collection(firestore, 'messages'), where('chatId', '==', chatId));
    const messageDocs = await getDocs(messagesQuery);
    return messageDocs.docs.map(doc => {
      const messageData = doc.data() as Message;
      if (messageData.sentAt instanceof Timestamp) {
        messageData.sentAt = messageData.sentAt.toDate();
      }
      return messageData;
    });
  } catch (error) {
    return handleFirestoreError(error, 'get messages');
  }
};