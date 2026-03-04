'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { disconnectGoogleCalendar } from '../settings-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function GoogleCalendarCard({
  isGoogleConnected,
}: {
  isGoogleConnected: boolean;
}) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const router = useRouter();

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      const result = await disconnectGoogleCalendar();
      if (result.success) {
        toast.success('Cuenta de Google desconectada');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error('Ocurrió un error al desconectar');
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Calendar</CardTitle>
        <CardDescription>
          Sincroniza tus reservas automáticamente con tu calendario personal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border ${
            isGoogleConnected
              ? 'bg-green-500/10 border-green-500/20'
              : 'bg-orange-500/10 border-orange-500/20'
          }`}
        >
          <div
            className={`p-2 rounded-full self-start sm:self-auto ${
              isGoogleConnected ? 'bg-green-500/20' : 'bg-orange-500/20'
            }`}
          >
            <Calendar
              className={`h-6 w-6 ${
                isGoogleConnected ? 'text-green-500' : 'text-orange-500'
              }`}
            />
          </div>
          <div className="flex-1">
            <p className="font-medium">
              {isGoogleConnected ? 'Cuenta conectada' : 'Cuenta no vinculada'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {isGoogleConnected
                ? 'Tus eventos se están sincronizando correctamente. Las nuevas reservas aparecerán en tu calendario.'
                : 'Conecta tu cuenta para evitar solapamientos y ver tus citas en Google.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
            {isGoogleConnected ? (
              <>
                <Button
                  variant="destructive"
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                  className="cursor-pointer whitespace-nowrap"
                >
                  {isDisconnecting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Desconectar
                </Button>
                <Button variant="outline" asChild className="cursor-pointer">
                  <Link href="/api/auth/google">Re-conectar</Link>
                </Button>
              </>
            ) : (
              <Button asChild className="cursor-pointer">
                <Link href="/api/auth/google">Conectar cuenta</Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
