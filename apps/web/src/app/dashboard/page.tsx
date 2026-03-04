import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CalendarDays,
  Clock,
  CalendarCheck2,
  CalendarRange,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { CopyUrlButton } from '@/components/dashboard/copy-url-button';
import { startOfWeek, endOfWeek } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RecentActivity } from './components/recent-activity';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- Queries ---

  // 1. Reservas Pendientes (status = 'pending')
  const { count: pendingBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user?.id)
    .eq('status', 'pending');

  // 2. Reservas Hoy (start_time entre inicio y fin del día)
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  ).toISOString();
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  ).toISOString();

  const { count: todayBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user?.id)
    .gte('start_time', startOfToday)
    .lte('start_time', endOfToday)
    .neq('status', 'cancelled');

  // 3. Disponibilidades Creadas (TODAS, no solo activas)
  const { count: totalSchedules } = await supabase
    .from('schedules')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user?.id);

  // 4. Reservas Registradas (total de bookings, no emails únicos)
  const { count: totalBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user?.id);

  // 5. Reservas Confirmadas (status = 'confirmed')
  const { count: confirmedBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user?.id)
    .eq('status', 'confirmed');

  // 6. Reservas Esta Semana
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString();
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }).toISOString();

  const { count: weekBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user?.id)
    .gte('start_time', weekStart)
    .lte('start_time', weekEnd)
    .neq('status', 'cancelled');

  // New: Check Google connection
  const { data: owner } = await supabase
    .from('owners')
    .select('google_refresh_token')
    .eq('id', user?.id)
    .single();

  const isGoogleConnected = !!owner?.google_refresh_token;

  // 7. Actividad Reciente (últimas 5 reservas)
  const { data: recentBookings } = await supabase
    .from('bookings')
    .select('*, schedules(name)')
    .eq('owner_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      {/* Warning Alert if Google is not connected */}
      {!isGoogleConnected && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 p-2 rounded-full">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-orange-900">
                Google Calendar no conectado
              </p>
              <p className="text-sm text-orange-700/80">
                Las reservas no se sincronizarán con tu calendario hasta que
                vincules tu cuenta.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-orange-500/30 hover:bg-orange-500/20 text-orange-700"
            asChild
          >
            <Link href="/dashboard/settings">Conectar ahora</Link>
          </Button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hola, {user?.user_metadata?.full_name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-muted-foreground mt-2">
            Este es tu resumen de reservas y disponibilidad.
          </p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col gap-3 max-w-lg w-full">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <CalendarDays className="h-4 w-4" />
            Tu Enlace Público de Reservas
          </div>
          <CopyUrlButton
            url={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/u/${user?.user_metadata?.full_name?.toLowerCase().replace(/\s+/g, '-') || user?.id}`}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Reservas Pendientes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Reservas Pendientes
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requieren tu confirmación
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Reservas Hoy */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reservas Hoy</CardTitle>
            <CalendarDays className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayBookings || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Citas programadas para hoy
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Disponibilidades Creadas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Disponibilidades Creadas
            </CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSchedules || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de agendas configuradas
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Reservas Registradas (antes "Usuarios Registrados") */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Reservas Registradas
            </CardTitle>
            <CalendarCheck2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total histórico de reservas
            </p>
          </CardContent>
        </Card>

        {/* Card 5: Reservas Confirmadas (NUEVA) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Reservas Confirmadas
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedBookings || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Citas en estado confirmado
            </p>
          </CardContent>
        </Card>

        {/* Card 6: Reservas Esta Semana (NUEVA) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Reservas Esta Semana
            </CardTitle>
            <CalendarRange className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekBookings || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Citas de lunes a domingo
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <RecentActivity bookings={recentBookings || []} />
      </div>
    </div>
  );
}
