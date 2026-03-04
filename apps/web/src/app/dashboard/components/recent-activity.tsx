'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarDays, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type Booking = {
  id: string;
  guest_name: string;
  guest_email: string;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
  schedules?: { name: string };
};

export function RecentActivity({ bookings }: { bookings: Booking[] }) {
  if (!bookings || bookings.length === 0) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Tus últimas reservas recibidas aparecerán aquí.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-t border-border/50 bg-muted/20">
          <CalendarDays className="h-10 w-10 mb-4 opacity-50" />
          <p>Todavía no tienes reservas en el historial.</p>
          <p className="text-sm mt-1">
            Comparte el enlace de tu agenda para empezar.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
          >
            Confirmado
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge
            variant="outline"
            className="border-red-500/30 text-red-600 bg-red-500/10"
          >
            Cancelado
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge
            variant="outline"
            className="border-orange-500/30 text-orange-600 bg-orange-500/10"
          >
            Pendiente
          </Badge>
        );
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Tus 5 reservas más recientes.</CardDescription>
        </div>
        <Link
          href="/dashboard/bookings"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 underline-offset-4 hover:underline"
        >
          Ver todas
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 hidden sm:block">
                  {getStatusIcon(booking.status)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium leading-none">
                      {booking.guest_name}
                    </p>
                    <span className="sm:hidden">
                      {getStatusBadge(booking.status)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {booking.guest_email}
                  </p>
                  {booking.schedules?.name && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 mt-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {booking.schedules.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                <div className="text-sm text-right">
                  <div className="font-medium text-foreground">
                    {format(parseISO(booking.start_time), 'd MMM yyyy', {
                      locale: es,
                    })}
                  </div>
                  <div className="text-muted-foreground">
                    {format(parseISO(booking.start_time), 'HH:mm')} -{' '}
                    {format(parseISO(booking.end_time), 'HH:mm')}
                  </div>
                </div>
                <div className="hidden sm:block">
                  {getStatusBadge(booking.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
