import { 
    doc, setDoc, collection, query, where, getDocs, serverTimestamp, updateDoc, orderBy, limit
    } from 'firebase/firestore';
  import { Chat } from '../types/chat';
  import { firestore } from './firebaseConfig';

  
  export const createOrGetChat = async (patientId: string, therapistId: string, therapistName: string): Promise<Chat> => {
    console.log('Creating or getting chat:', { patientId, therapistId, therapistName });
    try {
      const chatQuery = query(
        collection(firestore, 'chats'),
        where('patientId', '==', patientId),
        where('therapistId', '==', therapistId)
      );
      const chatQuerySnapshot = await getDocs(chatQuery);
  
      if (!chatQuerySnapshot.empty) {
        console.log('Existing chat found');
        const existingChat = chatQuerySnapshot.docs[0].data() as Chat;
        const chatId = chatQuerySnapshot.docs[0].id;
        
        // Unarchive the chat if it was archived
        if (existingChat.isArchived) {
          await updateDoc(doc(firestore, 'chats', chatId), { isArchived: false });
          console.log('Chat unarchived');
        }
        
        return { ...existingChat, id: chatId, isArchived: false };
      } else {
        console.log('Creating new chat');
        const chatRef = doc(collection(firestore, 'chats'));
        const newChat: Chat = {
          id: chatRef.id,
          chatUniqueId: `${patientId}-${therapistId}`,
          patientId,
          therapistId,
          therapistName,
          lastMessage: 'Conversa iniciada',
          createdAt: serverTimestamp(),
          lastMessageAt: serverTimestamp(),
          isArchived: false
        };
        await setDoc(chatRef, newChat);
        console.log('New chat created successfully:', newChat);
        return newChat;
      }
    } catch (error) {
      console.error('Error in createOrGetChat:', error);
      throw new Error('Failed to create or get chat');
    }
  };