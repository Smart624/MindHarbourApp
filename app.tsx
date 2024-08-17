import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useGlobalAuthState } from './src/globalAuthState';
import Loading from './src/components/common/Loading';

export default function App() {
  const [loaded, error] = useFonts({
    'SpaceMono-Regular': require('./assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { user, setUser } = useGlobalAuthState();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // This is where you would typically check for a stored user session
    // and set the user if found
    console.log('Checking for stored user session...');
    // For example:
    // const storedUser = await AsyncStorage.getItem('user');
    // if (storedUser) {
    //   setUser(JSON.parse(storedUser));
    // }
  }, []);

  if (!loaded) {
    return <Loading />;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user } = useGlobalAuthState();

  console.log('Current user in RootLayoutNav:', user);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}