import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../../src/components/common/Input';
import Button from '../../src/components/common/Button';
import cores from '../../src/constants/colors';
import { validarEmail, validarNome, validarSenha } from '../../src/utils/validation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../../src/services/firebaseConfig';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSignup = async () => {
    if (!validarNome(firstName) || !validarNome(lastName)) {
      Alert.alert('Erro', 'Por favor, insira um nome e sobrenome válidos.');
      return;
    }
    if (!validarEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }
    if (!validarSenha(password)) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um número.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        firstName,
        lastName,
        userType: 'patient',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(firestore, 'users', user.uid), userData);

      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => router.replace('/(app)/(tabs)') }
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crie sua conta no MindHarbor</Text>
      <Input
        label="Nome"
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Seu nome"
      />
      <Input
        label="Sobrenome"
        value={lastName}
        onChangeText={setLastName}
        placeholder="Seu sobrenome"
      />
      <Input
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="Seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        label="Senha"
        value={password}
        onChangeText={setPassword}
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