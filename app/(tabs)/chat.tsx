import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import cores from '../../src/constants/colors';
import { useGlobalAuthState } from '../../src/globalAuthState';
import { getChats, deleteChat, createChat } from '../../src/services/firestore';
import { Chat } from '../../src/types/chat';
import { formatarData } from '../../src/utils/dateHelpers';
import Loading from '../../src/components/common/Loading';
import { Feather } from '@expo/vector-icons';

export default function ChatListScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useGlobalAuthState();
  const router = useRouter();

  const fetchChats = async () => {
    if (user) {
      try {
        console.log('Fetching chats for user:', user.uid);
        const fetchedChats = await getChats(user.uid);
        console.log('Fetched chats:', fetchedChats);
        setChats(fetchedChats);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setError('Failed to fetch chats');
      } finally {
        setLoading(false);
      }
    } else {
      console.log('No user found, setting loading to false');
      setLoading(false);
      setError('No user found');
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);

  const handleDeleteChat = async (chatId: string) => {
    Alert.alert(
      "Deletar Conversa",
      "Tem certeza que deseja deletar esta conversa?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Deletar", 
          onPress: async () => {
            try {
              await deleteChat(chatId);
              fetchChats(); // Refresh the chat list
            } catch (error) {
              console.error('Error deleting chat:', error);
              Alert.alert("Erro", "Não foi possível deletar a conversa.");
            }
          }
        }
      ]
    );
  };

  const handleStartNewChat = async (therapistId: string, therapistName: string) => {
    if (user) {
      try {
        const newChat = await createChat({
          patientId: user.uid,
          therapistId,
          therapistName,
          lastMessage: "Conversa iniciada",
          createdAt: new Date(),
          lastMessageAt: new Date(),
        });
        router.push(`/(app)/(patient)/chat/${newChat.id}`);
      } catch (error) {
        console.error('Error creating new chat:', error);
        Alert.alert("Erro", "Não foi possível iniciar uma nova conversa.");
      }
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push(`/(app)/(patient)/chat/${item.id}`)}
    >
      <View style={styles.chatInfo}>
        <Text style={styles.therapistName}>{item.therapistName}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        <Text style={styles.timestamp}>
          {formatarData(item.lastMessageAt instanceof Timestamp ? item.lastMessageAt.toDate() : item.lastMessageAt)}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteChat(item.id)} style={styles.deleteButton}>
        <Feather name="trash-2" size={24} color={cores.erro} />
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  errorText: {
    fontSize: 16,
    color: cores.erro,
    textAlign: 'center',
    marginTop: 20,
  },
  chatInfo: {
    flex: 1,
  },
  deleteButton: {
    padding: 10,
  },
});