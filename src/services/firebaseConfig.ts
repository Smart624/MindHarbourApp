import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
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

try {
  if (getApps().length === 0) {
    console.log('Initializing Firebase app...');
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully.');
  } else {
    console.log('Firebase app already initialized. Using existing app.');
    app = getApps()[0];
  }

  console.log('Initializing Firebase Auth...');
  auth = getAuth(app);
  console.log('Firebase Auth initialized successfully.');

  console.log('Initializing Firestore...');
  firestore = getFirestore(app);
  console.log('Firestore initialized successfully.');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userString = await AsyncStorage.getItem('user');
    console.log('Current user from AsyncStorage:', userString);
    return userString ? JSON.parse(userString) as User : null;
  } catch (error) {
    console.error('Error getting current user from AsyncStorage:', error);
    return null;
  }
};

export { auth, firestore };