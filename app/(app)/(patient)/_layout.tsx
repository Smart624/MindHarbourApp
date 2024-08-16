import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import cores from '../../../src/constants/colors';

export default function PatientLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color={cores.texto} />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="book-appointment"
        options={{ title: 'Agendar Consulta' }}
      />
      <Stack.Screen
        name="resource-library"
        options={{ title: 'Biblioteca de Recursos' }}
      />
      <Stack.Screen
        name="mock-video-call"
        options={{ title: 'Chamada de Vídeo', headerShown: false }}
      />
      <Stack.Screen
        name="community"
        options={{ title: 'Comunidade' }}
      />
      <Stack.Screen
        name="hidden-therapist-creation"
        options={{ title: 'Criar Terapeuta', headerShown: false }}
      />
      <Stack.Screen
        name="emergency-resources"
        options={{ title: 'Recursos de Emergência' }}
      />
    </Stack>
  );
}