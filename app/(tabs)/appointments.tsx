import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import cores from '../../src/constants/colors';

export default function AppointmentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendamentos</Text>
      <Text style={styles.content}>Aqui você poderá ver e gerenciar seus agendamentos.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: cores.fundo,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: cores.texto,
    textAlign: 'center',
  },
});