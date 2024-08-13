// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User as FirebaseUser, Auth } from 'firebase/auth';
import { User } from '../types/user';
import { auth, firestore, getCurrentUser } from '../services/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth as Auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getCurrentUser();
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(app)/(patient)/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth as Auth, email, password);
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, password);
      const newUser: User = {
        id: userCredential.user.uid,
        email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        userType: userData.userType || 'patient',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await setDoc(doc(firestore, 'users', newUser.id), newUser);
      setUser(newUser);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
    } catch (err: any) {
      setError(err.message);
      throw err; // Re-throw the error so it can be caught in the signup screen
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth as Auth);
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};