import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useGlobalAuthState } from '../../src/globalAuthState';
import Button from '../../src/components/common/Button';
import cores from '../../src/constants/colors';

export default function DashboardScreen() {
  const { user, setUser } = useGlobalAuthState();
  const router = useRouter();

  if (!user) {
    return null; // or handle this case appropriately
  }

  const handleSignOut = () => {
    // Implement sign out logic here
    setUser(null);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to your Dashboard</Text>
      <Text style={styles.subtitle}>Hello, {user.firstName || 'User'}!</Text>
      {user.userType === 'patient' ? (
        <Text style={styles.content}>Here you can view your upcoming appointments and book new ones.</Text>
      ) : (
        <Text style={styles.content}>Here you can manage your appointments and availability.</Text>
      )}
      <Button title="Sign Out" onPress={handleSignOut} />
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
  content: {
    fontSize: 16,
    color: cores.texto,
    textAlign: 'center',
    marginBottom: 30,
  },
});