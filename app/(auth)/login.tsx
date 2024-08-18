import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../../src/components/common/Input';
import Button from '../../src/components/common/Button';
import { entrar, getAuthErrorMessage } from '../../src/services/auth';
import cores from '../../src/constants/colors';
import { useGlobalAuthState } from '../../src/globalAuthState';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { setUser } = useGlobalAuthState();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const user = await entrar(email, senha);
      setUser(user);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Erro de login:', error);
      const errorMessage = error.code ? getAuthErrorMessage(error.code) : error.message;
      Alert.alert('Erro', errorMessage || 'Falha ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao MindHarbor</Text>
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Seu email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        placeholder="Sua senha"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button 
          title="Entrar" 
          onPress={handleLogin} 
          loading={loading} 
          style={styles.loginButton}
        />
        <Button 
          title="Criar Conta" 
          onPress={() => router.push('/signup')} 
          variant="outline"
          style={styles.signupButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: cores.fundo,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
  loginButton: {
    marginBottom: 10,
  },
  signupButton: {
    marginTop: 10,
  },
});
