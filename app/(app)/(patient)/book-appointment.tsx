import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Calendar from '../../../src/components/common/Calendar';
import Button from '../../../src/components/common/Button';
import cores from '../../../src/constants/colors';
import { formatarData } from '../../../src/utils/dateHelpers';

export default function BookAppointmentScreen() {
  const { therapistId, therapistName } = useLocalSearchParams<{ therapistId: string, therapistName: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const router = useRouter();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when a new date is selected
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmAppointment = () => {
    if (selectedDate && selectedTime) {
      // Here you would typically call an API to book the appointment
      console.log(`Appointment booked with ${therapistName} on ${formatarData(selectedDate)} at ${selectedTime}`);
      router.push('/(tabs)');
    }
  };

  // Mock available times - in a real app, these would come from an API
  const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agendar Consulta</Text>
      <Text style={styles.subtitle}>Com {therapistName}</Text>

      <Text style={styles.sectionTitle}>Selecione uma data:</Text>
      <Calendar onDayPress={(day) => handleDateSelect(new Date(day.timestamp))} />

      {selectedDate && (
        <View>
          <Text style={styles.sectionTitle}>Horários disponíveis para {formatarData(selectedDate)}:</Text>
          <View style={styles.timeContainer}>
            {availableTimes.map((time) => (
              <Button
                key={time}
                title={time}
                onPress={() => handleTimeSelect(time)}
                variant={selectedTime === time ? 'primary' : 'outline'}
                size="small"
                style={styles.timeButton}
              />
            ))}
          </View>
        </View>
      )}

      <Button
        title="Confirmar Agendamento"
        onPress={handleConfirmAppointment}
        disabled={!selectedDate || !selectedTime}
        style={styles.confirmButton}
      />
    </ScrollView>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: cores.texto,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
    marginTop: 20,
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeButton: {
    marginBottom: 10,
    width: '30%',
  },
  confirmButton: {
    marginTop: 30,
  },
});