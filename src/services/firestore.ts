import { 
  doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs,
  Timestamp, serverTimestamp, addDoc, orderBy, deleteDoc, FieldValue
} from 'firebase/firestore';
import { User, Patient, Therapist, UserType } from '../types/user';
import { Appointment } from '../types/appointment';
import { translate } from '../utils/i18n';
import { firestore } from './firebaseConfig';
import { runTransaction } from 'firebase/firestore';
import { Chat, Message } from '../types/chat';


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

// Helper function to convert Date or Timestamp to Timestamp
const toTimestamp = (date: Date | Timestamp): Timestamp => {
  if (date instanceof Timestamp) {
    return date;
  }
  return Timestamp.fromDate(date);
};

// User Management Functions

export const createUser = async (user: User): Promise<void> => {
  try {
    const userRef = doc(firestore, `users/${user.id}`);
    await setDoc(userRef, convertToFirestoreData(user));
  } catch (error) {
    handleFirestoreError(error, 'criar usuário');
  }
};

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

export const updateUser = async (userId: string, data: Partial<User>): Promise<void> => {
  try {
    const userRef = doc(firestore, `users/${userId}`);
    await updateDoc(userRef, convertToFirestoreData(data));
  } catch (error) {
    handleFirestoreError(error, 'atualizar usuário');
  }
};

export const createPatient = async (patient: Patient): Promise<void> => {
  try {
    const patientRef = doc(firestore, `patients/${patient.id}`);
    await setDoc(patientRef, convertToFirestoreData(patient));
  } catch (error) {
    handleFirestoreError(error, 'criar paciente');
  }
};

export const createTherapist = async (therapist: Therapist): Promise<void> => {
  try {
    const therapistRef = doc(firestore, `therapists/${therapist.id}`);
    await setDoc(therapistRef, convertToFirestoreData(therapist));
  } catch (error) {
    handleFirestoreError(error, 'criar terapeuta');
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
    return handleFirestoreError(error, 'obter terapeutas');
  }
};



export const getAppointments = async (uid: string, userType: UserType): Promise<Appointment[]> => {
  if (!uid || !userType) {
    console.error('Invalid uid or userType:', { uid, userType });
    throw new Error('Invalid uid or userType');
  }

  try {
    console.log(`Fetching appointments for ${userType} with UID: ${uid}`);
    const fieldName = userType === 'patient' ? 'patientId' : 'therapistId';
    const appointmentsQuery = query(collection(firestore, 'appointments'), where(fieldName, '==', uid));
    const appointmentDocs = await getDocs(appointmentsQuery);
    console.log(`Found ${appointmentDocs.size} appointments`);
    return appointmentDocs.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        patientId: data.patientId,
        therapistId: data.therapistId,
        therapistName: data.therapistName,
        startTime: data.startTime instanceof Timestamp ? data.startTime.toDate() : new Date(data.startTime),
        endTime: data.endTime instanceof Timestamp ? data.endTime.toDate() : new Date(data.endTime),
        status: data.status,
      };
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw new Error('Failed to fetch appointments');
  }
};


