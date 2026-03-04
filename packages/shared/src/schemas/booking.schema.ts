import { z } from 'zod';
import { BookingStatus } from '../domain/value-objects/booking-status';

/** Schema para crear una nueva reserva (usuario público) */
export const createBookingSchema = z.object({
  scheduleId: z.string().uuid('ID de agenda inválido'),
  guestName: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .transform((v) => v.trim()),
  guestEmail: z
    .string()
    .email('Correo electrónico inválido')
    .max(254, 'El correo es demasiado largo')
    .transform((v) => v.trim().toLowerCase()),
  startTime: z.string().datetime('Formato de hora de inicio inválido'),
  endTime: z.string().datetime('Formato de hora de fin inválido'),
  notes: z
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional()
    .nullable(),
});

/** Schema para actualizar una reserva (solo owner) */
export const updateBookingSchema = z.object({
  id: z.string().uuid('ID de reserva inválido'),
  guestName: z
    .string()
    .min(1)
    .max(100)
    .transform((v) => v.trim())
    .optional(),
  guestEmail: z
    .string()
    .email()
    .max(254)
    .transform((v) => v.trim().toLowerCase())
    .optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  status: z.nativeEnum(BookingStatus).optional(),
  notes: z.string().max(500).optional().nullable(),
});

/** Schema para respuestas de la API de reservas */
export const bookingResponseSchema = z.object({
  id: z.string().uuid(),
  scheduleId: z.string().uuid(),
  guestName: z.string(),
  guestEmail: z.string().email(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  status: z.nativeEnum(BookingStatus),
  calendarEventId: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Tipos TypeScript inferidos desde los schemas de Zod
export type CreateBookingDTO = z.infer<typeof createBookingSchema>;
export type UpdateBookingDTO = z.infer<typeof updateBookingSchema>;
export type BookingResponseDTO = z.infer<typeof bookingResponseSchema>;
