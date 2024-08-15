import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useGlobalAuthState } from '../../src/globalAuthState';
import Button from '../../src/components/common/Button';
import cores from '../../src/constants/colors';
import { Feather } from '@expo/vector-icons';

export default function DashboardScreen() {
  const { user, setUser } = useGlobalAuthState();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const handleSignOut = () => {
    setUser(null);
    router.replace('/login');
  };

  const navigateTo = (screen: string) => {
    router.push(screen);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.title}>Bem-vindo, {user.firstName}!</Text>
          <Text style={styles.subtitle}>Como está se sentindo hoje?</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recursos</Text>
        <TouchableOpacity 
          style={styles.resourceButton} 
          onPress={() => navigateTo('/(app)/(patient)/resource-library')}
        >
          <Feather name="book" size={24} color={cores.textoBranco} />
          <Text style={styles.resourceText}>Biblioteca de Recursos</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.resourceButton} 
          onPress={() => navigateTo('/(app)/(patient)/community')}
        >
          <Feather name="users" size={24} color={cores.textoBranco} />
          <Text style={styles.resourceText}>Comunidade</Text>
        </TouchableOpacity>
      </View>

      <Button title="Sair" onPress={handleSignOut} style={styles.signOutButton} />

      {__DEV__ && (
        <TouchableOpacity
          style={styles.hiddenButton}
          onPress={() => navigateTo('/(app)/(patient)/hidden-therapist-creator')}
        >
          <Text style={styles.hiddenButtonText}>Criar Terapeuta (Oculto)</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: cores.primaria,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.textoBranco,
  },
  subtitle: {
    fontSize: 16,
    color: cores.textoBranco,
    opacity: 0.8,
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 15,
  },
  resourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.secundaria,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  resourceText: {
    fontSize: 16,
    color: cores.textoBranco,
    marginLeft: 15,
  },
  signOutButton: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  hiddenButton: {
    backgroundColor: cores.erro,
    padding: 10,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  hiddenButtonText: {
    color: cores.textoBranco,
    fontWeight: 'bold',
  },
});