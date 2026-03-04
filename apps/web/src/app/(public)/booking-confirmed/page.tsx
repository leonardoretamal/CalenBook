'use client';

import { useState, useEffect } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Calendar, Loader2 } from 'lucide-react';

export default function BookingConfirmedPage() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full text-center p-8 border-emerald-500/20 shadow-xl animate-in zoom-in-95 duration-300">
        <div className="bg-emerald-500/15 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        </div>

        <CardTitle className="text-3xl font-bold">
          ¡Reserva Confirmada!
        </CardTitle>

        <CardDescription className="mt-4 text-base leading-relaxed">
          Tu cita ha sido validada con éxito. Hemos añadido el evento a tu
          Google Calendar y al del anfitrión.
        </CardDescription>

        <div className="mt-8 p-4 bg-muted/50 rounded-xl border flex items-center gap-3 text-left">
          <Calendar className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm font-medium text-muted-foreground">
            Revisa tu bandeja de entrada para ver los detalles finales y la
            invitación de Google.
          </p>
        </div>

        <Button
          className="mt-8 w-full h-12 text-base font-semibold cursor-pointer"
          variant="default"
          disabled={!isReady}
          onClick={() => window.close()}
        >
          {!isReady ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            'Cerrar Pestaña'
          )}
        </Button>

        <p className="mt-6 text-xs text-muted-foreground/60">
          Enviado por CalenBook - Gestión de Reservas Profesionales
        </p>
      </Card>
    </div>
  );
}
