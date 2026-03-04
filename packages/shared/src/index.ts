// @calenbook/shared - Tipos, schemas y utilidades compartidas
// Este paquete es consumido por apps/web y apps/supabase

// Enums de dominio
export { BookingStatus } from './domain/value-objects/booking-status';
export { DayOfWeek } from './domain/value-objects/day-of-week';

// Schemas de Zod
export {
  createBookingSchema,
  updateBookingSchema,
  bookingResponseSchema,
  type CreateBookingDTO,
  type UpdateBookingDTO,
  type BookingResponseDTO,
} from './schemas/booking.schema';

export {
  weeklyScheduleSchema,
  updateScheduleSchema,
  createScheduleSchema,
  DAYS_OF_WEEK,
  type TimeSlotDTO,
  type WeeklyScheduleDTO,
  type UpdateScheduleDTO,
  type CreateScheduleDTO,
} from './schemas/schedule.schema';

// Tipos
export type {
  AvailableSlotDTO,
  DayAvailabilityDTO,
} from './types/schedule.types';

// Utilidades
export { formatTime, parseTime, isValidTimezone } from './utils/date.utils';
