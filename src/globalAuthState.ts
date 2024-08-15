import { useState } from 'react';
import { User } from './types/user';

let globalAuthState: User | null = null;
let setGlobalAuthState: (user: User | null) => void = () => {};

export const useGlobalAuthState = () => {
  const [authState, setAuthState] = useState<User | null>(globalAuthState);

  setGlobalAuthState = (user: User | null) => {
    globalAuthState = user;
    setAuthState(user);
  };

  return { user: authState, setUser: setGlobalAuthState };
};