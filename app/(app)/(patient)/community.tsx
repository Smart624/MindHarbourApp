import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import cores from '../../../src/constants/colors';

const ForumItem = ({ title, participants, lastActivity }: { title: string; participants: number; lastActivity: string }) => (
  <TouchableOpacity style={styles.forumItem}>
    <Text style={styles.forumTitle}>{title}</Text>
    <View style={styles.forumInfo}>
      <Text style={styles.forumParticipants}>
        <Feather name="users" size={14} color={cores.texto} /> {participants} participantes
      </Text>
      <Text style={styles.forumLastActivity}>
        <Feather name="clock" size={14} color={cores.texto} /> {lastActivity}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function CommunityScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Comunidade MindHarbor</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fóruns Anônimos</Text>
        <ForumItem title="Lidando com Ansiedade" participants={253} lastActivity="Há 5 min" />
        <ForumItem title="Depressão e Apoio Mútuo" participants={189} lastActivity="Há 23 min" />
        <ForumItem title="Mindfulness e Meditação" participants={127} lastActivity="Há 1 hora" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Grupos de Apoio</Text>
        <ForumItem title="Superando o Luto" participants={78} lastActivity="Há 2 horas" />
        <ForumItem title="Gestão do Estresse" participants={201} lastActivity="Há 45 min" />
        <ForumItem title="Autoestima e Amor-próprio" participants={156} lastActivity="Há 1 hora" />
      </View>

      <TouchableOpacity style={styles.createTopicButton}>
        <Feather name="plus-circle" size={20} color={cores.textoBranco} />
        <Text style={styles.createTopicText}>Criar Novo Tópico</Text>
      </TouchableOpacity>
    </ScrollView>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 10,
  },
  forumItem: {
    backgroundColor: cores.textoBranco,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: cores.texto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 5,
  },
  forumInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forumParticipants: {
    fontSize: 14,
    color: cores.desativado,
  },
  forumLastActivity: {
    fontSize: 14,
    color: cores.desativado,
  },
  createTopicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.primaria,
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  createTopicText: {
    color: cores.textoBranco,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});