'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Pencil, Loader2, Check, X } from 'lucide-react';
import { updateProfileName } from '../settings-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function ProfileForm({
  initialName,
  email,
}: {
  initialName: string;
  email: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName || '');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('El nombre no puede estar vacío');
      return;
    }
    if (name === initialName) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateProfileName(name.trim());
      if (result.success) {
        toast.success('Nombre actualizado correctamente');
        setIsEditing(false);
        router.refresh();
      } else {
        if (
          result.error?.includes('duplicate key') ||
          result.error?.includes('ya está en uso')
        ) {
          toast.error(
            'Este nombre ya está en uso por otro usuario. Por favor elige uno diferente.'
          );
        } else {
          toast.error(result.error || 'Ocurrió un error al guardar');
        }
        setName(initialName);
      }
    } catch {
      toast.error('Ocurrió un error al guardar');
      setName(initialName);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(initialName);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nombre Completo / Username</Label>
        <div className="flex gap-2">
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing || isSaving}
            className={!isEditing ? 'bg-muted/50 cursor-pointer' : ''}
            onClick={() => !isEditing && setIsEditing(true)}
            placeholder="Tu nombre completo"
          />
          {!isEditing ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(true)}
              title="Editar nombre"
              className="cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button
                variant="default"
                size="icon"
                onClick={handleSave}
                disabled={isSaving}
                title="Guardar"
                className="cursor-pointer bg-green-600 hover:bg-green-700 text-white"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCancel}
                disabled={isSaving}
                title="Cancelar"
                className="cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <div className="flex gap-2">
          <Input id="email" value={email} disabled className="bg-muted" />
          <Button
            variant="outline"
            size="icon"
            disabled
            title="No se puede cambiar el correo"
          >
            <Mail className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Tu correo principal para notificaciones y Google Calendar.
        </p>
      </div>
    </div>
  );
}
