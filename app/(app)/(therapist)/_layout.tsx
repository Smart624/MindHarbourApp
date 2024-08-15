import { Stack } from 'expo-router';

export default function TherapistLayout() {
  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="appointments" options={{ title: 'Appointments' }} />
      <Stack.Screen name="availability" options={{ title: 'Availability' }} />
    </Stack>
  );
}