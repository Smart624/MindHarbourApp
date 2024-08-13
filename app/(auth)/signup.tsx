import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import Input from '../../src/components/common/Input';
import Button from '../../src/components/common/Button';
import cores from '../../src/constants/colors';
import { validarEmail, validarNome, validarSenha } from '../../src/utils/validation';

console.log('Signup page is being executed');

export default function SignupScreen() {
  console.log('SignupScreen component rendering');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  console.log('Calling useAuth in SignupScreen');
  const auth = useAuth();
  console.log('Auth from useAuth:', auth);
  const { signUp, error, clearError } = auth;
  
  const router = useRouter();

  console.log('SignupScreen initial render complete');

  useEffect(() => {
    console.log('SignupScreen useEffect - error:', error);
    if (error) {
      Alert.alert('Erro', error);
      clearError();
    }
  }, [error, clearError]);

  const handleSignup = async () => {
    console.log('Handle Signup called');
    console.log('Input values:', { email, password, firstName, lastName });

    if (!validarNome(firstName) || !validarNome(lastName)) {
      console.log('Invalid name');
      Alert.alert('Erro', 'Por favor, insira um nome e sobrenome válidos.');
      return;
    }
    if (!validarEmail(email)) {
      console.log('Invalid email');
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }
    if (!validarSenha(password)) {
      console.log('Invalid password');
      Alert.alert('Erro', 'A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um número.');
      return;
    }

    setLoading(true);
    try {
      console.log('Calling signUp function');
      if (typeof signUp === 'function') {
        await signUp(email, password, { firstName, lastName, userType: 'patient' });
        console.log('Signup successful');
        router.replace('/(app)/(patient)/dashboard');
      } else {
        console.error('signUp is not a function:', signUp);
        Alert.alert('Erro', 'Função de cadastro não disponível. Por favor, tente novamente mais tarde.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      Alert.alert('Erro', 'Falha no cadastro. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  console.log('SignupScreen render method executing');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crie sua conta no MindHarbor</Text>
      <Input
        label="Nome"
        value={firstName}
        onChangeText={(text) => {
          console.log('First name changed:', text);
          setFirstName(text);
        }}
        placeholder="Seu nome"
      />
      <Input
        label="Sobrenome"
        value={lastName}
        onChangeText={(text) => {
          console.log('Last name changed:', text);
          setLastName(text);
        }}
        placeholder="Seu sobrenome"
      />
      <Input
        label="E-mail"
        value={email}
        onChangeText={(text) => {
          console.log('Email changed:', text);
          setEmail(text);
        }}
        placeholder="Seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        label="Senha"
        value={password}
        onChangeText={(text) => {
          console.log('Password changed:', text.replace(/./g, '*'));
          setPassword(text);
        }}
        placeholder="Sua senha"
        secureTextEntry
      />
      <Button title="Cadastrar" onPress={handleSignup} loading={loading} />
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.loginText}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  loginText: {
    color: cores.primaria,
    textAlign: 'center',
    marginTop: 20,
  },
});

console.log('Signup page fully loaded');