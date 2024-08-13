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
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="book-appointment" options={{ title: 'Book Appointment' }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
      <Tabs.Screen name="therapists" options={{ title: 'Therapists' }} />
    </Tabs>
  );
}