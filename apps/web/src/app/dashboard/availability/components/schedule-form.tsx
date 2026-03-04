'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createScheduleSchema,
  type CreateScheduleDTO,
  DAYS_OF_WEEK,
} from '@calenbook/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { createSchedule, updateSchedule } from '../actions';

const dayNames: Record<number, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

interface ScheduleFormProps {
  scheduleToEdit?: {
    id: string;
    name: string;
    is_active: boolean;
    slot_duration_minutes: number;
    weekly_schedule: any;
  } | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ScheduleForm({
  scheduleToEdit,
  onSuccess,
  onCancel,
}: ScheduleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // default to Monday-Friday 09:00 - 18:00
  const defaultWeekly: Record<string, { start: string; end: string }[]> = {};
  [1, 2, 3, 4, 5].forEach((day) => {
    defaultWeekly[day.toString()] = [{ start: '09:00', end: '18:00' }];
  });

  const form = useForm<CreateScheduleDTO>({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: scheduleToEdit
      ? {
          name: scheduleToEdit.name,
          is_active: scheduleToEdit.is_active,
          slot_duration_minutes: scheduleToEdit.slot_duration_minutes,
          weekly_schedule: scheduleToEdit.weekly_schedule,
        }
      : {
          name: 'Mi Agenda Principal',
          is_active: true,
          slot_duration_minutes: 60,
          weekly_schedule: defaultWeekly,
        },
  });

  const {
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = form;
  const currentWeekly = watch('weekly_schedule');

  const toggleDay = (day: number) => {
    const current = { ...getValues('weekly_schedule') };
    const dayStr = day.toString();
    if (current[dayStr]) {
      delete current[dayStr];
    } else {
      current[dayStr] = [{ start: '09:00', end: '18:00' }];
    }
    setValue('weekly_schedule', current, { shouldValidate: true });
  };

  const addTimeSlot = (day: number) => {
    const current = { ...getValues('weekly_schedule') };
    const dayStr = day.toString();
    if (current[dayStr]) {
      current[dayStr] = [...current[dayStr], { start: '12:00', end: '13:00' }];
      setValue('weekly_schedule', current, { shouldValidate: true });
    }
  };

  const removeTimeSlot = (day: number, index: number) => {
    const current = { ...getValues('weekly_schedule') };
    const dayStr = day.toString();
    if (current[dayStr]) {
      current[dayStr] = current[dayStr].filter((_, i) => i !== index);
      if (current[dayStr].length === 0) {
        delete current[dayStr];
      }
      setValue('weekly_schedule', current, { shouldValidate: true });
    }
  };

  const updateTimeSlot = (
    day: number,
    index: number,
    field: 'start' | 'end',
    value: string
  ) => {
    const current = { ...getValues('weekly_schedule') };
    const dayStr = day.toString();
    if (current[dayStr] && current[dayStr][index]) {
      current[dayStr][index][field] = value;
      setValue('weekly_schedule', current, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: CreateScheduleDTO) => {
    if (
      !data.weekly_schedule ||
      Object.keys(data.weekly_schedule).length === 0
    ) {
      setError('weekly_schedule', {
        type: 'manual',
        message: 'Debes configurar al menos un día disponible en la semana.',
      });
      return;
    }
    clearErrors('weekly_schedule');

    setIsSubmitting(true);
    try {
      const result = scheduleToEdit
        ? await updateSchedule(scheduleToEdit.id, data)
        : await createSchedule(data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Agenda creada exitosamente');
        onSuccess();
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border/50">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Agenda</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Ej: Agenda Principal"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slot_duration_minutes">
              Duración por turno (minutos)
            </Label>
            <Input
              id="slot_duration_minutes"
              type="number"
              {...form.register('slot_duration_minutes', {
                valueAsNumber: true,
              })}
              disabled={isSubmitting}
            />
            {errors.slot_duration_minutes && (
              <p className="text-xs text-destructive">
                {errors.slot_duration_minutes.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="is_active"
            checked={watch('is_active')}
            onCheckedChange={(checked) => setValue('is_active', !!checked)}
            disabled={isSubmitting}
          />
          <Label htmlFor="is_active">Activar esta agenda inmediatamente</Label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Horarios Semanales</h3>
        {errors.weekly_schedule && (
          <p className="text-sm text-destructive">
            {errors.weekly_schedule.message as unknown as string}
          </p>
        )}

        {DAYS_OF_WEEK.map((day) => {
          const dayStr = day.toString();
          const isSelected = !!currentWeekly[dayStr];
          const slots = currentWeekly[dayStr] || [];

          return (
            <div
              key={day}
              className="flex flex-col sm:flex-row gap-4 items-start sm:items-center py-3 border-b last:border-0 border-border/50"
            >
              <div className="flex items-center space-x-2 min-w-[120px]">
                <Checkbox
                  id={`day-${day}`}
                  checked={isSelected}
                  onCheckedChange={() => toggleDay(day)}
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor={`day-${day}`}
                  className={isSelected ? 'font-medium text-primary' : ''}
                >
                  {dayNames[day]}
                </Label>
              </div>

              {isSelected ? (
                <div className="flex-1 space-y-2 w-full">
                  {slots.map((slot, index) => (
                    <div
                      key={`${day}-${index}`}
                      className="flex items-center gap-2"
                    >
                      <Input
                        type="time"
                        value={slot.start}
                        onChange={(e) =>
                          updateTimeSlot(day, index, 'start', e.target.value)
                        }
                        className="w-[120px]"
                        disabled={isSubmitting}
                      />
                      <span>-</span>
                      <Input
                        type="time"
                        value={slot.end}
                        onChange={(e) =>
                          updateTimeSlot(day, index, 'end', e.target.value)
                        }
                        className="w-[120px]"
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                        onClick={() => removeTimeSlot(day, index)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-primary mt-1"
                    onClick={() => addTimeSlot(day)}
                    disabled={isSubmitting}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add break/split
                  </Button>
                </div>
              ) : (
                <div className="flex-1 text-muted-foreground text-sm italic">
                  No disponible
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
          {scheduleToEdit ? 'Actualizar Agenda' : 'Guardar Agenda'}
        </Button>
      </div>
    </form>
  );
}
