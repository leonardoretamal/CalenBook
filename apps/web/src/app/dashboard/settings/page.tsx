import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bell, Shield } from 'lucide-react';

import { PasswordInput } from '@/components/ui/password-input';
import { ProfileForm } from './components/profile-form';
import { GoogleCalendarCard } from './components/google-calendar-card';
import { PasswordUpdateForm } from './components/password-update-form';

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: owner } = await supabase
    .from('owners')
    .select('google_refresh_token')
    .eq('id', user?.id)
    .single();

  const isGoogleConnected = !!owner?.google_refresh_token;

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ajustes</h1>
        <p className="text-muted-foreground">
          Administra tu perfil y preferencias de cuenta.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Perfil del Propietario</CardTitle>
            <CardDescription>
              Esta información será visible en tu página pública de reservas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <ProfileForm
              initialName={user?.user_metadata?.full_name || ''}
              email={user?.email || ''}
            />
          </CardContent>
        </Card>

        <GoogleCalendarCard isGoogleConnected={isGoogleConnected} />

        <Card>
          <CardHeader>
            <CardTitle>Seguridad</CardTitle>
            <CardDescription>
              Actualiza tu contraseña para mantener tu cuenta segura.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <PasswordUpdateForm />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="opacity-60 cursor-not-allowed">
            <CardHeader className="pb-3">
              <Bell className="h-5 w-5 text-primary mb-2" />
              <CardTitle className="text-lg">Notificaciones</CardTitle>
              <CardDescription>
                Configura alertas de nuevas reservas.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="opacity-60 cursor-not-allowed">
            <CardHeader className="pb-3">
              <Shield className="h-5 w-5 text-primary mb-2" />
              <CardTitle className="text-lg">Privacidad</CardTitle>
              <CardDescription>
                Configuración avanzada de privacidad.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
