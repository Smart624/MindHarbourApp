// src/services/auth.ts

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User, Patient, Therapist } from '../types/user';
import { auth, firestore } from './firebaseConfig';

export const cadastrar = async (
  email: string, 
  senha: string, 
  dados: Omit<Patient | Therapist, 'id' | 'createdAt' | 'updatedAt' | 'email'>
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user: User = {
      id: userCredential.user.uid,
      email: email,
      ...dados,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await setDoc(doc(firestore, 'users', user.id), user);
    return user;
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    throw new Error('Falha ao criar conta. Por favor, tente novamente.');
  }
};

export const entrar = async (email: string, senha: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const userDoc = await getDoc(doc(firestore, 'users', userCredential.user.uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      throw new Error('Dados do usuário não encontrados');
    }
  } catch (error) {
    console.error('Erro ao entrar:', error);
    throw new Error('Falha ao entrar. Verifique seu email e senha.');
  }
};

export const sair = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Erro ao sair:', error);
    throw new Error('Falha ao sair. Por favor, tente novamente.');
  }
};

// Additional translations for error messages

export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Este email já está em uso. Por favor, use outro email ou faça login.';
    case 'auth/invalid-email':
      return 'O email fornecido é inválido. Por favor, verifique e tente novamente.';
    case 'auth/weak-password':
      return 'A senha é muito fraca. Por favor, use uma senha mais forte.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado. Verifique seu email ou crie uma nova conta.';
    case 'auth/wrong-password':
      return 'Senha incorreta. Por favor, tente novamente.';
    default:
      return 'Ocorreu um erro. Por favor, tente novamente mais tarde.';
  }
};