'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { createBooking } from '@/app/(public)/booking-actions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const manualBookingSchema = z.object({
  guestName: z.string().min(2, 'Nombre requerido'),
  guestEmail: z.string().email('Email inválido'),
  scheduleId: z.string().min(1, 'Selecciona una agenda'),
  date: z.string().min(1, 'Fecha requerida'),
  slot: z.string().min(1, 'Hora requerida'),
  notes: z.string().optional(),
});

type ManualBookingValues = z.infer<typeof manualBookingSchema>;

import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';

export function NewBookingModal({
  isOpen,
  onOpenChange,
  initialDate,
  initialSlot,
  initialScheduleId,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate?: string;
  initialSlot?: string;
  initialScheduleId?: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, setValue, reset } =
    useForm<ManualBookingValues>({
      resolver: zodResolver(manualBookingSchema),
      defaultValues: {
        date: initialDate || '',
        slot: initialSlot || '',
        scheduleId: initialScheduleId || '',
        notes: '',
      },
    });

  // Update specific fields when they change externally
  useEffect(() => {
    if (initialDate) setValue('date', initialDate);
    if (initialSlot) setValue('slot', initialSlot);
    if (initialScheduleId) setValue('scheduleId', initialScheduleId);
  }, [initialDate, initialSlot, initialScheduleId, setValue]);

  const onSubmit = async (data: ManualBookingValues) => {
    setIsSubmitting(true);
    try {
      const result = await createBooking({
        ...data,
        username: 'admin', // Placeholder
        isManual: true,
      });

      if (result.success) {
        toast.success(
          `Reserva creada para ${data.guestName} a las ${data.slot}`
        );
        onOpenChange(false);
        reset();
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al crear la reserva');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-32px)] md:max-w-md w-full p-4 md:p-6">
        <DialogHeader className="text-left">
          <DialogTitle>Nueva Reserva Manual</DialogTitle>
          <DialogDescription>
            Agrega una reserva directamente a tu calendario.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Hidden inputs to retain state */}
          <input type="hidden" {...register('scheduleId')} />
          <input type="hidden" {...register('date')} />
          <input type="hidden" {...register('slot')} />

          {initialDate && initialSlot && (
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/20 flex flex-col items-center justify-center text-center mb-4">
              <span className="text-xs font-medium text-primary">
                Reserva programada para
              </span>
              <span className="text-base font-bold">
                {initialDate.split('-').reverse().join('/')} a las {initialSlot}
              </span>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="guestName">Nombre del Cliente</Label>
            <Input
              id="guestName"
              {...register('guestName')}
              placeholder="Ej: Maria Lopez"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="guestEmail">Email del Cliente</Label>
            <Input
              id="guestEmail"
              type="email"
              {...register('guestEmail')}
              placeholder="maria@ejemplo.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Notas adicionales sobre la reserva..."
              className="resize-none min-h-[80px]"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Crear Reserva
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
