import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Timestamp } from 'firebase/firestore';
import cores from '../constants/colors';
import { Appointment } from '../types/appointment';
import { formatarDataHora } from '../utils/dateHelpers';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onCancel, onReschedule }) => {
  const { id, therapistName, startTime, status } = appointment;

  const startTimeDate = startTime instanceof Timestamp ? startTime.toDate() : startTime;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return cores.sucesso;
      case 'cancelled':
        return cores.erro;
      default:
        return cores.alerta;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Agendada';
      case 'cancelled':
        return 'Cancelada';
      case 'completed':
        return 'Concluída';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.therapistName}>{therapistName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
          <Text style={styles.statusText}>{getStatusText(status)}</Text>
        </View>
      </View>
      <Text style={styles.dateTime}>{formatarDataHora(startTimeDate)}</Text>
      {status === 'scheduled' && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onReschedule(id)}>
            <Feather name="calendar" size={20} color={cores.primaria} />
            <Text style={styles.actionText}>Reagendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => onCancel(id)}>
            <Feather name="x-circle" size={20} color={cores.erro} />
            <Text style={[styles.actionText, { color: cores.erro }]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  therapistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: cores.textoBranco,
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateTime: {
    fontSize: 16,
    color: cores.texto,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 4,
    color: cores.primaria,
    fontWeight: '500',
  },
});

export default AppointmentCard;