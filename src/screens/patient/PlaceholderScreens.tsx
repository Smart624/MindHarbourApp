import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import cores from '../../constants/colors';

const PlaceholderScreen: React.FC<{ name: string }> = ({ name }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{name} Screen (Placeholder)</Text>
  </View>
);

export const PatientDashboardScreen: React.FC = () => <PlaceholderScreen name="Dashboard" />;
export const AppointmentBookingScreen: React.FC = () => <PlaceholderScreen name="Appointment Booking" />;
export const ChatScreen: React.FC = () => <PlaceholderScreen name="Chat" />;
export const TherapistDirectoryScreen: React.FC = () => <PlaceholderScreen name="Therapist Directory" />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cores.fundo,
  },
  text: {
    fontSize: 20,
    color: cores.texto,
  },
});