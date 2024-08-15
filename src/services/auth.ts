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
      throw new Error('User data not found');
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