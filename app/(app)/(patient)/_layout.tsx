import { Stack } from 'expo-router';

export default function PatientLayout() {
  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="book-appointment" options={{ title: 'Book Appointment' }} />
      <Stack.Screen name="therapists" options={{ title: 'Therapists' }} />
      <Stack.Screen name="chat" options={{ title: 'Chats' }} />
    </Stack>
  );
}