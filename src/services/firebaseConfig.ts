// src/services/firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';  // Import your custom User type

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
const auth = getAuth(app);
const firestore = getFirestore(app);

// Set persistence to local
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistence set to local');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

// Listen for auth state changes and store user info in AsyncStorage
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    const userData: User = {
      id: user.uid,
      email: user.email || '',
      firstName: '',  // You might want to fetch this from Firestore
      lastName: '',   // You might want to fetch this from Firestore
      userType: 'patient',  // Default value, adjust as needed
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    AsyncStorage.setItem('user', JSON.stringify(userData));
  } else {
    // User is signed out
    AsyncStorage.removeItem('user');
  }
});

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