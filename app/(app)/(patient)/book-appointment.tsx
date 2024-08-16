import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Calendar from '../../../src/components/common/Calendar';
import Button from '../../../src/components/common/Button';
import cores from '../../../src/constants/colors';
import { formatarData, formatarDataHora } from '../../../src/utils/dateHelpers';
import { createAppointment } from '../../../src/services/firestore';
import { useGlobalAuthState } from '../../../src/globalAuthState';

export default function BookAppointmentScreen() {
  const { therapistId, therapistName } = useLocalSearchParams<{ therapistId: string, therapistName: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useGlobalAuthState();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmAppointment = async () => {
    if (selectedDate && selectedTime && user) {
      try {
        console.log('User object:', user);
        if (!user.uid && !user.id) {
          throw new Error('User ID is undefined');
        }

        const startTime = new Date(selectedDate);
        const [hours, minutes] = selectedTime.split(':');
        startTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 1);  // Assuming 1-hour appointments
        
        await createAppointment({
          patientId: user.uid || user.id,
          therapistId,
          therapistName,
          startTime,
          endTime,
          status: 'scheduled'
        });
        
        Alert.alert(
          "Agendamento Confirmado",
          `Sua consulta com ${therapistName} foi agendada para ${formatarDataHora(startTime)}.`,
          [{ text: "OK", onPress: () => router.push('/(tabs)') }]
        );
      } catch (error) {
        console.error('Error booking appointment:', error);
        Alert.alert("Erro", "Não foi possível agendar a consulta. Por favor, tente novamente.");
      }
    } else {
      console.error('Missing required data:', { selectedDate, selectedTime, user });
      Alert.alert("Erro", "Por favor, selecione uma data e horário e certifique-se de que está logado.");
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