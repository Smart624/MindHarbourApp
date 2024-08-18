import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Animated } from 'react-native';
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
  const [fadeAnim] = useState(new Animated.Value(0));

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

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
    fadeIn();
  };

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
              // Update Firestore first
              await cancelAppointment(appointmentId);
              
              // Show success message
              await new Promise<void>((resolve) => {
                Alert.alert("Sucesso", "Consulta cancelada com sucesso.", [
                  { text: "OK", onPress: () => resolve() }
                ]);
              });

              // Update local state after success message
              setAppointments(prevAppointments => 
                prevAppointments.map(app => 
                  app.id === appointmentId ? { ...app, status: 'cancelled' } : app
                )
              );

              // Refetch appointments to ensure consistency
              await refetchAppointments();
            } catch (error) {
              console.error('Error cancelling appointment:', error);
              Alert.alert("Erro", `Não foi possível cancelar a consulta. Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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
      <View style={styles.header}>
        <Feather name="calendar" size={24} color={cores.primaria} />
        <Text style={styles.title}>Suas Consultas</Text>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          markedDates={markedDates}
          onDayPress={handleDateSelect}
          theme={{
            backgroundColor: cores.fundo,
            calendarBackground: cores.textoBranco,
            textSectionTitleColor: cores.texto,
            selectedDayBackgroundColor: cores.primaria,
            selectedDayTextColor: cores.textoBranco,
            todayTextColor: cores.primaria,
            dayTextColor: cores.texto,
            textDisabledColor: cores.desativado,
            dotColor: cores.secundaria,
            selectedDotColor: cores.textoBranco,
            arrowColor: cores.primaria,
            monthTextColor: cores.texto,
            textDayFontFamily: 'System',
            textMonthFontFamily: 'System',
            textDayHeaderFontFamily: 'System',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14
          }}
        />
      </View>
      {selectedDate && (
        <Animated.View style={[styles.appointmentsContainer, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Consultas agendadas:</Text>
          <FlatList
            data={selectedDateAppointments}
            renderItem={renderAppointmentItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.noAppointments}>Nenhuma consulta nesta data</Text>}
          />
        </Animated.View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
    marginLeft: 10,
  },
  calendarContainer: {
    backgroundColor: cores.textoBranco,
    borderRadius: 10,
    padding: 10,
    shadowColor: cores.texto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentsContainer: {
    marginTop: 20,
    backgroundColor: cores.textoBranco,
    borderRadius: 10,
    padding: 15,
    shadowColor: cores.texto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 10,
  },
  appointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: cores.fundo,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
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
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: cores.erro,
    textAlign: 'center',
    marginTop: 20,
  },
});