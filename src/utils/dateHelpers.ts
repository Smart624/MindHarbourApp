import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';

export const formatarData = (data: Date | string): string => {
  const dataParseada = typeof data === 'string' ? parseISO(data) : data;
  return format(dataParseada, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
};

export const formatarHora = (data: Date | string): string => {
  const dataParseada = typeof data === 'string' ? parseISO(data) : data;
  return format(dataParseada, "HH:mm", { locale: ptBR });
};

export const ensureDate = (date: Date | Timestamp): Date => {
  return date instanceof Timestamp ? date.toDate() : date;
};

export const formatarDataHora = (data: Date | Timestamp): string => {
  const dataParseada = ensureDate(data);
  return format(dataParseada, "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
};

export const diaDaSemana = (data: Date | string): string => {
  const dataParseada = typeof data === 'string' ? parseISO(data) : data;
  return format(dataParseada, 'EEEE', { locale: ptBR });
};