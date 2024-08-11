import { auth, firestore } from './firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { User, Patient, Therapist } from '../types/user';

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

export const entrar = async (email: string, senha: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    return userCredential.user;
  } catch (error) {
    console.error('Erro ao entrar:', error);
    throw new Error('Falha ao entrar. Verifique seu email e senha.');
  }
};

export const entrarComGoogle = async (): Promise<FirebaseUser> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Erro ao entrar com Google:', error);
    throw new Error('Falha ao entrar com Google. Por favor, tente novamente.');
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
