import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../../src/components/common/Input';
import Button from '../../src/components/common/Button';
import { cadastrar, getAuthErrorMessage } from '../../src/services/auth';
import cores from '../../src/constants/colors';
import { useGlobalAuthState } from '../../src/globalAuthState';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { setUser } = useGlobalAuthState();

  const handleSignup = async () => {
    if (!email || !senha || !confirmarSenha || !nome || !sobrenome) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const user = await cadastrar(email, senha, {
        firstName: nome,
        lastName: sobrenome,
        userType: 'patient',
      });
      setUser(user);
      Alert.alert(
        "Cadastro Realizado",
        "Sua conta foi criada com sucesso.",
        [{ text: "OK", onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error: any) {
      console.error('Erro de cadastro:', error);
      const errorMessage = error.code ? getAuthErrorMessage(error.code) : error.message;
      Alert.alert('Erro', errorMessage || 'Falha ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crie sua Conta MindHarbor</Text>
      <Input
        label="Nome"
        value={nome}
        onChangeText={setNome}
        placeholder="Seu nome"
      />
      <Input
        label="Sobrenome"
        value={sobrenome}
        onChangeText={setSobrenome}
        placeholder="Seu sobrenome"
      />
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
      <Input
        label="Confirmar Senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        placeholder="Confirme sua senha"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Cadastrar" onPress={handleSignup} loading={loading} style={styles.signupButton} />
        <Button 
          title="Já tem uma conta? Entre" 
          onPress={() => router.push('/login')} 
          variant="outline"
          style={styles.loginButton}
        />
      </View>
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
  buttonContainer: {
    marginTop: 20,
  },
  signupButton: {
    marginBottom: 15,
  },
  loginButton: {
    marginTop: 5,
  },
});