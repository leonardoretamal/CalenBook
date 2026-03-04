import { getSchedules } from './actions';
import { AvailabilityList } from './components/availability-list';
import { CreateScheduleTrigger } from './components/create-schedule-trigger';

export default async function AvailabilityPage() {
  const schedules = await getSchedules();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Disponibilidad</h1>
          <p className="text-muted-foreground mt-2">
            Configura tus horarios de trabajo. Solo un horario puede estar
            activo a la vez para recibir reservas.
          </p>
        </div>
        <div className="flex-shrink-0">
          <CreateScheduleTrigger />
        </div>
      </div>

      <AvailabilityList initialSchedules={schedules} />
    </div>
  );
}
