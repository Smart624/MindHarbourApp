import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Timestamp } from 'firebase/firestore';
import cores from '../../src/constants/colors';
import { useAppointments } from '../../src/hooks/useAppointments';
import Loading from '../../src/components/common/Loading';
import { Appointment } from '../../src/types/appointment';
import { formatarDataHora } from '../../src/utils/dateHelpers';

export default function AppointmentsScreen() {
  const { appointments, loading, error } = useAppointments();
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    if (appointments.length > 0) {
      const marked = appointments.reduce((acc: { [key: string]: { marked: boolean; dotColor: string } }, appointment: Appointment) => {
        const date = appointment.startTime instanceof Timestamp ? appointment.startTime.toDate() : appointment.startTime;
        const dateString = date.toISOString().split('T')[0];
        acc[dateString] = { marked: true, dotColor: cores.primaria };
        return acc;
      }, {});
      setMarkedDates(marked);
    }
  }, [appointments]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Text style={styles.errorText}>Erro ao carregar consultas: {error}</Text>;
  }

  const selectedDateAppointments = appointments.filter(appointment => {
    const appointmentDate = appointment.startTime instanceof Timestamp ? appointment.startTime.toDate() : appointment.startTime;
    return appointmentDate.toISOString().split('T')[0] === selectedDate;
  });

  const renderAppointmentItem = ({ item }: { item: Appointment }) => (
    <View style={styles.appointmentItem}>
      <Text style={styles.therapistName}>{item.therapistName}</Text>
      <Text style={styles.appointmentTime}>{formatarDataHora(item.startTime instanceof Timestamp ? item.startTime.toDate() : item.startTime)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suas Consultas</Text>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          selectedDayBackgroundColor: cores.primaria,
          todayTextColor: cores.primaria,
          arrowColor: cores.primaria,
        }}
      />
      {selectedDate && (
        <FlatList
          data={selectedDateAppointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.noAppointments}>Nenhuma consulta nesta data</Text>}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: cores.fundo,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 20,
  },
  appointmentItem: {
    backgroundColor: cores.textoBranco,
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  therapistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.texto,
  },
  appointmentTime: {
    fontSize: 14,
    color: cores.desativado,
    marginTop: 5,
  },
  noAppointments: {
    fontSize: 16,
    color: cores.desativado,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: cores.desativado,
    textAlign: 'center',
    marginTop: 20,
  },
});