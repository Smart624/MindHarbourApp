import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useGlobalAuthState } from '../src/globalAuthState';

export default function RootLayout() {
  const { user } = useGlobalAuthState();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      router.replace('/(app)');
    }
  }, [user, segments]);

  return <Slot />;
}