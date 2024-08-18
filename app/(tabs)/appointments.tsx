import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Timestamp } from 'firebase/firestore';
import { Feather } from '@expo/vector-icons';
import cores from '../../src/constants/colors';
import { useAppointments } from '../../src/hooks/useAppointments';
import Loading from '../../src/components/common/Loading';
import { Appointment } from '../../src/types/appointment';
import { formatarDataHora } from '../../src/utils/dateHelpers';
import { cancelAppointment } from '../../src/services/firestore';

export default function AppointmentsScreen() {
  const { appointments: fetchedAppointments, loading, error, refetchAppointments } = useAppointments();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    setAppointments(fetchedAppointments);
  }, [fetchedAppointments]);

  const updateMarkedDates = useCallback(() => {
    const marked = appointments.reduce((acc: { [key: string]: { marked: boolean; dotColor: string } }, appointment: Appointment) => {
      if (appointment.status === 'scheduled') {
        const date = appointment.startTime instanceof Timestamp ? appointment.startTime.toDate() : appointment.startTime;
        const dateString = date.toISOString().split('T')[0];
        acc[dateString] = { marked: true, dotColor: cores.primaria };
      }
      return acc;
    }, {});
    setMarkedDates(marked);
  }, [appointments]);

  useEffect(() => {
    updateMarkedDates();
  }, [appointments, updateMarkedDates]);

  const handleCancelAppointment = async (appointmentId: string) => {
    Alert.alert(
      "Cancelar Consulta",
      "Tem certeza que deseja cancelar esta consulta?",
      [
        { text: "Não", style: "cancel" },
        { 
          text: "Sim", 
          onPress: async () => {
            try {
              // Immediately update local state
              setAppointments(prevAppointments => 
                prevAppointments.map(app => 
                  app.id === appointmentId ? { ...app, status: 'cancelled' } : app
                )
              );

              // Update Firestore
              await cancelAppointment(appointmentId);
              console.log(`Appointment cancellation successful.`);

              // Refetch appointments to ensure consistency
              await refetchAppointments();

              Alert.alert("Sucesso", "Consulta cancelada com sucesso.");
            } catch (error) {
              console.error('Error cancelling appointment:', error);
              Alert.alert("Erro", `Não foi possível cancelar a consulta. Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
              // Revert local change if Firestore update failed
              await refetchAppointments();
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Text style={styles.errorText}>Erro ao carregar consultas: {error}</Text>;
  }

  const selectedDateAppointments = appointments.filter(appointment => {
    if (appointment.status !== 'scheduled') return false;
    const appointmentDate = appointment.startTime instanceof Timestamp ? appointment.startTime.toDate() : appointment.startTime;
    return appointmentDate.toISOString().split('T')[0] === selectedDate;
  });

  const renderAppointmentItem = ({ item }: { item: Appointment }) => (
    <View style={styles.appointmentItem}>
      <View style={styles.appointmentInfo}>
        <Text style={styles.therapistName}>{item.therapistName}</Text>
        <Text style={styles.appointmentTime}>
          {formatarDataHora(item.startTime instanceof Timestamp ? item.startTime.toDate() : item.startTime)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => handleCancelAppointment(item.id)}
      >
        <Feather name="x-circle" size={24} color={cores.erro} />
      </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: cores.textoBranco,
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  appointmentInfo: {
    flex: 1,
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
  cancelButton: {
    padding: 5,
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
  statusText: {
    fontSize: 14,
    color: cores.desativado,
    fontStyle: 'italic',
  },
});