import { createClient } from '@/lib/supabase/server';
import { BookingForm } from './components/booking-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string; scheduleId: string }>;
  searchParams: Promise<{ date: string; slot: string }>;
}) {
  const { username, scheduleId } = await params;
  const { date, slot } = await searchParams;

  if (!date || !slot) {
    return <div>Faltan detalles de la reserva</div>;
  }

  const supabase = await createClient();
  const { data: schedule } = await supabase
    .from('schedules')
    .select('*')
    .eq('id', scheduleId)
    .single();

  if (!schedule) {
    return <div>Agenda no encontrada</div>;
  }

  const bookingDate = parseISO(date);

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="bg-background border-b py-6 px-4">
        <div className="w-full px-4 md:px-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="cursor-pointer"
          >
            <Link href={`/u/${username}/${scheduleId}`}>
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            Confirmar Reserva
          </h1>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 mt-6 grid md:grid-cols-[1fr_350px] gap-8">
        <div className="order-2 md:order-1">
          <BookingForm
            scheduleId={scheduleId}
            username={username}
            date={date}
            slot={slot}
          />
        </div>

        <div className="order-1 md:order-2">
          <Card className="sticky top-8">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Resumen de la Cita</CardTitle>
              <CardDescription>{schedule.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Fecha</p>
                  <p className="text-sm text-muted-foreground uppercase">
                    {format(bookingDate, "EEEE, d 'de' MMMM, yyyy", {
                      locale: es,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Hora</p>
                  <p className="text-sm text-muted-foreground">
                    {slot} ({schedule.slot_duration_minutes} min)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
