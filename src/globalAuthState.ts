import { useState, useEffect } from 'react';
import { User } from './types/user';

let globalAuthState: User | null = null;
let setGlobalAuthState: (user: User | null) => void = () => {};

export const useGlobalAuthState = () => {
  const [authState, setAuthState] = useState<User | null>(globalAuthState);

  useEffect(() => {
    console.log('Current authState:', authState);
  }, [authState]);

  setGlobalAuthState = (user: User | null) => {
    console.log('Setting global auth state:', user);
    globalAuthState = user;
    setAuthState(user);
  };

  return { user: authState, setUser: setGlobalAuthState };
};