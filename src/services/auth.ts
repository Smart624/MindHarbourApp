import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '../types/user';
import { auth, firestore } from './firebaseConfig';

export const entrar = async (email: string, senha: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const userDoc = await getDoc(doc(firestore, 'users', userCredential.user.uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    console.error('Erro ao entrar:', error);
    throw new Error('Falha ao entrar. Verifique seu email e senha.');
  }
};