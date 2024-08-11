import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatarData = (data: Date | string): string => {
  const dataParseada = typeof data === 'string' ? parseISO(data) : data;
  return format(dataParseada, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
};

export const formatarHora = (data: Date | string): string => {
  const dataParseada = typeof data === 'string' ? parseISO(data) : data;
  return format(dataParseada, "HH:mm", { locale: ptBR });
};

export const formatarDataHora = (data: Date | string): string => {
  const dataParseada = typeof data === 'string' ? parseISO(data) : data;
  return format(dataParseada, "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
};

export const diaDaSemana = (data: Date | string): string => {
  const dataParseada = typeof data === 'string' ? parseISO(data) : data;
  return format(dataParseada, 'EEEE', { locale: ptBR });
};