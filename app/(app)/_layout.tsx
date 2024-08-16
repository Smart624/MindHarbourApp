import React from 'react';
import { Redirect, Tabs, Stack } from 'expo-router';
import { useGlobalAuthState } from '../../src/globalAuthState';
import Loading from '../../src/components/common/Loading';
import { Feather } from '@expo/vector-icons';
import cores from '../../src/constants/colors';

export default function AppLayout() {
  const { user } = useGlobalAuthState();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="(patient)" 
        options={{ headerShown: false }}
      />
    </Stack>
  );
}