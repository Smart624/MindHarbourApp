
// src/components/common/Calendar.tsx

import React from 'react';
import { Calendar as RNCalendar, LocaleConfig } from 'react-native-calendars';
import cores from '../../constants/colors';

// Configure Portuguese localization
LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
    'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
};

LocaleConfig.defaultLocale = 'pt-br';

interface CalendarProps {
  onDayPress: (day: any) => void;
  markedDates?: { [date: string]: any };
  minDate?: string;
  maxDate?: string;
}

const Calendar: React.FC<CalendarProps> = ({ onDayPress, markedDates = {}, minDate, maxDate }) => {
  // Get today's date in the format YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // Add today's date to the markedDates with a custom style
  const todayMarking = {
    [today]: {
      selected: true,
      marked: true,
      selectedColor: cores.primaria,
      dotColor: cores.secundaria,
      textColor: cores.textoBranco
    }
  };

  return (
    <RNCalendar
      onDayPress={onDayPress}
      markedDates={{ ...markedDates, ...todayMarking }}
      minDate={minDate}
      maxDate={maxDate}
      theme={{
        backgroundColor: cores.fundo,
        calendarBackground: cores.fundo,
        textSectionTitleColor: cores.texto,
        selectedDayBackgroundColor: cores.primaria,
        selectedDayTextColor: cores.textoBranco,
        todayTextColor: cores.primaria,
        dayTextColor: cores.texto,
        textDisabledColor: cores.desativado,
        dotColor: cores.secundaria,
        selectedDotColor: cores.textoBranco,
        arrowColor: cores.primaria,
        monthTextColor: cores.texto,
        textDayFontFamily: 'System',
        textMonthFontFamily: 'System',
        textDayHeaderFontFamily: 'System',
        textDayFontWeight: '300',
        textMonthFontWeight: 'bold',
        textDayHeaderFontWeight: '300',
        textDayFontSize: 16,
        textMonthFontSize: 18,
        textDayHeaderFontSize: 14
      }}
    />
  );
};

export default Calendar;
