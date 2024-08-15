import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../../src/components/common/Input';
import Button from '../../src/components/common/Button';
import { cadastrar } from '../../src/services/auth';
import cores from '../../src/constants/colors';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSignup = async () => {
    setLoading(true);
    try {
      await cadastrar(email, password, {
        firstName,
        lastName,
        userType: 'patient', // Assuming default signup is for patients
      });
      Alert.alert(
        "Signup Successful",
        "Your account has been created. Please log in.",
        [{ text: "OK", onPress: () => router.replace('/login') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your MindHarbor Account</Text>
      <Input
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Your first name"
      />
      <Input
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
        placeholder="Your last name"
      />
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Your password"
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignup} loading={loading} />
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
});