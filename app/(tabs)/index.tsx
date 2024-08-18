import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useGlobalAuthState } from '../../src/globalAuthState';
import Button from '../../src/components/common/Button';
import cores from '../../src/constants/colors';
import { Feather } from '@expo/vector-icons';
import { useAppointments } from '../../src/hooks/useAppointments';
import { formatarDataHora } from '../../src/utils/dateHelpers';
import { Timestamp } from 'firebase/firestore';
import { Appointment } from '../../src/types/appointment';
import Loading from '../../src/components/common/Loading';

const getNextAppointment = (appointments: Appointment[]): Appointment | undefined => {
  console.log('Getting next appointment from:', appointments);
  const now = new Date();
  return appointments
    .filter(app => {
      const startTime = app.startTime instanceof Timestamp ? app.startTime.toDate() : app.startTime;
      return startTime > now;
    })
    .sort((a, b) => {
      const aStartTime = a.startTime instanceof Timestamp ? a.startTime.toDate() : a.startTime;
      const bStartTime = b.startTime instanceof Timestamp ? b.startTime.toDate() : b.startTime;
      return aStartTime.getTime() - bStartTime.getTime();
    })[0];
};

export default function DashboardScreen() {
  const { user, setUser } = useGlobalAuthState();
  const router = useRouter();
  const { appointments, loading, error } = useAppointments();
  const [nextAppointment, setNextAppointment] = useState<Appointment | undefined>(undefined);

  useEffect(() => {
    console.log('Appointments loaded:', appointments);
    console.log('Loading state:', loading);
    console.log('Error state:', error);
    if (!loading && appointments.length > 0) {
      const next = getNextAppointment(appointments);
      console.log('Next appointment:', next);
      setNextAppointment(next);
    } else {
      setNextAppointment(undefined);
    }
  }, [appointments, loading, error]);


  if (!user) {
    console.log('No user found');
    return null;
  }

  const handleSignOut = () => {
    setUser(null);
    router.replace('/login');
  };

  const navigateTo = (screen: string) => {
    router.push(screen);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.welcomeText}>Bem-vindo,</Text>
          <Text style={styles.nameText}>{user.firstName}!</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Próxima Consulta</Text>
        {loading ? (
          <Loading />
        ) : error ? (
          <Text style={styles.errorText}>Erro ao carregar consultas: {error}</Text>
        ) : nextAppointment ? (
          <>
            <Text style={styles.appointmentText}>{nextAppointment.therapistName}</Text>
            <Text style={styles.appointmentDate}>
              {formatarDataHora(nextAppointment.startTime instanceof Timestamp ? nextAppointment.startTime.toDate() : nextAppointment.startTime)}
            </Text>
            <TouchableOpacity 
              style={styles.joinButton}
              onPress={() => navigateTo('/(app)/(patient)/mock-video-call')}
            >
              <Feather name="video" size={20} color={cores.textoBranco} />
              <Text style={styles.joinButtonText}>Entrar na Chamada</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text>Nenhuma consulta agendada</Text>
        )}
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigateTo('/(app)/(patient)/emergency-resources')}
        >
          <Feather name="alert-circle" size={24} color={cores.primaria} />
          <Text style={styles.actionText}>Recursos de Emergência</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigateTo('/(app)/(patient)/resource-library')}
        >
          <Feather name="book" size={24} color={cores.primaria} />
          <Text style={styles.actionText}>Biblioteca</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigateTo('/(app)/(patient)/community')}
        >
          <Feather name="users" size={24} color={cores.primaria} />
          <Text style={styles.actionText}>Comunidade</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.hiddenButton}
          onPress={() => navigateTo('/(app)/(patient)/hidden-therapist-creation')}
        >
          <Text style={styles.hiddenButtonText}>Criar Terapeuta (Oculto)</Text>
        </TouchableOpacity>
      </View>

      <Button title="Sair" onPress={handleSignOut} style={styles.signOutButton} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: cores.primaria,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  welcomeText: {
    fontSize: 16,
    color: cores.textoBranco,
    opacity: 0.8,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.textoBranco,
  },
  card: {
    backgroundColor: cores.textoBranco,
    borderRadius: 10,
    padding: 20,
    margin: 20,
    shadowColor: cores.texto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 10,
  },
  appointmentText: {
    fontSize: 16,
    color: cores.texto,
  },
  appointmentDate: {
    fontSize: 14,
    color: cores.desativado,
    marginBottom: 15,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.primaria,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  joinButtonText: {
    color: cores.textoBranco,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  actionButton: {
    width: '48%',
    backgroundColor: cores.textoBranco,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: cores.texto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    marginTop: 5,
    color: cores.texto,
    fontSize: 12,
    textAlign: 'center',
  },
  hiddenButton: {
    width: '48%',
    backgroundColor: cores.textoBranco,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: cores.texto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    opacity: 0, // Tornando o botão invisível
  },
  hiddenButtonText: {
    color: cores.textoBranco,
    fontWeight: 'bold',
  },
  signOutButton: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  errorText: {
    color: cores.erro,
  },
});
