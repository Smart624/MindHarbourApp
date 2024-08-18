import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Calendar from '../../../src/components/common/Calendar';
import Button from '../../../src/components/common/Button';
import cores from '../../../src/constants/colors';
import { formatarData, formatarDataHora } from '../../../src/utils/dateHelpers';
import { useGlobalAuthState } from '../../../src/globalAuthState';
import { createAppointment } from '../../../src/services/firestore';
import { createOrGetChat } from '../../../src/services/chatService';

export default function BookAppointmentScreen() {
  const { therapistId, therapistName } = useLocalSearchParams<{ therapistId: string, therapistName: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useGlobalAuthState();
  const [fadeAnim] = useState(new Animated.Value(0));

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleDateSelect = (day: any) => {
    const [year, month, date] = day.dateString.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, date);
    setSelectedDate(selectedDate);
    setSelectedTime(null);
    fadeIn();
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmAppointment = async () => {
    if (selectedDate && selectedTime && user) {
      try {
        if (!user.uid) {
          throw new Error('User ID is undefined');
        }

        const [hours, minutes] = selectedTime.split(':').map(Number);
        const startTime = new Date(selectedDate);
        startTime.setHours(hours, minutes, 0, 0);
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 1);

        await createAppointment({
          patientId: user.uid,
          therapistId,
          therapistName,
          startTime,
          endTime,
          status: 'scheduled'
        });

        await createOrGetChat(user.uid, therapistId, therapistName);

        Alert.alert(
          "Agendamento Confirmado",
          `Sua consulta com ${therapistName} foi agendada para ${formatarDataHora(startTime)}.`,
          [{ text: "OK", onPress: () => router.push('/(tabs)') }]
        );
      } catch (error) {
        console.error('Error booking appointment:', error);
        Alert.alert("Erro", `Não foi possível agendar a consulta. Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    } else {
      Alert.alert("Erro", "Por favor, selecione uma data e horário e certifique-se de que está logado.");
    }
  };

  const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Feather name="calendar" size={24} color={cores.primaria} />
        <Text style={styles.title}>Agendar Consulta</Text>
      </View>
      <Text style={styles.subtitle}>Com {therapistName}</Text>

      <View style={styles.calendarContainer}>
        <Calendar 
          onDayPress={handleDateSelect}
        />
      </View>

      {selectedDate && (
        <Animated.View style={[styles.timeSection, { opacity: fadeAnim }]}>
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
        </Animated.View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 18,
    color: cores.texto,
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
    marginTop: 20,
    marginBottom: 10,
  },
  timeSection: {
    backgroundColor: cores.textoBranco,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    shadowColor: cores.texto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: cores.primaria,
  },
});