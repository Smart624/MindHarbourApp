import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import cores from '../../src/constants/colors';

export default function AuthLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: cores.primaria,
        },
        headerTintColor: cores.textoBranco,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen 
        name="signup" 
        options={{ 
          title: 'Criar Conta',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Feather name="arrow-left" size={24} color={cores.textoBranco} />
            </TouchableOpacity>
          ),
        }} 
      />
    </Stack>
  );
}