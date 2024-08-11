import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import Button from '../../src/components/common/Button';
import cores from '../../src/constants/colors';

export default function DashboardScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Dashboard</Text>
      <Text style={styles.subtitle}>Olá, {user?.firstName || 'Usuário'}!</Text>
      <Button title="Sair" onPress={signOut} />
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
  subtitle: {
    fontSize: 18,
    color: cores.texto,
    marginBottom: 30,
  },
});