export const cancelAppointment = async (appointmentId: string): Promise<void> => {
  console.log(`Attempting to cancel appointment with ID: ${appointmentId}`);
  try {
    const appointmentRef = doc(firestore, `appointments/${appointmentId}`);
    console.log(`Fetching appointment document...`);
    const appointmentDoc = await getDoc(appointmentRef);
    
    if (!appointmentDoc.exists()) {
      console.error(`Appointment with ID ${appointmentId} not found`);
      throw new Error('Appointment not found');
    }

    const appointmentData = appointmentDoc.data() as Appointment;
    console.log(`Current appointment data:`, appointmentData);
    
    console.log(`Updating appointment status to 'cancelled'...`);
    await updateDoc(appointmentRef, { status: 'cancelled' });
    
    // Verify the update
    const updatedDoc = await getDoc(appointmentRef);
    const updatedData = updatedDoc.data() as Appointment;
    console.log(`Updated appointment data:`, updatedData);

    if (updatedData.status !== 'cancelled') {
      console.error(`Failed to update appointment status. Current status: ${updatedData.status}`);
      throw new Error('Failed to update appointment status');
    }

    console.log(`Appointment successfully cancelled in Firestore`);

    // Check if there are any other active appointments for this patient-therapist pair
    console.log(`Checking for other active appointments...`);
    const activeAppointments = await getActiveAppointments(appointmentData.patientId, appointmentData.therapistId);

    if (activeAppointments.length === 0) {
      console.log(`No active appointments found. Archiving chat...`);
      // If no active appointments, archive the chat
      const chat = await getExistingChat(appointmentData.patientId, appointmentData.therapistId);
      if (chat) {
        await updateChat(chat.id, { isArchived: true });
        console.log(`Chat archived successfully`);
      } else {
        console.log(`No existing chat found to archive`);
      }
    } else {
      console.log(`Found ${activeAppointments.length} active appointments. Chat not archived.`);
    }
  } catch (error) {
    console.error('Error in cancelAppointment:', error);
    throw new Error(`Failed to cancel appointment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};


export const getChats = async (userId: string): Promise<Chat[]> => {
  try {
    const chatsQuery = query(
      collection(firestore, 'chats'),
      where('patientId', '==', userId),
      where('isArchived', '==', false)
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
      return { ...chatData, id: doc.id };
    });
  } catch (error) {
    return handleFirestoreError(error, 'obter chats');
  }
};


const updateChat = async (chatId: string, updates: Partial<Chat>): Promise<void> => {
  const chatRef = doc(firestore, `chats/${chatId}`);
  await updateDoc(chatRef, updates);
};

export const checkAndArchiveChats = async (): Promise<void> => {
  try {
    const chatsQuery = query(collection(firestore, 'chats'), where('isArchived', '==', false));
    const chatDocs = await getDocs(chatsQuery);

    for (const chatDoc of chatDocs.docs) {
      const chat = chatDoc.data() as Chat;
      const activeAppointments = await getActiveAppointments(chat.patientId, chat.therapistId);

      if (activeAppointments.length === 0) {
        await updateChat(chatDoc.id, { isArchived: true });
      }
    }
  } catch (error) {
    console.error('Error in checkAndArchiveChats:', error);
    handleFirestoreError(error, 'verificar e arquivar chats');
  }
};

// Message Management Functions

export const sendMessage = async (message: Omit<Message, 'id'>): Promise<void> => {
  try {
    // Add the new message to the 'messages' collection
    const messageRef = await addDoc(collection(firestore, 'messages'), {
      ...message,
      sentAt: serverTimestamp()
    });

    // Update the last message and timestamp in the corresponding chat document
    const chatRef = doc(firestore, 'chats', message.chatId);
    await updateDoc(chatRef, {
      lastMessage: message.content,
      lastMessageAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
};


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
      return { ...messageData, id: doc.id };
    });
  } catch (error) {
    return handleFirestoreError(error, 'obter mensagens');
  }
};

// Utility Functions

const getActiveAppointments = async (patientId: string, therapistId: string): Promise<Appointment[]> => {
  const appointmentsQuery = query(
    collection(firestore, 'appointments'),
    where('patientId', '==', patientId),
    where('therapistId', '==', therapistId),
    where('status', '==', 'scheduled')
  );
  const appointmentDocs = await getDocs(appointmentsQuery);
  return appointmentDocs.docs.map(doc => ({ ...doc.data(), id: doc.id } as Appointment));
};


const generateChatUniqueId = (patientId: string, therapistId: string): string => {
  return `chat_${patientId}_${therapistId}`;
};

// ... other imports and helper functions ...



export const createAppointment = async (appointment: Omit<Appointment, 'id'>): Promise<string> => {
  console.log('Creating appointment in Firestore:', appointment);
  const appointmentRef = doc(collection(firestore, 'appointments'));
  const newAppointment: Appointment = {
    id: appointmentRef.id,
    ...appointment,
    startTime: toTimestamp(appointment.startTime),
    endTime: toTimestamp(appointment.endTime)
  };
  await setDoc(appointmentRef, newAppointment);
  console.log('Appointment created successfully in Firestore');
  return appointmentRef.id;
};



export const getExistingChat = async (patientId: string, therapistId: string): Promise<Chat | null> => {
  console.log('Getting existing chat:', { patientId, therapistId });
  try {
    const chatUniqueId = `${patientId}-${therapistId}`;
    const chatQuery = query(
      collection(firestore, 'chats'),
      where('chatUniqueId', '==', chatUniqueId)
    );
    const chatDocs = await getDocs(chatQuery);
    console.log('Existing chat query result:', chatDocs.size);

    if (!chatDocs.empty) {
      console.log('Existing chat found');
      const chatData = chatDocs.docs[0].data() as Chat;
      return { ...chatData, id: chatDocs.docs[0].id };
    }
    console.log('No existing chat found');
    return null;
  } catch (error) {
    console.error('Error in getExistingChat:', error);
    throw new Error(`Failed to get existing chat: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

