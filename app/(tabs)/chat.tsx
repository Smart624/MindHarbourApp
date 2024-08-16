import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import cores from '../../src/constants/colors';
import { useAuth } from '../../src/context/AuthContext';
import { getChats } from '../../src/services/firestore';
import { Chat } from '../../src/types/chat';
import { formatarData } from '../../src/utils/dateHelpers';

export default function ChatListScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        try {
          const fetchedChats = await getChats(user.id);
          setChats(fetchedChats);
        } catch (error) {
          console.error('Error fetching chats:', error);
        }
      }
    };

    fetchChats();
  }, [user]);

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <Text style={styles.therapistName}>{item.therapistName}</Text>
      <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      <Text style={styles.timestamp}>
        {formatarData(item.lastMessageAt instanceof Timestamp ? item.lastMessageAt.toDate() : item.lastMessageAt)}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suas Conversas</Text>
      {chats.length > 0 ? (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noChats}>Nenhuma conversa encontrada</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: cores.fundo,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 20,
  },
  chatItem: {
    backgroundColor: cores.textoBranco,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  therapistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
  },
  lastMessage: {
    fontSize: 14,
    color: cores.desativado,
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: cores.desativado,
    alignSelf: 'flex-end',
  },
  noChats: {
    fontSize: 16,
    color: cores.desativado,
    textAlign: 'center',
  },
});