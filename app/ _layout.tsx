import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { Slot, useRouter, useSegments } from 'expo-router';

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      const inAuthGroup = segments[0] === '(auth)';
      if (!user && !inAuthGroup) {
        router.replace('/login');
      } else if (user && inAuthGroup) {
        router.replace('/(app)/(tabs)');
      }
    }
  }, [user, loading, segments]);

  if (loading) {
    // You can show a loading screen here if you want
    return null;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
      <RootLayoutNav />

    </AuthProvider>
  );
}