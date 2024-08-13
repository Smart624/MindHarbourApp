import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '../types/user';
import { auth, firestore, getCurrentUser } from '../services/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore';

console.log('AuthContext.tsx is being executed');

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
  console.log('AuthProvider is rendering');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('AuthProvider useEffect is running');
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      console.log('Auth state changed. Firebase user:', firebaseUser);
      if (firebaseUser) {
        const userData = await getCurrentUser();
        console.log('Current user data:', userData);
        setUser(userData);
      } else {
        console.log('No user logged in.');
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('Unsubscribing from auth state changes.');
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('signIn function called');
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
    console.log('signUp function called');
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('signOut function called');
    try {
      await firebaseSignOut(auth);
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const clearError = () => {
    console.log('clearError function called');
    setError(null);
  };

  const contextValue: AuthContextData = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
  };

  console.log('AuthProvider contextValue:', contextValue);

  useEffect(() => {
    console.log('AuthProvider children are being rendered');
  }, []);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  console.log('useAuth hook called');
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log('useAuth returning context:', context);
  return context;
};

console.log('AuthContext.tsx fully loaded');