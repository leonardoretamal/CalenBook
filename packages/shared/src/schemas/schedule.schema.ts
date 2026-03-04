import { z } from 'zod';

/** Schema para un bloque horario dentro de un día */
const timeSlotSchema = z.object({
  start: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      'El horario debe tener formato HH:MM'
    ),
  end: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      'El horario debe tener formato HH:MM'
    ),
});

/**
 * Schema para el horario semanal (JSONB en la base de datos)
 * Las claves son DayOfWeek (0-6), los valores son arrays de bloques horarios
 */
export const weeklyScheduleSchema = z.record(
  z.string().regex(/^[0-6]$/, 'El día debe ser entre 0 y 6'),
  z.array(timeSlotSchema)
);

/** Schema para actualizar una agenda (solo owner) */
export const updateScheduleSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de la agenda es obligatorio')
    .max(100)
    .transform((v) => v.trim())
    .optional(),
  slotDurationMinutes: z.number().int().min(5).max(480).optional(),
  bufferMinutes: z.number().int().min(0).max(120).optional(),
  maxAdvanceDays: z.number().int().min(1).max(365).optional(),
  weeklySchedule: weeklyScheduleSchema.optional(),
  isActive: z.boolean().optional(),
});

/** Schema para crear una nueva agenda (solo owner) */
export const createScheduleSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de la agenda es obligatorio')
    .max(100)
    .transform((v) => v.trim()),
  slot_duration_minutes: z.number().int().min(5).max(480),
  weekly_schedule: weeklyScheduleSchema,
  is_active: z.boolean(),
});

// Constantes útiles
export const DAYS_OF_WEEK = [0, 1, 2, 3, 4, 5, 6] as const;

// Tipos TypeScript inferidos desde los schemas de Zod
export type TimeSlotDTO = z.infer<typeof timeSlotSchema>;
export type WeeklyScheduleDTO = z.infer<typeof weeklyScheduleSchema>;
export type UpdateScheduleDTO = z.infer<typeof updateScheduleSchema>;
export type CreateScheduleDTO = z.infer<typeof createScheduleSchema>;
