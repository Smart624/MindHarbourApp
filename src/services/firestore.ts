import { 
  doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs,
  Timestamp, serverTimestamp, addDoc, orderBy
} from 'firebase/firestore';
import { User, Patient, Therapist, UserType } from '../types/user';
import { Appointment } from '../types/appointment';
import { Chat, Message } from '../types/chat';
import { translate } from '../utils/i18n';
import { firestore } from './firebaseConfig';

type FirestoreData = { [key: string]: any };

const convertToFirestoreData = <T extends FirestoreData>(data: T): T => {
  const converted: FirestoreData = { ...data };
  for (const key in converted) {
    if (converted[key] instanceof Date) {
      converted[key] = Timestamp.fromDate(converted[key] as Date);
    }
  }
  return converted as T;
};

const handleFirestoreError = (error: unknown, operation: string): never => {
  console.error(`Erro do Firestore ${operation}:`, error);
  throw new Error(translate('Falha ao ' + operation as any));
};

// Cria um novo usuário
export const createUser = async (user: User): Promise<void> => {
  try {
    const userRef = doc(firestore, `users/${user.id}`);
    await setDoc(userRef, convertToFirestoreData(user));
  } catch (error) {
    handleFirestoreError(error, 'criar usuário');
  }
};

// Obtém um usuário pelo ID
export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(firestore, `users/${userId}`));
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
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
    return handleFirestoreError(error, 'obter usuário');
  }
};

// Atualiza um usuário existente
export const updateUser = async (userId: string, data: Partial<User>): Promise<void> => {
  try {
    const userRef = doc(firestore, `users/${userId}`);
    await updateDoc(userRef, convertToFirestoreData(data));
  } catch (error) {
    handleFirestoreError(error, 'atualizar usuário');
  }
};

// Cria um novo paciente
export const createPatient = async (patient: Patient): Promise<void> => {
  try {
    const patientRef = doc(firestore, `patients/${patient.id}`);
    await setDoc(patientRef, convertToFirestoreData(patient));
  } catch (error) {
    handleFirestoreError(error, 'criar paciente');
  }
};

// Cria um novo terapeuta
export const createTherapist = async (therapist: Therapist): Promise<void> => {
  try {
    const therapistRef = doc(firestore, `therapists/${therapist.id}`);
    await setDoc(therapistRef, convertToFirestoreData(therapist));
  } catch (error) {
    handleFirestoreError(error, 'criar terapeuta');
  }
};

// Obtém todos os terapeutas
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
    return handleFirestoreError(error, 'obter terapeutas');
  }
};

// Helper function to convert Date or Timestamp to Timestamp
const toTimestamp = (date: Date | Timestamp): Timestamp => {
  if (date instanceof Timestamp) {
    return date;
  }
  return Timestamp.fromDate(date);
};

export const createAppointment = async (appointment: Omit<Appointment, 'id'>): Promise<void> => {
  try {
    console.log('Creating appointment with data:', appointment);  // Keep this line for debugging
    if (!appointment.patientId) {
      throw new Error('patientId is undefined');
    }
    const appointmentRef = doc(collection(firestore, 'appointments'));
    const newAppointment: Appointment = {
      id: appointmentRef.id,
      ...appointment,
      startTime: toTimestamp(appointment.startTime),
      endTime: toTimestamp(appointment.endTime)
    };
    await setDoc(appointmentRef, newAppointment);
  } catch (error) {
    console.error('Error in createAppointment:', error);  // Keep this line for detailed error logging
    handleFirestoreError(error, 'criar consulta');
  }
};

// Obtém as consultas de um usuário
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
    return handleFirestoreError(error, 'obter consultas');
  }
};

// Cria um novo chat
export const createChat = async (chat: Chat): Promise<void> => {
  try {
    const chatRef = doc(firestore, `chats/${chat.id}`);
    await setDoc(chatRef, convertToFirestoreData(chat));
  } catch (error) {
    handleFirestoreError(error, 'criar chat');
  }
};

// Obtém os chats de um usuário
export const getChats = async (userId: string): Promise<Chat[]> => {
  try {
    const chatsQuery = query(collection(firestore, 'chats'), where('patientId', '==', userId));
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
    return handleFirestoreError(error, 'obter chats');
  }
};

// Cria uma nova mensagem
export const sendMessage = async (message: Omit<Message, 'id'>): Promise<void> => {
  try {
    await addDoc(collection(firestore, 'messages'), {
      ...message,
      sentAt: toTimestamp(message.sentAt)
    });
  } catch (error) {
    handleFirestoreError(error, 'criar mensagem');
  }
};

// Obtém as mensagens de um chat
export const getMessages = async (chatId: string): Promise<Message[]> => {
  try {
    const messagesQuery = query(
      collection(firestore, 'messages'),
      where('chatId', '==', chatId),
      orderBy('sentAt', 'desc')
    );
    const messageDocs = await getDocs(messagesQuery);
    return messageDocs.docs.map(doc => {
      const messageData = doc.data() as Message;
      if (messageData.sentAt instanceof Timestamp) {
        messageData.sentAt = messageData.sentAt.toDate();
      }
      return messageData;
    });
  } catch (error) {
    return handleFirestoreError(error, 'obter mensagens');
  }
};