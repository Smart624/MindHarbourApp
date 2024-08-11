import { isValid, parse } from 'date-fns';

export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarSenha = (senha: string): boolean => {
  // Senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um número
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return regex.test(senha);
};

export const validarNome = (nome: string): boolean => {
  return nome.length >= 2;
};

export const validarDataNascimento = (dataNascimento: string): boolean => {
  const data = parse(dataNascimento, 'dd/MM/yyyy', new Date());
  return isValid(data) && data < new Date();
};

export const validarCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  const soma = (nums: number[]): number => nums.reduce((a, b) => a + b);
  const resto = (num: number): number => (num * 10) % 11 % 10;
  const digitos = cpf.split('').map(Number);
  const d1 = resto(soma(digitos.slice(0, 9).map((d, i) => d * (10 - i))));
  const d2 = resto(soma(digitos.slice(0, 10).map((d, i) => d * (11 - i))));
  return digitos[9] === d1 && digitos[10] === d2;
};