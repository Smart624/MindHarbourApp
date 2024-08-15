import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import Loading from '../../src/components/common/Loading';

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs>
      {user.userType === 'patient' ? (
        <Tabs.Screen 
          name="(patient)" 
          options={{ headerShown: false }}
        />
      ) : (
        <Tabs.Screen 
          name="(therapist)" 
          options={{ headerShown: false }}
        />
      )}
    </Tabs>
  );
}