import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Timestamp } from 'firebase/firestore';
import cores from '../../src/constants/colors';
import { useAppointments } from '../../src/hooks/useAppointments';
import Loading from '../../src/components/common/Loading';
import { Appointment } from '../../src/types/appointment';

export default function AppointmentsScreen() {
  const { appointments, loading } = useAppointments();

  if (loading) {
    return <Loading />;
  }

  const markedDates = appointments.reduce((acc: { [key: string]: { marked: boolean; dotColor: string } }, appointment: Appointment) => {
    const date = appointment.startTime instanceof Timestamp ? appointment.startTime.toDate() : appointment.startTime;
    const dateString = date.toISOString().split('T')[0];
    acc[dateString] = { marked: true, dotColor: cores.primaria };
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suas Consultas</Text>
      <Calendar
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: cores.primaria,
          todayTextColor: cores.primaria,
          arrowColor: cores.primaria,
        }}
      />
      {/* You can add a list of appointments below the calendar if desired */}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: cores.fundo,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: cores.texto,
    textAlign: 'center',
  },
});