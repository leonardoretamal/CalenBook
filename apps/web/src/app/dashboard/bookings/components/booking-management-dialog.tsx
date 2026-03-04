'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Mail,
  Clock,
  Calendar as CalendarIcon,
  Loader2,
  Trash2,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function BookingManagementDialog({
  bookingId,
  isOpen,
  onOpenChange,
  onDeleted,
}: {
  bookingId: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}) {
  const [booking, setBooking] = useState<{
    id: string;
    guest_name: string;
    guest_email: string;
    notes?: string;
    start_time: string;
    end_time: string;
    status: string;
    schedule_id?: string;
    schedules?: { name: string }; // Added schedules type based on select('*, schedules(name)')
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (bookingId && isOpen) {
      const fetchBooking = async () => {
        setIsLoading(true);
        const { data } = await supabase
          .from('bookings')
          .select('*, schedules(name)')
          .eq('id', bookingId)
          .single();
        setBooking(data);
        setIsLoading(false);
      };
      fetchBooking();
    }
  }, [bookingId, isOpen, supabase]);

  const handleDelete = async () => {
    if (!bookingId) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      toast.success('Reserva eliminada permanentemente');
      onOpenChange(false);
      onDeleted?.();
      router.refresh();
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Error al cancelar la reserva');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-32px)] md:max-w-[425px] w-full p-4 md:p-6">
        <DialogHeader className="text-left">
          <DialogTitle>Detalle de la Reserva</DialogTitle>
          <DialogDescription>
            Información del cliente y horario seleccionado.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p className="text-sm">Cargando detalles...</p>
          </div>
        ) : booking ? (
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-primary/20">
                {booking.guest_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-lg">{booking.guest_name}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" /> {booking.guest_email}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border border-border/50">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Servicio
                </span>
                <p className="text-sm font-medium">{booking.schedules?.name}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Estado
                </span>
                <p
                  className={`text-sm font-medium ${
                    booking.status === 'confirmed'
                      ? 'text-green-600'
                      : booking.status === 'pending'
                        ? 'text-yellow-500'
                        : 'text-red-500'
                  }`}
                >
                  {booking.status === 'confirmed'
                    ? 'Confirmado'
                    : booking.status === 'pending'
                      ? 'Pendiente'
                      : 'Cancelado'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Fecha
                </span>
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <CalendarIcon className="h-3 w-3" />
                  {format(parseISO(booking.start_time), "d 'de' MMM", {
                    locale: es,
                  })}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Horario
                </span>
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Clock className="h-3 w-3" />
                  {format(parseISO(booking.start_time), 'HH:mm')} -{' '}
                  {format(parseISO(booking.end_time), 'HH:mm')}
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="bg-muted/30 p-4 rounded-lg border border-border/50 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Notas adicionales del cliente
                </span>
                <p className="text-sm font-medium whitespace-pre-wrap">
                  {booking.notes}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center text-destructive">
            No se pudo cargar la reserva.
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="destructive"
            className="w-full sm:w-auto cursor-pointer"
            onClick={handleDelete}
            disabled={isDeleting || !booking}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Eliminar Reserva
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
