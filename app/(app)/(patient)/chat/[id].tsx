import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Timestamp, collection, query, orderBy, onSnapshot, serverTimestamp, where, doc, deleteDoc } from 'firebase/firestore';
import cores from '../../../../src/constants/colors';
import { useGlobalAuthState } from '../../../../src/globalAuthState';
import { sendMessage } from '../../../../src/services/firestore';
import { Message } from '../../../../src/types/chat';
import { formatarDataHora } from '../../../../src/utils/dateHelpers';
import { firestore } from '../../../../src/services/firebaseConfig';

export default function ChatConversationScreen() {
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useGlobalAuthState();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(firestore, 'messages'),
      where('chatId', '==', chatId),
      orderBy('sentAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        sentAt: doc.data().sentAt instanceof Timestamp ? doc.data().sentAt.toDate() : new Date(doc.data().sentAt)
      } as Message));
      setMessages(updatedMessages);
    }, (error) => {
      console.error("Error fetching messages:", error);
      Alert.alert("Error", "Failed to load messages. Please try again.");
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && user && chatId) {
      try {
        await sendMessage({
          chatId,
          senderId: user.uid,
          content: newMessage.trim(),
          sentAt: serverTimestamp() as any
        });
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        Alert.alert("Error", "Failed to send message. Please try again.");
      }
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await deleteDoc(doc(firestore, 'messages', messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      Alert.alert("Error", "Failed to delete message. Please try again.");
    }
  };

  const handleLongPress = useCallback((message: Message) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => deleteMessage(message.id)
        }
      ]
    );
  }, []);

  const renderMessage = useCallback(({ item }: { item: Message }) => (
    <TouchableOpacity
      onLongPress={() => handleLongPress(item)}
      delayLongPress={500}
      activeOpacity={0.7}
    >
      <View style={[
        styles.messageBubble,
        item.senderId === user?.uid ? styles.sentMessage : styles.receivedMessage
      ]}>
        <Text style={[
          styles.messageText,
          item.senderId === user?.uid ? styles.sentMessageText : styles.receivedMessageText
        ]}>{item.content}</Text>
        <Text style={[
          styles.messageTime,
          item.senderId === user?.uid ? styles.sentMessageTime : styles.receivedMessageTime
        ]}>
          {formatarDataHora(item.sentAt)}
        </Text>
      </View>
    </TouchableOpacity>
  ), [user, handleLongPress]);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Digite sua mensagem..."
          placeholderTextColor={cores.desativado}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Feather name="send" size={24} color={cores.primaria} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  messageList: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginVertical: 5,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: cores.primaria,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: cores.textoBranco,
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: cores.textoBranco,
  },
  receivedMessageText: {
    color: cores.texto,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 5,
  },
  sentMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
  },
  receivedMessageTime: {
    color: cores.desativado,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: cores.textoBranco,
    borderTopWidth: 1,
    borderTopColor: cores.desativado,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: cores.desativado,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    color: cores.texto,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.textoBranco,
  },
});