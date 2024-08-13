// src/services/firebaseConfig.ts



import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, Auth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';

const firebaseConfig = {
  apiKey: "AIzaSyAng0af08bQTYY7VXzHUhRhzV211omIPWg",
  authDomain: "mind-harbour-67fbb.firebaseapp.com",
  projectId: "mind-harbour-67fbb",
  storageBucket: "mind-harbour-67fbb.appspot.com",
  messagingSenderId: "257356903044",
  appId: "1:257356903044:web:fd780d16b76efa0f0848d1",
  measurementId: "G-806Q5R0P6E"
};

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  app = getApps()[0];
  auth = getAuth(app);
}

firestore = getFirestore(app);

// Function to get the current user from AsyncStorage
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userString = await AsyncStorage.getItem('user');
    return userString ? JSON.parse(userString) as User : null;
  } catch (error) {
    console.error('Error getting current user from AsyncStorage:', error);
    return null;
  }
};

export { auth, firestore };