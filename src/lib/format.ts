const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
});

export function formatDayLabel(date: string, position: number): string {
  if (position === 0) {
    return 'Hoje';
  }

  if (position === 1) {
    return 'Amanhã';
  }

  const parsedDate = new Date(`${date}T00:00:00Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return weekdayFormatter.format(parsedDate).replace('.', '');
}
