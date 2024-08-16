import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { createTherapist } from '../../../src/services/firestore';
import cores from '../../../src/constants/colors';
import { Therapist, UserType } from '../../../src/types/user';

const generateRandomTherapist = (): Therapist => {
  const firstNames = ['Ana', 'Carlos', 'Mariana', 'João', 'Beatriz', 'Rafael', 'Camila', 'Lucas'];
  const lastNames = ['Silva', 'Santos', 'Oliveira', 'Ferreira', 'Rodrigues', 'Almeida', 'Costa', 'Carvalho'];
  const specializations = ['Psicologia Clínica', 'Terapia Cognitivo-Comportamental', 'Psicanálise', 'Psicologia Infantil', 'Neuropsicologia'];
  const languages = ['Português', 'Inglês', 'Espanhol', 'Francês'];

  const randomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);

  return {
    uid: `therapist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    id: `therapist_${Date.now()}`,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    userType: 'therapist' as UserType,
    specialization: randomItem(specializations),
    licenseNumber: `CRP ${randomNumber(1, 20)}/${randomNumber(10000, 99999)}`,
    bio: 'Terapeuta experiente com foco em ajudar pacientes a superar desafios e alcançar bem-estar emocional.',
    languages: [randomItem(languages), randomItem(languages)],
    availability: [
      { day: 'monday', startTime: '09:00', endTime: '17:00' },
      { day: 'wednesday', startTime: '10:00', endTime: '18:00' },
      { day: 'friday', startTime: '08:00', endTime: '16:00' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export default function HiddenTherapistCreatorScreen() {
  const [creatingTherapist, setCreatingTherapist] = useState(false);

  const handleCreateTherapist = async () => {
    setCreatingTherapist(true);
    try {
      const newTherapist = generateRandomTherapist();
      await createTherapist(newTherapist);
      Alert.alert('Sucesso', 'Terapeuta criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar terapeuta:', error);
      Alert.alert('Erro', 'Falha ao criar terapeuta. Tente novamente.');
    } finally {
      setCreatingTherapist(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criador de Terapeuta (Oculto)</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateTherapist}
        disabled={creatingTherapist}
      >
        <Text style={styles.buttonText}>
          {creatingTherapist ? 'Criando...' : 'Criar Terapeuta Aleatório'}
        </Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: cores.primaria,
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: cores.textoBranco,
    fontSize: 16,
    fontWeight: 'bold',
  },
});