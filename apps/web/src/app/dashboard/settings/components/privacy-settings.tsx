'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Trash2, AlertTriangle, ExternalLink } from 'lucide-react';
import { deleteAccountAction } from '../settings-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function PrivacySettings() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'ELIMINAR MI CUENTA') {
      toast.error('El texto de confirmación no coincide.');
      return;
    }

    setIsPending(true);
    try {
      const result = await deleteAccountAction();
      if (result.success) {
        toast.success('Tu cuenta ha sido eliminada permanentemente.');
        router.push('/auth/login');
      } else {
        toast.error(result.error || 'No se pudo eliminar la cuenta.');
      }
    } catch {
      toast.error('Ocurrió un error inesperado.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Shield className="h-5 w-5" />
            <CardTitle>Privacidad y Datos</CardTitle>
          </div>
          <CardDescription>
            Tus datos están protegidos bajo la Ley 19.628 (Chile).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            En CalenBook respetamos tu privacidad. Puedes revisar cómo tratamos
            tus datos y los de tus clientes en cualquier momento.
          </p>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/privacidad" target="_blank">
              Ver Política de Privacidad{' '}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive mb-1">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle>Zona de Peligro</CardTitle>
          </div>
          <CardDescription className="text-destructive/80 font-medium">
            Eliminación permanente de cuenta y datos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {!isDeleting ? (
            <p className="text-muted-foreground">
              Al eliminar tu cuenta, se borrarán todos tus datos personales,
              agendas, reservas y sincronizaciones con Google Calendar de forma
              irreversible.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="bg-background border border-destructive/20 p-3 rounded-lg">
                <p className="text-destructive font-semibold mb-2">
                  Acción Irreversible
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Para confirmar la eliminación total de tu cuenta y todos los
                  datos asociados, escribe la siguiente frase exactamente como
                  aparece:
                </p>
                <p className="mt-2 font-mono font-bold text-foreground bg-muted p-2 rounded text-center select-none">
                  ELIMINAR MI CUENTA
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-delete">Confirmación</Label>
                <Input
                  id="confirm-delete"
                  placeholder="Escribe la frase aquí..."
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="bg-background border-destructive/50 focus-visible:ring-destructive"
                  autoFocus
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 border-t border-destructive/10 pt-4">
          {!isDeleting ? (
            <Button
              variant="destructive"
              onClick={() => setIsDeleting(true)}
              className="w-full sm:w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Eliminar mi Cuenta
            </Button>
          ) : (
            <>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={
                  confirmationText !== 'ELIMINAR MI CUENTA' || isPending
                }
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                {isPending ? 'Eliminando...' : 'Confirmar Eliminación'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsDeleting(false);
                  setConfirmationText('');
                }}
                disabled={isPending}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancelar
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
