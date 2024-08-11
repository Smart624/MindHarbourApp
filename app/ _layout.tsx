import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import Loading from '../src/components/common/Loading';

function RootLayoutNav() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Stack>
      {user ? (
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}