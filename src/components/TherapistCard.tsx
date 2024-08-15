import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import cores from '../../src/constants/colors';
import { Therapist } from '../../src/types/user';

interface TherapistCardProps {
  therapist: Therapist;
  onBookAppointment: () => void;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist, onBookAppointment }) => {
  const { firstName, lastName, specialization, bio, languages } = therapist;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.photo}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{`${firstName} ${lastName}`}</Text>
          <Text style={styles.specialization}>{specialization}</Text>
        </View>
      </View>
      <Text style={styles.bio} numberOfLines={3}>{bio}</Text>
      <View style={styles.languagesContainer}>
        <Feather name="globe" size={16} color={cores.texto} />
        <Text style={styles.languages}>{languages.join(', ')}</Text>
      </View>
      <TouchableOpacity style={styles.bookButton} onPress={onBookAppointment}>
        <Feather name="calendar" size={20} color={cores.textoBranco} />
        <Text style={styles.bookButtonText}>Agendar Consulta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.textoBranco,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: cores.texto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
  },
  specialization: {
    fontSize: 14,
    color: cores.desativado,
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    color: cores.texto,
    marginBottom: 10,
  },
  languagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  languages: {
    fontSize: 14,
    color: cores.texto,
    marginLeft: 5,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.primaria,
    borderRadius: 8,
    padding: 10,
  },
  bookButtonText: {
    color: cores.textoBranco,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default TherapistCard;