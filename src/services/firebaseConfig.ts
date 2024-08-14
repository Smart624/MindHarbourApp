import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userString = await AsyncStorage.getItem('user');
    return userString ? JSON.parse(userString) as User : null;
  } catch (error) {
    console.error('Error getting current user from AsyncStorage:', error);
    return null;
  }
};