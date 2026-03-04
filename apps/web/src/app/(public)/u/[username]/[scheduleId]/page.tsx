import { createClient } from '@/lib/supabase/server';
import { BookingCalendar } from '@/components/booking/booking-calendar';
import { CardDescription } from '@/components/ui/card';

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ username: string; scheduleId: string }>;
}) {
  const { username, scheduleId } = await params;
  const supabase = await createClient();

  const { data: schedule } = await supabase
    .from('schedules')
    .select('*')
    .eq('id', scheduleId)
    .single();

  if (!schedule) {
    return <div>Agenda no encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="bg-background border-b py-6 px-4">
        <div className="w-full px-4 md:px-8 flex flex-col items-center text-center gap-1">
          <h1 className="text-2xl font-bold tracking-tight">{schedule.name}</h1>
          <CardDescription>
            Selecciona un horario para tu cita de{' '}
            {schedule.slot_duration_minutes} min.
          </CardDescription>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 mt-6">
        <BookingCalendar scheduleId={scheduleId} username={username} />
      </div>
    </div>
  );
}
