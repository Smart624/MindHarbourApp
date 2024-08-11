import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import cores from '../constants/colors';

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={cores.primaria} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cores.fundo,
  },
});

export default LoadingScreen;