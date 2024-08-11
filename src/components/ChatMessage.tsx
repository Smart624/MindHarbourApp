import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Timestamp } from 'firebase/firestore';
import cores from '../constants/colors';
import { Message } from '../types/chat';
import { formatarHora } from '../utils/dateHelpers';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser }) => {
  const { content, sentAt } = message;

  const sentAtDate = sentAt instanceof Timestamp ? sentAt.toDate() : sentAt;

  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUser : styles.otherUser
    ]}>
      <View style={[
        styles.bubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
      ]}>
        <Text style={styles.messageText}>{content}</Text>
      </View>
      <Text style={styles.timestamp}>{formatarHora(sentAtDate)}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  currentUser: {
    alignSelf: 'flex-end',
  },
  otherUser: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  currentUserBubble: {
    backgroundColor: cores.primaria,
  },
  otherUserBubble: {
    backgroundColor: cores.fundo,
  },
  messageText: {
    fontSize: 16,
    color: cores.textoBranco,
  },
  timestamp: {
    fontSize: 12,
    color: cores.desativado,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});

export default ChatMessage;