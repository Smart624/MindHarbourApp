import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import cores from '../../src/constants/colors';
import { useGlobalAuthState } from '../../src/globalAuthState';
import { getChats } from '../../src/services/firestore';
import { Chat } from '../../src/types/chat';
import { formatarData } from '../../src/utils/dateHelpers';
import Loading from '../../src/components/common/Loading';

export default function ChatListScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useGlobalAuthState();
  const router = useRouter();

  useEffect(() => {
    fetchChats();
  }, [user]);

  const fetchChats = async () => {
    if (user) {
      try {
        setLoading(true);
        const fetchedChats = await getChats(user.uid);
        setChats(fetchedChats);
        setError(null);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setError('Failed to fetch chats');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError('No user found');
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push(`/(app)/(patient)/chat/${item.id}`)}
    >
      <View style={styles.chatInfo}>
        <Text style={styles.therapistName}>{item.therapistName}</Text>
        <Text style={styles.timestamp}>
          {formatarData((item.lastMessageAt instanceof Timestamp ? item.lastMessageAt.toDate() : item.lastMessageAt) as Date)}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Text style={styles.errorText}>Erro ao carregar conversas: {error}</Text>;
  }

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
    fontSize: 26,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 20,
    textAlign: 'center',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.textoBranco,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  chatInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 20,
    fontWeight: '600',
    color: cores.texto,
  },
  timestamp: {
    fontSize: 14,
    color: cores.desativado,
    marginTop: 8,
  },
  noChats: {
    fontSize: 18,
    color: cores.desativado,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: cores.erro,
    textAlign: 'center',
    marginTop: 20,
  },
});
