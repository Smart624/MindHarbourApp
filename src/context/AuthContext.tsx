import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '../types/user';
import { firebaseAuth, firebaseFirestore } from '../services/firebaseConfig';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(handleAuthStateChanged);
    return unsubscribe;
  }, []);

  const handleAuthStateChanged = async (firebaseUser: FirebaseAuthTypes.User | null) => {
    setLoading(true);
    try {
      if (firebaseUser) {
        const userData = await getUser(firebaseUser.uid);
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (userId: string): Promise<User | null> => {
    const userDoc = await firebaseFirestore.collection('users').doc(userId).get();
    if (userDoc.exists) {
      return userDoc.data() as User;
    }
    return null;
  };

  const createUser = async (user: User): Promise<void> => {
    await firebaseFirestore.collection('users').doc(user.id).set(user);
  };

  const handleAuthError = (error: FirebaseAuthTypes.NativeFirebaseAuthError): string => {
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'E-mail ou senha incorretos.';
      case 'auth/email-already-in-use':
        return 'Este e-mail já está em uso.';
      case 'auth/weak-password':
        return 'A senha é muito fraca.';
      default:
        return 'Ocorreu um erro. Por favor, tente novamente.';
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      await firebaseAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      const errorMessage = handleAuthError(error as FirebaseAuthTypes.NativeFirebaseAuthError);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>): Promise<void> => {
    setLoading(true);
    try {
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      const newUser: User = {
        id: userCredential.user.uid,
        email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        userType: userData.userType || 'patient',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await createUser(newUser);
      setUser(newUser);
    } catch (error) {
      const errorMessage = handleAuthError(error as FirebaseAuthTypes.NativeFirebaseAuthError);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await firebaseAuth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Falha ao sair. Por favor, tente novamente.');
      throw new Error('Falha ao sair. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => {
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

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};