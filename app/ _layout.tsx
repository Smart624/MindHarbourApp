import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function RootLayout() {
  const { user } = useAuth();

  return (
    <Stack>
      {user ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}