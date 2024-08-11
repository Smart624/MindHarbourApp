import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import {
  PatientDashboardScreen,
  AppointmentBookingScreen,
  ChatScreen,
  TherapistDirectoryScreen
} from '../screens/patient/PlaceholderScreens';
import cores from '../constants/colors';

export type MainTabParamList = {
  Dashboard: undefined;
  Agendar: undefined;
  Chat: undefined;
  Terapeutas: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Feather.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Agendar') {
            iconName = 'calendar';
          } else if (route.name === 'Chat') {
            iconName = 'message-circle';
          } else if (route.name === 'Terapeutas') {
            iconName = 'users';
          } else {
            iconName = 'help-circle';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.desativado,
        headerStyle: {
          backgroundColor: cores.primaria,
        },
        headerTintColor: cores.textoBranco,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={PatientDashboardScreen} 
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="Agendar" 
        component={AppointmentBookingScreen} 
        options={{ title: 'Agendar' }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ title: 'Chat' }}
      />
      <Tab.Screen 
        name="Terapeutas" 
        component={TherapistDirectoryScreen} 
        options={{ title: 'Terapeutas' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;