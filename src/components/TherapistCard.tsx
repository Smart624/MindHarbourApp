import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import cores from '../constants/colors';
import { Therapist } from '../types/user';
import Button from './common/Button';

interface TherapistCardProps {
  therapist: Therapist;
  onBookAppointment: (therapistId: string) => void;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist, onBookAppointment }) => {
  const { id, firstName, lastName, specialization, bio, languages } = therapist;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder image, replace with actual therapist photo
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
      <Button
        title="Agendar Consulta"
        onPress={() => onBookAppointment(id)}
        size="small"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.textoBranco,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: cores.texto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
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
    marginTop: 4,
  },
  bio: {
    fontSize: 14,
    color: cores.texto,
    marginBottom: 12,
  },
  languagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  languages: {
    fontSize: 14,
    color: cores.texto,
    marginLeft: 8,
  },
});

export default TherapistCard;