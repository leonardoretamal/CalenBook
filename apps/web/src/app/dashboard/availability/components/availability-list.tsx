'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, CheckCircle2, Trash2, Edit2 } from 'lucide-react';
import { setActiveSchedule, deleteSchedule } from '../actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { ScheduleForm } from './schedule-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Schedule {
  id: string;
  name: string;
  is_active: boolean;
  slot_duration_minutes: number;
  weekly_schedule: Record<string, unknown>;
}

export function AvailabilityList({
  initialSchedules,
}: {
  initialSchedules: Schedule[];
}) {
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(
    null
  );
  const [scheduleToEdit, setScheduleToEdit] = useState<Schedule | null>(null);

  if (!initialSchedules || initialSchedules.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-muted/10">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">
            No tienes agendas configuradas
          </h3>
          <p className="text-muted-foreground mt-1 max-w-sm">
            Crea tu primera agenda definiendo qué días y horas estás disponible
            para recibir reservas de tus clientes.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSetActive = async (id: string, name: string) => {
    toast.promise(setActiveSchedule(id), {
      loading: 'Activando agenda...',
      success: `Agenda "${name}" activada correctamente.`,
      error: 'Error al activar agenda',
    });
  };

  const handleDelete = async () => {
    if (!scheduleToDelete) return;

    toast.promise(deleteSchedule(scheduleToDelete.id), {
      loading: 'Eliminando...',
      success: 'Agenda eliminada.',
      error: 'Error al eliminar',
    });
    setScheduleToDelete(null);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {initialSchedules.map((schedule) => (
        <Card
          key={schedule.id}
          className={`${schedule.is_active ? 'border-primary ring-1 ring-primary' : ''}`}
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{schedule.name}</CardTitle>
              {schedule.is_active && (
                <span className="flex items-center text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Activa
                </span>
              )}
            </div>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" /> Turnos de{' '}
              {schedule.slot_duration_minutes} min
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-sm text-muted-foreground">
              Días configurados: {Object.keys(schedule.weekly_schedule).length}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            {!schedule.is_active ? (
              <Button
                variant="default"
                className="w-full sm:flex-1 cursor-pointer"
                onClick={() => handleSetActive(schedule.id, schedule.name)}
              >
                Activar
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full sm:flex-1 cursor-not-allowed"
                disabled
              >
                Principal
              </Button>
            )}
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="icon"
                className="flex-1 sm:flex-none shrink-0 cursor-pointer"
                title="Editar"
                onClick={() => setScheduleToEdit(schedule)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="flex-1 sm:flex-none shrink-0 cursor-pointer"
                onClick={() => setScheduleToDelete(schedule)}
                disabled={schedule.is_active}
                title={
                  schedule.is_active
                    ? 'No puedes eliminar la agenda activa'
                    : 'Eliminar'
                }
              >
                <Trash2 className="w-4 h-4 cursor-pointer" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}

      <AlertDialog
        open={!!scheduleToDelete}
        onOpenChange={(open) => !open && setScheduleToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la agenda &quot;
              {scheduleToDelete?.name}&quot; y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {scheduleToEdit && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border w-full max-w-2xl rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Editar Agenda</h2>
              <ScheduleForm
                scheduleToEdit={scheduleToEdit}
                onSuccess={() => setScheduleToEdit(null)}
                onCancel={() => setScheduleToEdit(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
