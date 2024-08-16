import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Timestamp } from 'firebase/firestore';
import cores from '../../../../src/constants/colors';
import { useAuth } from '../../../../src/context/AuthContext';
import { getMessages, sendMessage } from '../../../../src/services/firestore';
import { Message } from '../../../../src/types/chat';
import { formatarDataHora } from '../../../../src/utils/dateHelpers';

const ensureDate = (date: Date | Timestamp): Date => {
  return date instanceof Timestamp ? date.toDate() : date;
};

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const fetchMessages = useCallback(async () => {
    if (chatId) {
      try {
        const fetchedMessages = await getMessages(chatId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
  }, [chatId]);

  useEffect(() => {
    fetchMessages();
    // Here you would typically set up a real-time listener for new messages
  }, [fetchMessages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && user && chatId) {
      try {
        await sendMessage({
          chatId,
          senderId: user.id,
          content: newMessage.trim(),
          sentAt: new Date()
        });
        setNewMessage('');
        fetchMessages();  // Refetch messages after sending
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageBubble,
      item.senderId === user?.id ? styles.sentMessage : styles.receivedMessage
    ]}>
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.messageTime}>{formatarDataHora(ensureDate(item.sentAt))}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={styles.messageList}
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
    padding: 10,
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
    color: cores.texto,
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: cores.desativado,
    alignSelf: 'flex-end',
    marginTop: 5,
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