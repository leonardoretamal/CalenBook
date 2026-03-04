'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updatePassword } from '../settings-actions';
import { useRouter } from 'next/navigation';

export function PasswordUpdateForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    // 1. Validations
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden.');
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updatePassword({
        currentPassword,
        newPassword,
      });

      if (result.success) {
        toast.success('Contraseña actualizada correctamente.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error('Ocurrió un error inesperado al actualizar la contraseña.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="current-password">Contraseña Actual</Label>
        <PasswordInput
          id="current-password"
          placeholder="Tu contraseña actual"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={isUpdating}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="new-password">Nueva Contraseña</Label>
        <PasswordInput
          id="new-password"
          placeholder="Mínimo 8 caracteres"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isUpdating}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
        <PasswordInput
          id="confirm-password"
          placeholder="Repite la nueva contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isUpdating}
        />
      </div>
      <div className="pt-2">
        <Button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="cursor-pointer"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Actualizando...
            </>
          ) : (
            'Actualizar Contraseña'
          )}
        </Button>
      </div>
    </div>
  );
}
