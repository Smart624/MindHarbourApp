import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import cores from '../../src/constants/colors';
import TherapistCard from '../../src/components/TherapistCard';
import { Therapist } from '../../src/types/user';

const dummyTherapists: Therapist[] = [
  {
    id: '1',
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao.silva@example.com',
    userType: 'therapist',
    createdAt: new Date(),
    updatedAt: new Date(),
    specialization: 'Psicologia Clínica',
    licenseNumber: 'CRP 01/12345',
    bio: 'Especialista em terapia cognitivo-comportamental',
    languages: ['Português', 'Inglês'],
    availability: [
      { day: 'monday', startTime: '09:00', endTime: '17:00' },
      { day: 'wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'friday', startTime: '09:00', endTime: '17:00' },
    ],
  },
  {
    id: '2',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria.santos@example.com',
    userType: 'therapist',
    createdAt: new Date(),
    updatedAt: new Date(),
    specialization: 'Psicanálise',
    licenseNumber: 'CRP 01/67890',
    bio: 'Experiência em tratamento de ansiedade e depressão',
    languages: ['Português', 'Espanhol'],
    availability: [
      { day: 'tuesday', startTime: '10:00', endTime: '18:00' },
      { day: 'thursday', startTime: '10:00', endTime: '18:00' },
      { day: 'saturday', startTime: '09:00', endTime: '13:00' },
    ],
  },
];

export default function TherapistsScreen() {
  const handleBookAppointment = (therapistId: string) => {
    console.log(`Agendar consulta com terapeuta ${therapistId}`);
    // Implementar lógica de agendamento
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terapeutas</Text>
      <FlatList
        data={dummyTherapists}
        renderItem={({ item }) => (
          <TherapistCard
            therapist={item}
            onBookAppointment={handleBookAppointment}
          />
        )}
        keyExtractor={(item) => item.id}
      />
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
});