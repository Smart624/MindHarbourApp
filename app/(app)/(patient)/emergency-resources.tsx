import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import cores from '../../../src/constants/colors';

const emergencyResources = [
  { name: 'Centro de Valorização da Vida', number: '188' },
  { name: 'SAMU', number: '192' },
  { name: 'Polícia', number: '190' },
  { name: 'Bombeiros', number: '193' },
];

export default function EmergencyResourcesScreen() {
  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Recursos de Emergência</Text>
      <Text style={styles.subtitle}>Acesso rápido a linhas de ajuda em crises</Text>

      {emergencyResources.map((resource, index) => (
        <TouchableOpacity
          key={index}
          style={styles.resourceItem}
          onPress={() => handleCall(resource.number)}
        >
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceName}>{resource.name}</Text>
            <Text style={styles.resourceNumber}>{resource.number}</Text>
          </View>
          <Feather name="phone" size={24} color={cores.primaria} />
        </TouchableOpacity>
      ))}

      <Text style={styles.disclaimer}>
        Em caso de emergência imediata, não hesite em ligar para os serviços de emergência locais.
      </Text>
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
    fontSize: 16,
    color: cores.desativado,
    marginBottom: 20,
  },
  resourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: cores.textoBranco,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: cores.texto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
  },
  resourceNumber: {
    fontSize: 16,
    color: cores.desativado,
  },
  disclaimer: {
    fontSize: 14,
    color: cores.texto,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});