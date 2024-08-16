import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import cores from '../../../src/constants/colors';

export default function MockVideoCallScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color={cores.textoBranco} />
      </TouchableOpacity>
      <View style={styles.remoteVideo}>
        <Text style={styles.remoteText}>Vídeo do Terapeuta</Text>
      </View>
      <View style={styles.localVideo}>
        <Text style={styles.localText}>Seu Vídeo</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton}>
          <Feather name="mic" size={24} color={cores.textoBranco} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Feather name="video" size={24} color={cores.textoBranco} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, styles.endCallButton]}>
          <Feather name="phone-off" size={24} color={cores.textoBranco} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteText: {
    color: cores.textoBranco,
    fontSize: 18,
  },
  localVideo: {
    position: 'absolute',
    right: 20,
    top: 40,
    width: 100,
    height: 150,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  localText: {
    color: cores.textoBranco,
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  controlButton: {
    backgroundColor: cores.primaria,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  endCallButton: {
    backgroundColor: cores.erro,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
});