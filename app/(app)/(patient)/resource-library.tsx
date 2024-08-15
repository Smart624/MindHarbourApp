import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import cores from '../../../src/constants/colors';

const ResourceItem = ({ title, icon }: { title: string; icon: string }) => (
  <TouchableOpacity style={styles.resourceItem}>
    <Feather name={icon as any} size={24} color={cores.primaria} />
    <Text style={styles.resourceTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function ResourceLibraryScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Biblioteca de Recursos</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conteúdo Educacional</Text>
        <ResourceItem title="Entendendo a Ansiedade" icon="book-open" />
        <ResourceItem title="Técnicas de Meditação" icon="book" />
        <ResourceItem title="Sono Saudável" icon="moon" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ferramentas de Autoajuda</Text>
        <ResourceItem title="Diário de Gratidão" icon="edit" />
        <ResourceItem title="Exercícios de Respiração" icon="wind" />
        <ResourceItem title="Planejador de Objetivos" icon="target" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Áudios de Relaxamento</Text>
        <ResourceItem title="Meditação Guiada" icon="headphones" />
        <ResourceItem title="Sons da Natureza" icon="music" />
        <ResourceItem title="Relaxamento Muscular" icon="radio" />
      </View>
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
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: cores.textoBranco,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: cores.texto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resourceTitle: {
    fontSize: 16,
    color: cores.texto,
    marginLeft: 15,
  },
});