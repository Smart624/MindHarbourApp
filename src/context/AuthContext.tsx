import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '../types/user';
import { auth } from '../services/firebaseConfig';
import { 
  onAuthStateChanged, 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  AuthError
} from 'firebase/auth';
import { getUser, createUser } from '../services/firestore';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChanged);
    return unsubscribe;
  }, []);

  const handleAuthStateChanged = async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const userData = await getUser(firebaseUser.uid);
      setUser(userData);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const handleAuthError = (error: AuthError): string => {
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

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(handleAuthError(error as AuthError));
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser: User = {
        id: userCredential.user.uid,
        email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        userType: 'patient', // Default to patient for now
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await createUser(newUser);
      setUser(newUser);
    } catch (error) {
      throw new Error(handleAuthError(error as AuthError));
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Falha ao sair. Por favor, tente novamente.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);