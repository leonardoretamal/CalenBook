'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { NewBookingModal } from './new-booking-modal';
import { BookingCalendar } from '@/components/booking/booking-calendar';
import { BookingManagementDialog } from './booking-management-dialog';

export function BookingsClient({
  schedules,
}: {
  initialBookings?: { id: string; [key: string]: string | number | boolean }[];
  schedules: {
    id: string;
    name: string;
    is_active: boolean;
    [key: string]: unknown;
  }[];
}) {
  const [selectedScheduleId] = useState<string>(
    schedules.find((s) => s.is_active)?.id || schedules[0]?.id || ''
  );
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );

  // New Booking State
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [newBookingData, setNewBookingData] = useState<{
    date: string;
    slot: string;
    scheduleId: string;
  } | null>(null);

  const handleManageBooking = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsManagementOpen(true);
  };

  const handleCreateBooking = (dateStr: string, slot: string) => {
    setNewBookingData({
      date: dateStr,
      slot: slot,
      scheduleId: selectedScheduleId,
    });
    setIsNewBookingOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Gestiona tus citas y agrega nuevas manualmente haciendo clic en un
            horario del calendario.
          </p>
        </div>
      </div>

      {!selectedScheduleId ? (
        <Card className="border-dashed border-2 bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">No tienes agendas activas</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">
              Crea y activa una agenda en la sección de Disponibilidad para
              empezar a recibir e interactuar con tus reservas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <BookingCalendar
          scheduleId={selectedScheduleId}
          username="admin"
          isOwner={true}
          onManageBooking={handleManageBooking}
          onCreateBooking={handleCreateBooking}
        />
      )}

      <BookingManagementDialog
        bookingId={selectedBookingId}
        isOpen={isManagementOpen}
        onOpenChange={setIsManagementOpen}
      />

      <NewBookingModal
        isOpen={isNewBookingOpen}
        onOpenChange={(open) => {
          setIsNewBookingOpen(open);
          if (!open) {
            // Trigger custom event to let calendar clear its slot if needed
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('booking-modal-closed'));
            }
          }
        }}
        initialDate={newBookingData?.date}
        initialSlot={newBookingData?.slot}
        initialScheduleId={newBookingData?.scheduleId}
      />
    </div>
  );
}
