import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import cores from '../../../src/constants/colors';

export default function PatientLayout() {
  const router = useRouter();

  const navigateToDashboard = () => {
    router.push('/(tabs)');
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: cores.primaria,
        },
        headerTintColor: cores.textoBranco,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: ({ canGoBack }) => 
          canGoBack ? (
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color={cores.textoBranco} />
            </TouchableOpacity>
          ) : null,
      }}
    >
      <Stack.Screen
        name="book-appointment"
        options={{ 
          title: 'Agendar Consulta',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push('/(tabs)/therapists')}>
              <Feather name="arrow-left" size={24} color={cores.textoBranco} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="resource-library"
        options={{ 
          title: 'Biblioteca de Recursos',
          headerLeft: () => (
            <TouchableOpacity onPress={navigateToDashboard}>
              <Feather name="arrow-left" size={24} color={cores.textoBranco} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="mock-video-call"
        options={{ title: 'Chamada de Vídeo', headerShown: false }}
      />
      <Stack.Screen
        name="community"
        options={{ 
          title: 'Comunidade',
          headerLeft: () => (
            <TouchableOpacity onPress={navigateToDashboard}>
              <Feather name="arrow-left" size={24} color={cores.textoBranco} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="hidden-therapist-creation"
        options={{ 
          title: 'Criar Terapeuta',
          headerLeft: () => (
            <TouchableOpacity onPress={navigateToDashboard}>
              <Feather name="arrow-left" size={24} color={cores.textoBranco} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="emergency-resources"
        options={{ 
          title: 'Recursos de Emergência',
          headerLeft: () => (
            <TouchableOpacity onPress={navigateToDashboard}>
              <Feather name="arrow-left" size={24} color={cores.textoBranco} />
            </TouchableOpacity>
          ),
        }}
      />
     <Stack.Screen
        name="chat/[id]"
        options={{ 
          title: 'Chat',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push('/(tabs)/chat')}>
              <Feather name="arrow-left" size={24} color={cores.textoBranco} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}