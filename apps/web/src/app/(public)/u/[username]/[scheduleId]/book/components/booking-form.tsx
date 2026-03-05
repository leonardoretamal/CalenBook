'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Loader2, Info } from 'lucide-react';
import { createBooking } from '../../../../../booking-actions';
import { toast } from 'sonner';

const bookingSchema = z.object({
  guestName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  guestEmail: z.string().email('Correo electrónico inválido'),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function BookingForm({
  scheduleId,
  username,
  date,
  slot,
}: {
  scheduleId: string;
  username: string;
  date: string;
  slot: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createBooking({
        scheduleId,
        username,
        date,
        slot,
        ...data,
        isManual: false,
      });

      if (result.success) {
        setIsSuccess(true);
        toast.success('¡Reserva enviada con éxito!');
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error('Ocurrió un error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isReady, setIsReady] = useState(false);

  // Delay before allowing close
  if (isSuccess && !isReady) {
    setTimeout(() => setIsReady(true), 3000);
  }

  if (isSuccess) {
    return (
      <Card className="max-w-md mx-auto text-center p-8 border-primary/20 bg-primary/5">
        <Info className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <CardTitle className="text-2xl">¡Reserva Enviada!</CardTitle>
        <CardDescription className="mt-2 text-base">
          Hemos enviado un correo de confirmación a tu bandeja de entrada.
        </CardDescription>
        <Button
          className="mt-8 w-full cursor-pointer"
          variant="outline"
          disabled={!isReady}
          onClick={() => window.close()}
        >
          {!isReady ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            'Cerrar ventana'
          )}
        </Button>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Tus Datos</CardTitle>
        <CardDescription>
          Completa el formulario para finalizar tu reserva.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">Nombre Completo</Label>
            <Input
              id="guestName"
              placeholder="Juan Pérez"
              {...register('guestName')}
              className={errors.guestName ? 'border-destructive' : ''}
            />
            {errors.guestName && (
              <p className="text-xs text-destructive">
                {errors.guestName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="guestEmail">Correo Electrónico</Label>
            <Input
              id="guestEmail"
              type="email"
              placeholder="juan@ejemplo.com"
              {...register('guestEmail')}
              className={errors.guestEmail ? 'border-destructive' : ''}
            />
            {errors.guestEmail && (
              <p className="text-xs text-destructive">
                {errors.guestEmail.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas adicionales (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="¿Hay algo que debamos saber antes de la cita?"
              {...register('notes')}
              className="resize-y min-h-[80px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex items-start space-x-2 py-2">
            <input
              type="checkbox"
              id="privacy"
              required
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
            <label
              htmlFor="privacy"
              className="text-sm text-muted-foreground leading-tight"
            >
              Acepto que mis datos sean tratados según la{' '}
              <Link
                href="/privacidad"
                className="text-primary hover:underline font-medium"
                target="_blank"
              >
                <p className="mt-2 font-mono font-bold text-foreground bg-muted p-2 rounded text-center select-none">
                  ELIMINAR MI CUENTA
                </p>
                Política de Privacidad
              </Link>
              .
            </label>
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirmando...
              </>
            ) : (
              'Confirmar Reserva'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
