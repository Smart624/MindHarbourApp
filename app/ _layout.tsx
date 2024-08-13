import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';

console.log('Root layout file is being executed');

function DebugComponent({ name }: { name: string }) {
  useEffect(() => {
    console.log(`${name} rendered`);
  }, [name]);
  return null;
}

export default function RootLayout() {
  console.log('RootLayout component rendering');

  useEffect(() => {
    console.log('RootLayout useEffect executed');
  }, []);

  return (
    <AuthProvider>
      <DebugComponent name="AuthProvider" />
      <Stack>
        <DebugComponent name="Stack" />
        <Stack.Screen 
          name="(auth)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="(app)" 
          options={{ headerShown: false }} 
        />
      </Stack>
    </AuthProvider>
  );
}

console.log('Root layout file fully loaded');