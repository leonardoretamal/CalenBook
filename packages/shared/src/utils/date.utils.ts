/**
 * Formatea horas y minutos a string "HH:MM"
 */
export function formatTime(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Parsea un string "HH:MM" a { hours, minutes }
 */
export function parseTime(time: string): { hours: number; minutes: number } {
  const [hours, minutes] = time.split(':').map(Number);
  if (
    hours === undefined ||
    minutes === undefined ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new Error(`Formato de hora inválido: ${time}. Se esperaba HH:MM`);
  }
  return { hours, minutes };
}

/**
 * Valida un string de timezone IANA (ej: 'America/Santiago')
 */
export function isValidTimezone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
