/**
 * Enum de días de la semana compatible con Date.getDay() de JavaScript
 * Domingo = 0, Lunes = 1, ..., Sábado = 6
 */
export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

/** Etiquetas en español para cada día */
export const DAY_LABELS: Record<DayOfWeek, string> = {
  [DayOfWeek.SUNDAY]: 'Domingo',
  [DayOfWeek.MONDAY]: 'Lunes',
  [DayOfWeek.TUESDAY]: 'Martes',
  [DayOfWeek.WEDNESDAY]: 'Miércoles',
  [DayOfWeek.THURSDAY]: 'Jueves',
  [DayOfWeek.FRIDAY]: 'Viernes',
  [DayOfWeek.SATURDAY]: 'Sábado',
};
