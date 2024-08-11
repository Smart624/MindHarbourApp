import React from 'react';
import { Tabs } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function AppLayout() {
  const { user } = useAuth();

  return (
    <Tabs>
      {user?.userType === 'patient' ? (
        <>
          <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
          <Tabs.Screen name="book-appointment" options={{ title: 'Book Appointment' }} />
          <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
          <Tabs.Screen name="therapists" options={{ title: 'Therapists' }} />
        </>
      ) : (
        <>
          <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
          <Tabs.Screen name="appointments" options={{ title: 'Appointments' }} />
          <Tabs.Screen name="availability" options={{ title: 'Availability' }} />
        </>
      )}
    </Tabs>
  );
}