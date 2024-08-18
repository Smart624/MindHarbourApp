import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Timestamp } from 'firebase/firestore';
import cores from '../../../../src/constants/colors';
import { useGlobalAuthState } from '../../../../src/globalAuthState';
import { getMessages, sendMessage, subscribeToMessages } from '../../../../src/services/firestore';
import { Message } from '../../../../src/types/chat';
import { formatarDataHora } from '../../../../src/utils/dateHelpers';

export default function ChatConversationScreen() {
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useGlobalAuthState();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    let unsubscribe: () => void;

    const fetchMessages = async () => {
      if (chatId) {
        const fetchedMessages = await getMessages(chatId);
        setMessages(fetchedMessages);

        unsubscribe = subscribeToMessages(chatId, (newMessages) => {
          setMessages(newMessages);
        });
      }
    };

    fetchMessages();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [chatId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && user && chatId) {
      try {
        await sendMessage({
          chatId,
          senderId: user.uid,
          content: newMessage.trim(),
          sentAt: new Date()
        });
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
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
        {formatarDataHora(item.sentAt instanceof Timestamp ? item.sentAt.toDate() : item.sentAt)}
      </Text>
    </View>
  );

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