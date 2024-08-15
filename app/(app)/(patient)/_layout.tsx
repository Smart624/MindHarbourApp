import React from 'react';
import { Stack } from 'expo-router';

export default function PatientLayout() {
  return (
    <Stack>
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
        name="hidden-therapist-creator"
        options={{ title: 'Criar Terapeuta', headerShown: false }}
      />
    </Stack>
  );
}